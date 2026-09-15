"use client";

import { useState } from "react";

// shared submit logic for all three contact forms — reads the form's
// own fields via FormData (so file inputs come along for free), attaches
// the OTP-verified ticket, and posts to /api/contact/submit. formType
// tags the notification email's subject so it's obvious which form it
// came from.
export function useContactSubmit(formType: "direct" | "join" | "project") {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(form: HTMLFormElement, ticket: string | null) {
    if (!ticket || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData(form);
      formData.set("formType", formType);
      formData.set("ticket", ticket);
      const res = await fetch("/api/contact/submit", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.sent) {
        setError(data.error ?? "Couldn't send your submission — try again");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Couldn't reach the server — try again");
    } finally {
      setSubmitting(false);
    }
  }

  return { submit, submitting, submitted, error };
}
