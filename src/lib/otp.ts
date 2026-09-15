import { createHash, createHmac, timingSafeEqual } from "crypto";

// stateless OTP tokens: instead of storing "email -> code" server-side
// (which needs a database/Redis to survive across serverless invocations),
// the code's hash + expiry + email are signed into a token that round-trips
// through the client between /send and /verify. The client never sees the
// raw code in the token — only its SHA-256 hash — so intercepting the
// network response doesn't hand over a usable code.
const OTP_TTL_MS = 10 * 60 * 1000;
const VERIFIED_TICKET_TTL_MS = 30 * 60 * 1000;

function secret(): string {
  const s = process.env.OTP_SECRET;
  if (!s) throw new Error("OTP_SECRET is not set");
  return s;
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function generateOtpCode(): string {
  // 6 digits, zero-padded — Math.random is fine here, the code is only
  // ever compared against a signed hash with a 10-minute expiry, not used
  // as a cryptographic secret itself
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
}

export function createOtpToken(email: string, code: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + OTP_TTL_MS;
  const payload = `${normalizedEmail}:${sha256(code)}:${expiresAt}`;
  const signature = sign(payload);
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function verifyOtpToken(
  token: string,
  email: string,
  code: string
): { ok: true } | { ok: false; reason: "expired" | "invalid" | "mismatch" } {
  let decoded: string;
  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return { ok: false, reason: "invalid" };
  }

  const parts = decoded.split(":");
  if (parts.length !== 4) return { ok: false, reason: "invalid" };
  const [tokenEmail, codeHash, expiresAtStr, signature] = parts;

  const payload = `${tokenEmail}:${codeHash}:${expiresAtStr}`;
  const expectedSignature = sign(payload);
  const sigBuf = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expectedSignature, "hex");
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return { ok: false, reason: "invalid" };
  }

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return { ok: false, reason: "expired" };
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (tokenEmail !== normalizedEmail) return { ok: false, reason: "mismatch" };
  if (codeHash !== sha256(code.trim())) return { ok: false, reason: "mismatch" };

  return { ok: true };
}

// issued once /api/otp/verify confirms a code, and required by
// /api/contact/submit before it will actually send anything. Without
// this, "disable the Submit button until verified" is only a client-side
// JS check — trivially bypassed via devtools — so the real enforcement
// has to live server-side too.
export function createVerifiedTicket(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + VERIFIED_TICKET_TTL_MS;
  const payload = `verified:${normalizedEmail}:${expiresAt}`;
  const signature = sign(payload);
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function verifyVerifiedTicket(ticket: string, email: string): boolean {
  let decoded: string;
  try {
    decoded = Buffer.from(ticket, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const parts = decoded.split(":");
  if (parts.length !== 4 || parts[0] !== "verified") return false;
  const [, ticketEmail, expiresAtStr, signature] = parts;

  const payload = `verified:${ticketEmail}:${expiresAtStr}`;
  const expectedSignature = sign(payload);
  const sigBuf = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expectedSignature, "hex");
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return ticketEmail === email.trim().toLowerCase();
}
