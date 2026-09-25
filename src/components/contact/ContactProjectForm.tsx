"use client";

import { useState } from "react";
import FormSelect from "./FormSelect";
import PhoneInput from "./PhoneInput";
import OtpGate from "./OtpGate";
import { useContactSubmit } from "./useContactSubmit";

const AUDIENCE_OPTIONS = [
  "Brand / Product Developer",
  "Grower / Ingredient Supplier",
  "Ingredient Manufacturer",
  "Research / Academic Partner",
  "Other",
];

const LOOKING_FOR_OPTIONS = [
  "Contract R&D",
  "Encapsulation Technology",
  "Ingredient Development",
  "Pilot Batch",
  "Scale-Up & Manufacturing",
  "Scientific Collaboration",
  "Other",
];

export default function ContactProjectForm() {
  const [email, setEmail] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTicket, setOtpTicket] = useState<string | null>(null);
  const { submit, submitting, submitted, error } = useContactSubmit("project");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!otpVerified || !otpTicket) return;
    submit(e.currentTarget, otpTicket);
  }

  return (
    <section className="contact-form-section" id="contact-form">
      <p className="contact-form-kicker">Tell us about your project</p>
      <p className="contact-form-intro">
        Help us understand your requirement so our team can connect you with the appropriate
        scientific expert.
      </p>

      {submitted ? (
        <p className="contact-form-success">Thanks — your project inquiry has been received. Our team will be in touch shortly.</p>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="project-name">Name*</label>
            <input id="project-name" name="name" type="text" required />
          </div>
          <div className="contact-field">
            <label htmlFor="project-org">Organization*</label>
            <input id="project-org" name="organization" type="text" required />
          </div>
          <div className="contact-field">
            <label htmlFor="project-email">Business Email*</label>
            <input
              id="project-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="contact-field">
            <label htmlFor="project-phone">Phone / WhatsApp</label>
            <PhoneInput id="project-phone" name="phone" />
          </div>

          <div className="contact-field contact-field--full">
            <OtpGate
              email={email}
              onVerifiedChange={(verified, ticket) => {
                setOtpVerified(verified);
                setOtpTicket(ticket);
              }}
            />
          </div>

          <div className="contact-field contact-field--full">
            <label htmlFor="project-audience">I am a:</label>
            <FormSelect id="project-audience" name="audience" options={AUDIENCE_OPTIONS} placeholder="Select one" />
          </div>

          <div className="contact-field contact-field--full">
            <label htmlFor="project-looking-for">What are you looking for?</label>
            <FormSelect id="project-looking-for" name="lookingFor" options={LOOKING_FOR_OPTIONS} placeholder="Select one" />
          </div>

          <div className="contact-field contact-field--full">
            <label htmlFor="project-detail">Tell us about your requirement</label>
            <textarea
              id="project-detail"
              name="detail"
              rows={4}
              placeholder="Describe your ingredient, formulation challenge, application, or project"
            />
          </div>

          {error && <p className="contact-form-error">{error}</p>}

          <button type="submit" className="btn btn-lime contact-submit" disabled={!otpVerified || submitting}>
            {submitting ? "Sending…" : "Submit Project Inquiry"}
          </button>
        </form>
      )}
    </section>
  );
}
