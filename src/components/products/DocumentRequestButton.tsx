"use client";

import { useState } from "react";

// "On Request" for every document (COA/TDS/MSDS/Clinical Evidence) — was
// a disabled, unclickable label before. Clicking opens a small modal
// asking which email to send it to; the request itself goes to the same
// inbox contact-form submissions do (see src/lib/notify.ts), with the
// requester's address as reply-to.
export default function DocumentRequestButton({
  document,
  productName,
  productSlug,
}: {
  document: string;
  productName: string;
  productSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/documents/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), document, productName, productSlug }),
      });
      const data = await res.json();
      if (!res.ok || !data.sent) {
        setError(data.error ?? "Couldn't send your request — try again");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Couldn't reach the server — try again");
      setStatus("error");
    }
  }

  function close() {
    setOpen(false);
    // small delay so the reset doesn't flash before the modal is gone
    setTimeout(() => {
      setStatus("idle");
      setEmail("");
      setError(null);
    }, 250);
  }

  return (
    <>
      <button type="button" className="product-detail-download-action" onClick={() => setOpen(true)}>
        On Request
      </button>

      {open && (
        <div className="doc-request-overlay" role="presentation" onClick={close}>
          <div
            className="doc-request-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Request ${document}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="doc-request-close" aria-label="Close" onClick={close}>
              &times;
            </button>

            {status === "sent" ? (
              <>
                <h3 className="doc-request-title">Request sent</h3>
                <p className="doc-request-body">
                  Thanks — we&rsquo;ll send the {document} for {productName} to that email shortly.
                </p>
              </>
            ) : (
              <>
                <h3 className="doc-request-title">Request {document}</h3>
                <p className="doc-request-body">
                  Enter the email you&rsquo;d like us to send the {document} for {productName} to.
                </p>
                <form className="doc-request-form" onSubmit={submit}>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="btn btn-lime" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send Request"}
                  </button>
                </form>
                {error && <p className="doc-request-error">{error}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
