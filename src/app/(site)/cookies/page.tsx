import { pageMetadata } from "@/lib/seo";
import LegalLayout from "@/components/Legal/LegalLayout";

export const metadata = pageMetadata({
  title: "Cookies Policy",
  description:
    "Which cookies the Danamo Tech website uses, why, and how you can accept, reject or change your cookie preferences at any time.",
  path: "/cookies",
  // Legal pages stay crawlable (follow) but out of search results: they
  // were outranking service pages for site: and brand queries.
  noindex: true,
});

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookies Policy"
      subtitle="What cookies we use, why we use them, and how you can control them under Kenyan data protection law."
      lastUpdated="15 November 2026"
    >
      <p>
        This Cookies Policy explains how Danamo Tech Ltd uses cookies and similar tracking technologies on <strong>danamotech.co.ke</strong>. It should be read together with our <a href="/privacy">Privacy Policy</a>.
      </p>
      <p>
        The Kenya Data Protection Act, 2019 does not contain a cookie-specific provision. Instead, cookie consent and transparency obligations flow from the Act&apos;s general principles in <strong>Sections 25, 30, and 32</strong>, together with the <strong>ODPC Guidance Note on Digital Marketing and Behavioural Advertising (2024)</strong>. Where cookies collect or identify personal data, they are treated as personal data under the Act.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a website. They allow the site to recognise your device on subsequent visits, remember your preferences, and understand how you interact with the site. We also use similar technologies such as local storage, session storage, and pixels.
      </p>

      <h2>2. Categories of Cookies We Use</h2>
      <table>
        <thead>
          <tr><th>Category</th><th>Purpose</th><th>Consent Required?</th><th>Examples</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Strictly Necessary</strong></td>
            <td>Essential for the site to function: keeping you signed in and protecting accounts. Set only when you sign in.</td>
            <td><strong>No</strong> (exempt)</td>
            <td><code>danamo_session</code>, <code>danamo_admin_session</code></td>
          </tr>
          <tr>
            <td><strong>Analytics</strong></td>
            <td>Understand how visitors use the site (pages viewed, visit length, referring site) so we can improve it.</td>
            <td><strong>Yes</strong> (opt-in)</td>
            <td>Google Analytics 4: <code>_ga</code>, <code>_ga_*</code></td>
          </tr>
          <tr>
            <td><strong>Marketing</strong></td>
            <td>Measure the effectiveness of our campaigns and, where used, show relevant ads on other sites.</td>
            <td><strong>Yes</strong> (opt-in)</td>
            <td>Google advertising signals (only if you allow marketing)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Your light/dark theme choice and your cookie choice are stored in your browser&apos;s local storage, not sent to us.
      </p>

      <h2>3. How We Obtain Consent</h2>
      <p>
        When you first visit, a banner asks for your choice. In line with <strong>Section 32 of the Act</strong> and the ODPC&apos;s 2024 guidance:
      </p>
      <ul>
        <li><strong>Off by default.</strong> Analytics and marketing cookies are not set, and the analytics script is not even loaded, until you opt in.</li>
        <li><strong>Equal choice.</strong> &quot;Reject all&quot; and &quot;Accept all&quot; are shown side by side with the same prominence.</li>
        <li><strong>Granular choice.</strong> &quot;Customize&quot; lets you allow analytics and marketing separately.</li>
        <li><strong>No scroll-as-consent.</strong> Continuing to browse is not consent.</li>
        <li><strong>Easy to withdraw.</strong> Change your choice at any time with &quot;Cookie Preferences&quot; in the footer. Withdrawing analytics consent stops analytics and deletes its cookies.</li>
      </ul>

      <h2>4. Strictly Necessary Cookies (Exempt from Consent)</h2>
      <p>
        The following cookies are required for the site to function and are exempt from consent under the Act because processing is necessary for the performance of a contract or to protect legitimate interests in security:
      </p>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Purpose</th><th>Duration</th><th>Type</th></tr>
        </thead>
        <tbody>
          <tr><td><code>danamo_session</code></td><td>Authenticates logged-in public users</td><td>7 days</td><td>HttpOnly</td></tr>
          <tr><td><code>danamo_admin_session</code></td><td>Authenticates admin users</td><td>12 hours</td><td>HttpOnly, Secure, SameSite=Strict (production)</td></tr>
        </tbody>
      </table>

      <h2>5. Analytics and Advertising Cookies</h2>
      <p>
        If you allow analytics, we use <strong>Google Analytics 4</strong> to understand how the site is used. Google Analytics 4 does not log or store IP addresses, and we do not use analytics data to identify individual visitors. If you also allow marketing, Google may use the data to measure and personalise advertising. Without your consent none of this runs.
      </p>

      <h2>6. Third-Party Cookies</h2>
      <p>
        With your consent, Google (as our analytics and advertising provider) sets the cookies listed above and acts as our data processor. Google may transfer data outside Kenya under appropriate safeguards. No other third parties set cookies on our site. Links to other websites are governed by those sites&apos; own cookie policies.
      </p>

      <h2>7. Children&apos;s Data</h2>
      <p>
        The Act treats anyone under 18 as a child for consent purposes. We do not knowingly use non-essential cookies on visitors we know to be children. If you are under 18, please ask a parent or guardian to review this policy with you.
      </p>

      <h2>8. How to Control Cookies</h2>
      <ul>
        <li><strong>Cookie Preferences:</strong> use the &quot;Cookie Preferences&quot; link in the footer to accept or reject each category at any time.</li>
        <li><strong>Browser settings:</strong> most browsers let you block or delete cookies; see your browser&apos;s help pages (Chrome, Firefox, Safari, Edge).</li>
        <li><strong>Google&apos;s opt-out:</strong> you can also install the Google Analytics Opt-out Browser Add-on.</li>
      </ul>
      <p>
        Blocking strictly necessary cookies may prevent you from logging in or using parts of the site.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Cookies Policy to reflect changes in the cookies we use or in applicable law. The &quot;Last updated&quot; date at the top of this page will reflect the most recent revision.
      </p>

      <h2>10. Contact</h2>
      <p>
        For questions about this Cookies Policy, email <strong>privacy@danamotech.co.ke</strong>.
      </p>

      <hr />
      <p className="text-sm italic text-gray-600 dark:text-gray-300">
        This Cookies Policy is drafted to align with the Kenya Data Protection Act, 2019 (ss. 25, 30, 32, 48) and the ODPC Guidance Note on Digital Marketing and Behavioural Advertising (2024). It should be reviewed by a qualified Kenyan advocate before publication.
      </p>
    </LegalLayout>
  );
}