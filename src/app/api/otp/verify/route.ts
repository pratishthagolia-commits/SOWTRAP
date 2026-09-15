import { NextResponse } from "next/server";
import { createVerifiedTicket, verifyOtpToken } from "@/lib/otp";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const REASON_MESSAGE: Record<string, string> = {
  expired: "That code has expired — send a new one",
  invalid: "That code isn't valid — send a new one",
  mismatch: "Incorrect code",
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, code, token } = (body ?? {}) as { email?: unknown; code?: unknown; token?: unknown };
  if (typeof email !== "string" || typeof code !== "string" || typeof token !== "string") {
    return NextResponse.json({ error: "Missing email, code, or token" }, { status: 400 });
  }

  // 8 verify attempts per email per 10 minutes — enough for genuine
  // typos, tight enough to make brute-forcing a 6-digit code impractical
  if (!checkRateLimit(`verify:${email.toLowerCase()}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts — request a new code" }, { status: 429 });
  }

  const result = verifyOtpToken(token, email, code);
  if (!result.ok) {
    return NextResponse.json({ verified: false, error: REASON_MESSAGE[result.reason] }, { status: 200 });
  }

  return NextResponse.json({ verified: true, ticket: createVerifiedTicket(email) });
}
