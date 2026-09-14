"use client";

import FormSelect from "./FormSelect";
import PhoneInput from "./PhoneInput";

const INTEREST_OPTIONS = [
  "Research & Innovation",
  "Encapsulation Technology",
  "Formulation Development",
  "Analytical & Validation",
  "Process Development & Scale-Up",
  "Manufacturing & Quality",
  "Business Development",
  "Other",
];

export default function ContactJoinForm() {
  return (
    <section className="contact-form-section">
      <p className="contact-form-kicker">Join our team</p>
      <h2 className="contact-form-heading">Build the Future of Bioactive Delivery</h2>
      <p className="contact-form-intro">
        If you are passionate about developing science-driven solutions and translating research
        into real-world applications, we would like to hear from you.
      </p>

      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <div className="contact-field">
          <label htmlFor="join-name">Full Name*</label>
          <input id="join-name" name="name" type="text" required />
        </div>
        <div className="contact-field">
          <label htmlFor="join-email">Email Address*</label>
          <input id="join-email" name="email" type="email" required />
        </div>
        <div className="contact-field">
          <label htmlFor="join-phone">Phone Number*</label>
          <PhoneInput id="join-phone" name="phone" required />
        </div>
        <div className="contact-field">
          <label htmlFor="join-org">Current Organization / Institution</label>
          <input id="join-org" name="organization" type="text" />
        </div>

        <div className="contact-field contact-field--full">
          <label htmlFor="join-interest">Area of Interest*</label>
          <FormSelect id="join-interest" name="interest" options={INTEREST_OPTIONS} required placeholder="Select one" />
        </div>

        <div className="contact-field">
          <label htmlFor="join-experience">Experience</label>
          <input id="join-experience" name="experience" type="text" placeholder="e.g. 3 years" />
        </div>
        <div className="contact-field">
          <label htmlFor="join-cv">Upload CV / Resume*</label>
          <input id="join-cv" name="cv" type="file" required />
        </div>

        <div className="contact-field contact-field--full">
          <label htmlFor="join-message">Message / Brief Profile</label>
          <textarea id="join-message" name="message" rows={4} />
        </div>

        <div className="contact-field contact-field--full">
          <label htmlFor="join-cover-letter">Upload Cover Letter</label>
          <input id="join-cover-letter" name="coverLetter" type="file" />
        </div>

        <button type="submit" className="btn btn-lime contact-submit">
          &rarr; Submit Application
        </button>
      </form>
    </section>
  );
}
