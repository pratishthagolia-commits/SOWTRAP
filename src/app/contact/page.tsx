import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Watermark from "@/components/Watermark";
import ScrollReveal from "@/components/ScrollReveal";
import ContactHeroPhoto from "@/components/contact/ContactHeroPhoto";
import ContactHero from "@/components/contact/ContactHero";
import ContactProjectForm from "@/components/contact/ContactProjectForm";
import ContactDirectForm from "@/components/contact/ContactDirectForm";
import ContactJoinForm from "@/components/contact/ContactJoinForm";
import FooterCTA from "@/components/FooterCTA";

export const metadata: Metadata = {
  title: "Contact | SowTrap™",
  description: "Get in touch with the SowTrap™ scientific team.",
};

// NOTE: none of the three forms below have a real submission handler
// wired up yet (each just preventDefault()s, same as the footer's
// newsletter form) — there's no backend on this site to send them to.
// Per the brief, submissions should eventually route to:
//   bridreth@scienceonwheels.in, rajneesh@scienceonwheels.in,
//   analytical@scienceonwheels.in, kam@scienceonwheels.in
// That needs either a form-handling service (e.g. Formspree) or a
// server action posting to an email API — flagging for whoever wires
// this up next, not rendered as page copy since it's an internal note.
export default function ContactPage() {
  return (
    <>
      <Watermark />
      <Nav />
      <ScrollReveal />

      <ContactHeroPhoto />

      <ContactHero />

      <ContactProjectForm />

      <ContactDirectForm />

      <ContactJoinForm />

      <FooterCTA />
    </>
  );
}
