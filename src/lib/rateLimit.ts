// in-memory sliding-window limiter — a speed bump against a single
// caller spamming /api/otp/send or /api/otp/verify, not a security
// boundary (that's the signed, expiring token in otp.ts). In-memory is
// fine for this: worst case it resets on a cold start or restart, which
// just means one caller gets a few extra free attempts, not a break.
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= max) {
    hits.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  hits.set(key, timestamps);
  return true;
}
