import { NextResponse } from "next/server";
import { createOtpToken, generateOtpCode } from "@/lib/otp";
import { checkRateLimit } from "@/lib/rateLimit";

// needs Node's crypto module (via lib/otp.ts) and outbound fetch to
// Resend — the default Node runtime, not edge
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = typeof (body as { email?: unknown })?.email === "string" ? (body as { email: string }).email.trim() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  // 5 sends per email per 10 minutes — generous for legitimate retries
  // (typo'd address, didn't arrive) but blocks spamming one inbox
  if (!checkRateLimit(`send:${email.toLowerCase()}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests for this email — try again shortly" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.OTP_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    console.error("OTP send failed: RESEND_API_KEY or OTP_FROM_EMAIL is not configured");
    return NextResponse.json({ error: "Email sending isn't configured yet" }, { status: 500 });
  }

  const code = generateOtpCode();
  const token = createOtpToken(email, code);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject: "Your SowTrap verification code",
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #0d1526;">
          <p>Your SowTrap™ verification code is:</p>
          <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 20px 0;">${code}</p>
          <p style="color: #56607a;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend API error", res.status, detail);
    return NextResponse.json({ error: "Couldn't send the verification email — try again" }, { status: 502 });
  }

  return NextResponse.json({ token });
}
