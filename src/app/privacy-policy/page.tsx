import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Watermark from "@/components/Watermark";
import ScrollReveal from "@/components/ScrollReveal";
import FooterCTA from "@/components/FooterCTA";

export const metadata: Metadata = {
  title: "Privacy Policy | SowTrap™",
  description: "How SowTrap™ collects, uses, and protects information submitted through this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Watermark />
      <Nav />
      <ScrollReveal />

      <section className="legal-page">
        <p className="legal-page-eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-page-meta">Effective Date: — &nbsp;·&nbsp; Last Updated: —</p>

        <p>
          SowTrap&trade; (referred to as &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
          respects your privacy. This Privacy Policy explains how we collect and use information when you
          visit or interact with our Website. By using our website, you consent to the terms and
          practices described in this Privacy Policy.
        </p>

        <h2>1. Information We Collect</h2>
        <p>Depending on how you use our Website, we may collect:</p>
        <ul>
          <li>Name and contact details</li>
          <li>Company and designation</li>
          <li>Email address and telephone number</li>
          <li>Enquiry and project information</li>
          <li>Information submitted through contact, consultation, partnership, or career forms</li>
          <li>Technical information such as IP address, browser, device, pages visited, and Website usage information</li>
        </ul>
        <p>
          We collect this information when you voluntarily submit it through our website&rsquo;s contact
          form or any other interaction with our website.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We may use your information to:</p>
        <ul>
          <li>respond to enquiries and requests;</li>
          <li>provide information about our ingredients, products, technologies, and services;</li>
          <li>communicate regarding projects, consultations, collaborations, or business opportunities;</li>
          <li>process career applications;</li>
          <li>improve Website functionality, content, and user experience;</li>
          <li>analyze Website usage;</li>
          <li>maintain Website security;</li>
          <li>maintain business records; and</li>
          <li>comply with applicable legal requirements.</li>
        </ul>
        <p>
          We may also use your contact information to send you newsletters, updates, promotions, or other
          marketing materials related to our products and services that we believe may be of interest to
          you. You have the option to opt-out of receiving such communications by following the
          unsubscribe instructions provided in the email or contacting us directly.
        </p>

        <h2>3. Protection of Personal Information</h2>
        <p>
          We take your privacy and the security of your personal information seriously. We have
          implemented appropriate physical, technical, and administrative measures to protect your
          information from unauthorized access, disclosure, alteration, or destruction. We restrict
          access to your personal information to authorized personnel only, and we ensure that our
          third-party service providers handling your data comply with industry-standard security
          measures.
        </p>

        <h2>4. Cookies</h2>
        <p>
          We may use cookies and tracking technologies to enhance your experience on our website and
          gather information about how our website is being used. These technologies may collect
          information such as your IP address, browser type, device information, and browsing behavior.
          This information is used to analyze trends, administer the website, track users&rsquo;
          movements, and gather demographic information. You can choose to disable cookies through your
          browser settings, but please note that this may affect the functionality and usability of our
          website.
        </p>
        <p>You can manage non-essential cookies through Cookie Settings.</p>
        <p>
          For details, please see our <a href="/cookie-policy">Cookie Policy</a>.
        </p>

        <h2>5. Sharing of Information</h2>
        <p>
          We may share information where necessary with authorized employees, affiliates, IT and Website
          service providers, email providers, analytics providers, professional advisers, and government
          or regulatory authorities where legally required.
        </p>
        <p>We do not intend to sell your personal information as a commercial commodity.</p>

        <h2>6. Third-Party Disclosure</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties.
          However, we may share your personal information with trusted service providers who assist us
          in operating our website, conducting our business, or providing services to you, as long as
          they agree to keep the information confidential and abide by this Privacy Policy.
        </p>

        <h2>7. Data Retention &amp; Security</h2>
        <p>
          We retain personal information only for as long as reasonably necessary for the purpose for
          which it was collected, including business, legal, security, and record-keeping requirements.
        </p>
        <p>
          We use reasonable technical and organizational measures to protect personal information from
          unauthorized access, loss, misuse, or disclosure. However, no online system can be guaranteed
          to be completely secure.
        </p>

        <h2>8. Your Rights</h2>
        <p>
          Subject to applicable law, you may have rights to access, correct, delete, or otherwise manage
          your personal information and to withdraw consent where processing is based on consent.
        </p>
        <p>To make a privacy request or raise a concern, please contact us.</p>

        <h2>9. External Links</h2>
        <p>
          Our website may contain links to third-party websites for your convenience. These websites
          operate independently and have their own privacy policies. We encourage you to review the
          privacy policies of these third-party websites as we have no control over, and cannot be
          responsible for, the privacy practices or content provided by these websites.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We reserve the right to modify or update this Privacy Policy at any time. Any changes will be
          effective immediately upon posting the revised Privacy Policy on our website. We encourage you
          to review this Privacy Policy periodically to stay informed about how we are protecting your
          information.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding our Privacy Policy or the handling of your
          personal information, please contact us.
        </p>
        <p>
          Email: —
          <br />
          Website: <a href="https://sowtrap.in/">sowtrap.in</a>
          <br />
          Address: —
        </p>
      </section>

      <FooterCTA />
    </>
  );
}
