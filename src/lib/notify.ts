// single source of truth for "where do inbound requests from this site
// go" — used by /api/contact/submit and /api/documents/request so a
// document request lands in literally the same inbox as a contact form
// submission, not a second hardcoded address that could drift out of
// sync with it. CONTACT_NOTIFY_EMAIL overrides both for testing;
// unset falls back to the real client address.
export function getNotifyEmail(): string {
  return process.env.CONTACT_NOTIFY_EMAIL || "sowtrap@scienceonwheels.in";
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
