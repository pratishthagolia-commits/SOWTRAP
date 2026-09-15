"use client";

import FormSelect from "./FormSelect";
import PhoneInput from "./PhoneInput";

const ENQUIRY_OPTIONS = [
  "Ingredient / Raw Material",
  "Encapsulation Technology",
  "Scientific Consultation",
  "Scale-Up & Manufacturing",
  "Research Collaboration",
  "Other",
];

export default function ContactDirectForm() {
  return (
    <section className="contact-form-section contact-form-section--alt">
      <p className="contact-form-kicker">Prefer to speak directly?</p>
      <h2 className="contact-form-heading">Don&apos;t Know Where to Start? Speak to Our Experts.</h2>
      <p className="contact-form-intro">
        Not sure which technology, formulation approach, or development pathway is right for you?
        Tell us briefly about your requirement, and our team will connect you with the right expert.
      </p>
      <p className="contact-form-subheading">Get in touch</p>

      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
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
          <input id="direct-email" name="email" type="email" required />
        </div>
        <div className="contact-field">
          <label htmlFor="direct-phone">Phone Number</label>
          <PhoneInput id="direct-phone" name="phone" />
        </div>

        <div className="contact-field contact-field--full">
          <label htmlFor="direct-enquiry">Enquiry Regarding*</label>
          <FormSelect id="direct-enquiry" name="enquiry" options={ENQUIRY_OPTIONS} required placeholder="Select one" />
        </div>

        <button type="submit" className="btn btn-lime contact-submit">
          Submit query
        </button>
      </form>
    </section>
  );
}
