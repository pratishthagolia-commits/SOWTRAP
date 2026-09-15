import { NextResponse } from "next/server";
import { verifyVerifiedTicket } from "@/lib/otp";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

// overridable via env so submissions can be pointed at a test inbox
// during development without touching code — CONTACT_NOTIFY_EMAIL unset
// falls back to the real client address
const NOTIFY_TO = process.env.CONTACT_NOTIFY_EMAIL || "sowtrap@scienceonwheels.in";
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5MB per file

const SUBJECTS: Record<string, string> = {
  direct: "New direct enquiry",
  join: "New job application",
  project: "New project inquiry",
};

const LABELS: Record<string, string> = {
  name: "Name",
  organization: "Organization",
  email: "Email",
  phone: "Phone",
  enquiry: "Enquiry Regarding",
  audience: "I am a",
  lookingFor: "What are you looking for",
  detail: "Requirement",
  interest: "Area of Interest",
  experience: "Experience",
  message: "Message / Brief Profile",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const formType = String(formData.get("formType") ?? "");
  const ticket = String(formData.get("ticket") ?? "");
  const email = String(formData.get("email") ?? "");

  if (!formType || !SUBJECTS[formType] || !ticket || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // the real enforcement of "must verify email before submitting" — the
  // disabled Submit button is only a client-side convenience, this ticket
  // (signed by /api/otp/verify) is what actually proves it server-side
  if (!verifyVerifiedTicket(ticket, email)) {
    return NextResponse.json({ error: "Please verify your email before submitting" }, { status: 403 });
  }

  if (!checkRateLimit(`submit:${email.toLowerCase()}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions — try again later" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.OTP_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    console.error("Contact submit failed: RESEND_API_KEY or OTP_FROM_EMAIL is not configured");
    return NextResponse.json({ error: "Email sending isn't configured yet" }, { status: 500 });
  }

  const fieldRows: [string, string][] = [];
  const attachments: { filename: string; content: string }[] = [];
  let phoneCode = "";
  let phoneNumber = "";

  for (const [key, value] of formData.entries()) {
    if (key === "formType" || key === "ticket") continue;

    if (value instanceof File) {
      if (value.size === 0) continue;
      if (value.size > MAX_ATTACHMENT_BYTES) {
        return NextResponse.json({ error: `${value.name} is too large (max 5MB)` }, { status: 400 });
      }
      const buffer = Buffer.from(await value.arrayBuffer());
      attachments.push({ filename: value.name, content: buffer.toString("base64") });
      continue;
    }

    if (key === "phoneCode") {
      phoneCode = value;
      continue;
    }
    if (key === "phone") {
      phoneNumber = value;
      continue;
    }
    if (!value) continue;
    fieldRows.push([LABELS[key] ?? key, value]);
  }

  if (phoneNumber) {
    const emailIndex = fieldRows.findIndex(([label]) => label === "Email");
    fieldRows.splice(emailIndex + 1, 0, ["Phone", phoneCode ? `${phoneCode} ${phoneNumber}` : phoneNumber]);
  }

  const rowsHtml = fieldRows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#56607a;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#0d1526;">${escapeHtml(value).replace(/\n/g, "<br/>")}</td></tr>`
    )
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: NOTIFY_TO,
      reply_to: email,
      subject: `${SUBJECTS[formType]} — ${formData.get("name") ?? email}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;"><table>${rowsHtml}</table></div>`,
      attachments: attachments.length > 0 ? attachments : undefined,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend API error (contact submit)", res.status, detail);
    return NextResponse.json({ error: "Couldn't send your submission — try again" }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}
