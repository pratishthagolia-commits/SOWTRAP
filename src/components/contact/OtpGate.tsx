"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "verifying" | "verified" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_S = 30;

// dropped right under the email field on each contact form — sends a
// 6-digit code to that address, verifies it against the server, and
// reports back up via onVerifiedChange so the parent form can keep its
// Submit button disabled until this says true. Also hands up the signed
// "verified ticket" the server issued, which the parent must send along
// with the actual submission — the disabled button alone is only a
// client-side check, so the real enforcement lives in /api/contact/submit
// checking this ticket server-side.
export default function OtpGate({
  email,
  onVerifiedChange,
  dark = false,
}: {
  email: string;
  onVerifiedChange: (verified: boolean, ticket: string | null) => void;
  dark?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [code, setCode] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const verifiedEmailRef = useRef<string | null>(null);

  // editing the email after verifying invalidates that verification —
  // the token/code that was checked belonged to the old address
  useEffect(() => {
    if (status === "verified" && verifiedEmailRef.current !== email.trim().toLowerCase()) {
      setStatus("idle");
      setToken(null);
      setCode("");
      onVerifiedChange(false, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const emailValid = EMAIL_RE.test(email.trim());

  async function handleSend() {
    if (!emailValid || status === "sending" || cooldown > 0) return;
    setStatus("sending");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error ?? "Couldn't send the code — try again");
        setStatus("error");
        return;
      }
      setToken(data.token);
      setCode("");
      setStatus("sent");
      setCooldown(RESEND_COOLDOWN_S);
    } catch {
      setErrorMessage("Couldn't reach the server — try again");
      setStatus("error");
    }
  }

  async function handleVerify() {
    if (!token || code.trim().length !== 6 || status === "verifying") return;
    setStatus("verifying");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim(), token }),
      });
      const data = await res.json();
      if (!res.ok || !data.verified) {
        setErrorMessage(data.error ?? "Incorrect code");
        setStatus("sent");
        return;
      }
      verifiedEmailRef.current = email.trim().toLowerCase();
      setStatus("verified");
      onVerifiedChange(true, data.ticket);
    } catch {
      setErrorMessage("Couldn't reach the server — try again");
      setStatus("sent");
    }
  }

  if (status === "verified") {
    return <p className={`otp-status otp-status--ok${dark ? " otp-status--dark" : ""}`}>Email verified</p>;
  }

  return (
    <div className={`otp-gate${dark ? " otp-gate--dark" : ""}`}>
      <button
        type="button"
        className="otp-send-btn"
        onClick={handleSend}
        disabled={!emailValid || status === "sending" || cooldown > 0}
      >
        {status === "sending"
          ? "Sending…"
          : cooldown > 0
          ? `Resend code (${cooldown}s)`
          : status === "sent" || status === "verifying" || status === "error"
          ? "Resend code"
          : "Send verification code"}
      </button>

      {(status === "sent" || status === "verifying" || status === "error") && token && (
        <div className="otp-code-row">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="otp-code-input"
          />
          <button
            type="button"
            className="otp-verify-btn"
            onClick={handleVerify}
            disabled={code.length !== 6 || status === "verifying"}
          >
            {status === "verifying" ? "Verifying…" : "Verify"}
          </button>
        </div>
      )}

      {errorMessage && <p className="otp-status otp-status--error">{errorMessage}</p>}
    </div>
  );
}
