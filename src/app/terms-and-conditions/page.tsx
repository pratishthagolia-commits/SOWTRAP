import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Watermark from "@/components/Watermark";
import ScrollReveal from "@/components/ScrollReveal";
import FooterCTA from "@/components/FooterCTA";

export const metadata: Metadata = {
  title: "Terms & Conditions | SowTrap™",
  description: "Terms and conditions governing use of the SowTrap™ website.",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Watermark />
      <Nav />
      <ScrollReveal />

      <section className="legal-page">
        <p className="legal-page-eyebrow">Legal</p>
        <h1>Terms &amp; Conditions</h1>
        <p className="legal-page-meta">Effective Date: — &nbsp;·&nbsp; Last Updated: —</p>

        <p>
          Welcome to the SowTrap&trade; website, operated by ScienceOnWheels Bio Pvt. Ltd. (referred to
          as &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing or using this
          Website, you agree to these Terms &amp; Conditions.
        </p>

        <h2>1. Website Use</h2>
        <p>
          The Website is provided for general scientific, technical, professional, and business
          information. You agree to use it only for lawful purposes and not to:
        </p>
        <ul>
          <li>misuse or interfere with the Website;</li>
          <li>attempt unauthorized access;</li>
          <li>copy, reproduce, or commercially use Website content without permission; or</li>
          <li>submit unlawful, misleading, or infringing information.</li>
        </ul>

        <h2>2. Website Content</h2>
        <p>
          We make reasonable efforts to ensure that information published on the Website is accurate and
          appropriate at the time of publication.
        </p>
        <p>
          However, scientific, technical, commercial, product, ingredient, regulatory, and other
          information may change over time.
        </p>
        <p>
          Accordingly, we do not guarantee that the Website or its content will always be: complete;
          accurate; current; error-free; suitable for a particular purpose; continuously available; or
          free from omissions.
        </p>
        <p>
          We reserve the right to modify, update, correct, suspend, or remove Website content at any time
          without prior notice.
        </p>

        <h2>3. Scientific &amp; Product Information</h2>
        <p>
          Information about ingredients, bioactives, encapsulation technologies, products, research, and
          applications is provided for general informational purposes and may be based on scientific
          literature, laboratory testing, technical evaluations, or product-specific studies.
        </p>
        <p>
          Scientific results may vary depending on the source, grade, supplier, batch, harvest,
          geographical origin, formulation, process conditions, analytical method, laboratory conditions,
          and other factors.
        </p>
        <p>
          Results presented on the Website should therefore not be interpreted as a guarantee that
          identical results will be obtained in every formulation, application, process, or batch.
        </p>

        <h2>4. Product and Ingredient Information</h2>
        <p>
          Descriptions, specifications, characteristics, applications, and other information relating to
          products or ingredients are provided for general scientific, technical, and commercial
          information.
        </p>
        <p>
          Product characteristics may vary due to differences in: raw material source; grade; supplier;
          batch; harvest; geographical origin; processing conditions; storage conditions; and other
          natural or manufacturing factors.
        </p>
        <p>
          Where applicable, the product-specific technical specification, Certificate of Analysis (COA),
          specification sheet, quotation, purchase agreement, supply agreement, or other written
          commercial document will govern the relevant product transaction.
        </p>

        <h2>5. Suitability for Intended Use</h2>
        <p>
          Information published on the Website does not constitute a representation or guarantee that any
          product, ingredient, formulation, encapsulation system, or technology is suitable for a
          particular application.
        </p>
        <p>
          The suitability of a product for a specific purpose depends on factors including formulation,
          dosage, processing conditions, regulatory requirements, intended market, storage conditions,
          manufacturing process, and final product characteristics.
        </p>
        <p>
          It is the user&rsquo;s responsibility to determine whether a product or ingredient is suitable
          for its intended use. Users should conduct all testing and validation appropriate to their
          application.
        </p>

        <h2>6. Medical &amp; Therapeutic Disclaimer</h2>
        <p>
          The information provided on the Website is not intended to constitute medical, clinical,
          nutritional, therapeutic, or individualized healthcare advice.
        </p>
        <p>Nothing on the Website should be interpreted as:</p>
        <ul>
          <li>a medical diagnosis;</li>
          <li>medical treatment advice;</li>
          <li>a recommendation to treat or prevent a disease;</li>
          <li>a guarantee of a health outcome;</li>
          <li>a substitute for professional medical advice; or</li>
          <li>
            a therapeutic claim unless specifically identified and legally substantiated for the relevant
            product and jurisdiction.
          </li>
        </ul>
        <p>
          No clinical trial or therapeutic claim is intended in relation to vitamins, minerals,
          antioxidants, probiotics, peptides, enzymes, fibres, proteins, phyto-oils, fruits, herbs,
          plants, extracts, oils, or other ingredients described on the Website unless expressly stated
          and appropriately substantiated.
        </p>
        <p>
          The information contained on the Website is provided for general informational and professional
          purposes.
        </p>
        <p>
          Users should not rely solely on Website information when making technical, scientific,
          commercial, regulatory, medical, nutritional, manufacturing, or other consequential decisions.
        </p>
        <p>Appropriate independent evaluation and professional advice should be obtained where necessary.</p>
        <p>
          To the maximum extent permitted by applicable law, ScienceOnWheels Bio Pvt. Ltd. shall not be
          responsible for loss or damage resulting solely from reliance on general information published
          on the Website.
        </p>

        <h2>7. Scientific References</h2>
        <p>
          Where available, SowTrap&trade; may provide references to scientific publications, studies,
          technical literature, regulatory resources, or other authoritative sources.
        </p>
        <p>Such references are provided for informational purposes.</p>
        <p>
          The inclusion of a scientific reference does not necessarily constitute an endorsement by the
          publication&rsquo;s authors, institution, or publisher of SowTrap&trade;, ScienceOnWheels Bio
          Pvt. Ltd., or any particular product.
        </p>
        <p>
          Users should independently evaluate whether a referenced study is applicable to their specific
          ingredient, product, formulation, dosage, population, process, or intended use.
        </p>

        <h2>8. Intellectual Property</h2>
        <p>
          All Website content, including text, graphics, images, technical materials, logos, trademarks,
          and SowTrap&trade; branding, is owned by or licensed to ScienceOnWheels Bio Pvt. Ltd., unless
          otherwise stated.
        </p>
        <p>No content may be reproduced, modified, distributed, or commercially used without prior written permission.</p>

        <h2>9. Enquiries &amp; Commercial Transactions</h2>
        <p>
          Submitting an enquiry through the Website does not create a contract or obligation to supply
          products or services.
        </p>
        <p>
          Product purchases, quotations, specifications, supply, confidentiality, and other commercial
          matters may be governed by separate written agreements or terms.
        </p>

        <h2>10. Confidential Information</h2>
        <p>The Website may allow users to submit technical or business information through enquiry forms.</p>
        <p>
          Unless expressly agreed otherwise in writing, submission of information through a general
          Website form should not be assumed to create a confidentiality obligation.
        </p>
        <p>
          If you intend to disclose confidential information, including proprietary formulations,
          unpublished research, inventions, intellectual property, commercial information, or other
          sensitive information, please contact SowTrap&trade; regarding an appropriate confidentiality
          arrangement before disclosure.
        </p>

        <h2>11. Third-Party Links</h2>
        <p>
          The Website may contain links to external websites, scientific publications, databases, service
          providers, or other resources.
        </p>
        <p>These links are provided for convenience and information.</p>
        <p>
          SowTrap&trade; does not necessarily control, endorse, or guarantee the content, accuracy,
          security, availability, or privacy practices of third-party websites.
        </p>
        <p>Your use of third-party websites is subject to their own terms and policies.</p>

        <h2>12. Disclaimer &amp; Limitation of Liability</h2>
        <p>
          The Website and its content are provided on an &ldquo;as available&rdquo; basis. To the extent
          permitted by law, SowTrap&trade; / ScienceOnWheels Bio Pvt. Ltd. makes no guarantee regarding
          the completeness, accuracy, suitability, or results arising from use of Website information.
        </p>
        <p>
          Your use of products, ingredients, technologies, or information described on the Website is
          beyond our control. We are not responsible for consequences arising from use outside applicable
          specifications, agreements, or intended applications.
        </p>

        <h2>13. Privacy &amp; Cookies</h2>
        <p>
          Use of the Website is also subject to our <a href="/privacy-policy">Privacy Policy</a> and{" "}
          <a href="/cookie-policy">Cookie Policy</a>, which explain how personal information and cookies
          are handled.
        </p>

        <h2>14. Changes to These Terms</h2>
        <p>We may update these Terms from time to time. The latest version will be published on this page with the updated date.</p>

        <h2>15. Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of India. Subject to applicable law, disputes shall
          be subject to the jurisdiction of the competent courts at Gurugram, Haryana.
        </p>

        <h2>16. Contact Information</h2>
        <p>For any questions regarding these Terms &amp; Conditions, please contact us through the official website:</p>
        <p>
          <a href="https://sowtrap.in/">https://sowtrap.in/</a>
        </p>
        <p>For questions regarding these Terms &amp; Conditions, please contact:</p>
        <p>
          Email: —
          <br />
          Website: <a href="https://sowtrap.in/">sowtrap.in</a>
          <br />
          Registered Office: —
        </p>
      </section>

      <FooterCTA />
    </>
  );
}
