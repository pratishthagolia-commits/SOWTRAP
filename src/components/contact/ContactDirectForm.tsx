"use client";

import { useState } from "react";
import FormSelect from "./FormSelect";
import PhoneInput from "./PhoneInput";
import OtpGate from "./OtpGate";
import { useContactSubmit } from "./useContactSubmit";

const ENQUIRY_OPTIONS = [
  "Ingredient / Raw Material",
  "Encapsulation Technology",
  "Scientific Consultation",
  "Scale-Up & Manufacturing",
  "Research Collaboration",
  "Other",
];

export default function ContactDirectForm() {
  const [email, setEmail] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTicket, setOtpTicket] = useState<string | null>(null);
  const { submit, submitting, submitted, error } = useContactSubmit("direct");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!otpVerified || !otpTicket) return;
    submit(e.currentTarget, otpTicket);
  }

  return (
    <section className="contact-form-section contact-form-section--alt">
      <p className="contact-form-kicker">Prefer to speak directly?</p>
      <h2 className="contact-form-heading">Don&apos;t Know Where to Start? Speak to Our Experts.</h2>
      <p className="contact-form-intro">
        Not sure which technology, formulation approach, or development pathway is right for you?
        Tell us briefly about your requirement, and our team will connect you with the right expert.
      </p>
      <p className="contact-form-subheading">Get in touch</p>

      {submitted ? (
        <p className="contact-form-success">Thanks — your query has been received. Our team will be in touch shortly.</p>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="direct-name">Name*</label>
            <input id="direct-name" name="name" type="text" required />
          </div>
          <div className="contact-field">
            <label htmlFor="direct-org">Organization*</label>
            <input id="direct-org" name="organization" type="text" required />
          </div>
          <div className="contact-field">
            <label htmlFor="direct-email">Business Email*</label>
            <input
              id="direct-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="contact-field">
            <label htmlFor="direct-phone">Phone Number</label>
            <PhoneInput id="direct-phone" name="phone" />
          </div>

          <div className="contact-field contact-field--full">
            <OtpGate
              email={email}
              dark
              onVerifiedChange={(verified, ticket) => {
                setOtpVerified(verified);
                setOtpTicket(ticket);
              }}
            />
          </div>

          <div className="contact-field contact-field--full">
            <label htmlFor="direct-enquiry">Enquiry Regarding*</label>
            <FormSelect id="direct-enquiry" name="enquiry" options={ENQUIRY_OPTIONS} required placeholder="Select one" />
          </div>

          {error && <p className="contact-form-error">{error}</p>}

          <button type="submit" className="btn btn-lime contact-submit" disabled={!otpVerified || submitting}>
            {submitting ? "Sending…" : "Submit query"}
          </button>
        </form>
      )}
    </section>
  );
}
