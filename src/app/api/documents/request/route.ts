import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { escapeHtml, getNotifyEmail } from "@/lib/notify";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, document, productName, productSlug } = (body ?? {}) as {
    email?: unknown;
    document?: unknown;
    productName?: unknown;
    productSlug?: unknown;
  };

  if (
    typeof email !== "string" ||
    typeof document !== "string" ||
    typeof productName !== "string" ||
    typeof productSlug !== "string" ||
    !document ||
    !productName ||
    !productSlug
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  if (!checkRateLimit(`doc-request:${email.trim().toLowerCase()}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests — try again later" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.OTP_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    console.error("Document request failed: RESEND_API_KEY or OTP_FROM_EMAIL is not configured");
    return NextResponse.json({ error: "Email sending isn't configured yet" }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: getNotifyEmail(),
      reply_to: email.trim(),
      subject: `Document request — ${document} for ${productName}`,
      html: `
        <div style="font-family:Arial,sans-serif;font-size:15px;color:#0d1526;">
          <p>A visitor requested a document on the product page.</p>
          <table>
            <tr><td style="padding:6px 16px 6px 0;color:#56607a;white-space:nowrap;">Document</td><td style="padding:6px 0;">${escapeHtml(document)}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#56607a;white-space:nowrap;">Product</td><td style="padding:6px 0;">${escapeHtml(productName)} (/products/${escapeHtml(productSlug)})</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#56607a;white-space:nowrap;">Send to</td><td style="padding:6px 0;">${escapeHtml(email.trim())}</td></tr>
          </table>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend API error (document request)", res.status, detail);
    return NextResponse.json({ error: "Couldn't send your request — try again" }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}
