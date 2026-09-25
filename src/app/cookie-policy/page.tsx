import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Watermark from "@/components/Watermark";
import ScrollReveal from "@/components/ScrollReveal";
import FooterCTA from "@/components/FooterCTA";

export const metadata: Metadata = {
  title: "Cookie Policy | SowTrap™",
  description: "How SowTrap™ uses cookies and similar technologies on this website.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Watermark />
      <Nav />
      <ScrollReveal />

      <section className="legal-page">
        <p className="legal-page-eyebrow">Legal</p>
        <h1>Cookie Policy</h1>
        <p className="legal-page-meta">Effective Date: — &nbsp;·&nbsp; Last Updated: —</p>

        <p>
          SowTrap&trade;, a division of ScienceOnWheels Bio Pvt. Ltd., (referred to as &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies and similar technologies on our website to
          provide a reliable, secure, and user-friendly experience.
        </p>
        <p>
          This Cookie Policy explains what cookies are, how we use them, what types of cookies may be
          placed on your device, and how you can manage your preferences.
        </p>

        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your device when you visit a website. They
          allow a website to recognize your device and remember certain information about your visit.
        </p>
        <p>
          We may also use similar technologies, such as pixels, tags, scripts, and local storage, for
          purposes similar to cookies.
        </p>

        <h2>2. Why We Use Cookies</h2>
        <p>We use cookies and similar technologies to:</p>
        <ul>
          <li>Ensure that the SowTrap&trade; website functions properly.</li>
          <li>Maintain website security and reliability.</li>
          <li>Remember your preferences and settings.</li>
          <li>Understand how visitors use our website.</li>
          <li>Improve website performance and user experience.</li>
          <li>Analyse website traffic and engagement.</li>
          <li>
            Support relevant communications and marketing activities, where applicable and with
            appropriate consent.
          </li>
        </ul>

        <h2>3. Types of Cookies We Use</h2>
        <p>
          <strong>A. Strictly Necessary Cookies</strong>
          <br />
          These cookies are essential for the operation of the website. They enable basic functions such
          as page navigation, security, form functionality, and access to certain website features.
          These cookies cannot generally be disabled through our cookie preference tool because the
          website may not function properly without them.
        </p>
        <p>
          <strong>B. Functional / Preference Cookies</strong>
          <br />
          These cookies allow the website to remember choices you make, such as language, preferences, or
          other settings, to provide a more personalized experience. If you disable these cookies, some
          website features may not function as intended.
        </p>
        <p>
          <strong>C. Analytics / Performance Cookies</strong>
          <br />
          These cookies help us understand how visitors interact with our website. They may collect
          information such as pages visited, approximate traffic patterns, time spent on pages, and
          website interactions. The information is generally used in aggregated or statistical form to
          help us improve our website, content, and services.
        </p>
        <p>
          <strong>D. Marketing / Advertising Cookies</strong>
          <br />
          Where used, these cookies may help us understand interactions with our communications,
          campaigns, or website and may be used to provide or measure relevant marketing activities.
          Marketing cookies will only be used where applicable and subject to your selected preferences
          and any consent requirements.
        </p>

        <h2>4. Third-Party Cookies</h2>
        <p>
          Some cookies may be placed by third-party service providers that support website functionality,
          analytics, forms, embedded content, or other services.
        </p>
        <p>
          These third parties may process information in accordance with their own privacy policies and
          terms.
        </p>
        <p>
          Examples may include website analytics, embedded media, communication tools, appointment or
          enquiry systems, and other third-party services integrated into our website.
        </p>

        <h2>5. Your Cookie Choices</h2>
        <p>
          When you first visit our website, you may be presented with a cookie banner or preference
          centre that allows you to manage non-essential cookies.
        </p>
        <p>You may:</p>
        <ul>
          <li>
            <strong>Accept All Cookies</strong> &ndash; allow all available categories of cookies.
          </li>
          <li>
            <strong>Reject Non-Essential Cookies</strong> &ndash; allow only cookies necessary for
            website operation.
          </li>
          <li>
            <strong>Manage Preferences</strong> &ndash; select individual categories of cookies according
            to your preferences.
          </li>
        </ul>
        <p>
          You can change your cookie preferences at any time through the Cookie Settings option available
          on our website.
        </p>
        <p>Please note that disabling certain cookies may affect website functionality or your overall browsing experience.</p>

        <h2>6. How Long Cookies Remain on Your Device</h2>
        <p>Cookies may be either:</p>
        <p>
          <strong>Session Cookies:</strong> These are temporary cookies that remain on your device only
          while you are browsing the website and are generally deleted when you close your browser.
        </p>
        <p>
          <strong>Persistent Cookies:</strong> These remain on your device for a defined period or until
          they are deleted manually. Their duration may vary depending on their purpose and the service
          provider.
        </p>

        <h2>7. Managing Cookies Through Your Browser</h2>
        <p>
          You can also control or delete cookies through your browser settings. Most browsers allow you
          to block, delete, or manage cookies.
        </p>
        <p>
          Please be aware that changing your browser settings may affect the functionality of websites
          you visit, including certain features of the SowTrap&trade; website.
        </p>

        <h2>8. Changes to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in our website,
          technologies, services, legal requirements, or data practices.
        </p>
        <p>For questions regarding this Cookie Policy or our use of cookies, please contact:</p>
        <p>
          Email: <a href="mailto:sowtrap@scienceonwheels.in">sowtrap@scienceonwheels.in</a>
          <br />
          Website: <a href="https://sowtrap.in/">sowtrap.in</a>
          <br />
          Registered Office: 10th floor, 83 Avenue, Sector 83, Gurugram, Haryana, Pincode &ndash; 122004
        </p>
      </section>

      <FooterCTA />
    </>
  );
}
