import LegalLayout from "@/components/Legal/LegalLayout";

export const metadata = {
  title: "Cookies Policy | Danamo Tech",
  description: "How Danamo Tech uses cookies and similar technologies, and how you can control them under the Kenya Data Protection Act, 2019.",
};

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
      <p>
        We only use <strong>strictly necessary</strong> cookies. We do not use preference, analytics, advertising or marketing cookies.
      </p>
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
        </tbody>
      </table>
      <p>
        Your light/dark theme choice is stored in your browser&apos;s local storage, not in a cookie, and is never sent to us.
      </p>

      <h2>3. How We Obtain Consent</h2>
      <p>
        Because we only use strictly necessary cookies, which are exempt from consent, we do not show a cookie consent banner. Visiting the site without signing in sets no cookies at all.
      </p>
      <p>
        If we ever introduce non-essential cookies, we will first update this policy and ask for your consent in line with <strong>Section 32 of the Act</strong> and the ODPC&apos;s 2024 guidance: no pre-ticked boxes, a &quot;Reject all&quot; option as prominent as &quot;Accept all&quot;, a separate choice per category, no &quot;scroll-as-consent&quot;, and withdrawal as easy as giving consent.
      </p>

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
        We do not currently use analytics, advertising or tracking cookies. If we introduce analytics in the future, we will ask for your consent first and update this policy before doing so.
      </p>
      <p>
        Your light/dark theme choice is saved in your browser&apos;s local storage (not a cookie) and never leaves your device.
      </p>

      <h2>6. Third-Party Cookies</h2>
      <p>
        We do not allow third parties to set cookies on our site. Links to other websites (for example our clients&apos; sites) are governed by those websites&apos; own cookie policies.
      </p>

      <h2>7. Children&apos;s Data</h2>
      <p>
        The Act treats anyone under 18 as a child for consent purposes. We do not knowingly use non-essential cookies on visitors we know to be children. If you are under 18, please ask a parent or guardian to review this policy with you.
      </p>

      <h2>8. How to Control Cookies</h2>
      <p>
        Most browsers allow you to block or delete cookies; see your browser&apos;s help pages (Chrome, Firefox, Safari, Edge). Clearing your browser&apos;s site data also removes the saved theme preference.
      </p>
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
      <p className="text-sm italic text-gray-500 dark:text-gray-400">
        This Cookies Policy is drafted to align with the Kenya Data Protection Act, 2019 (ss. 25, 30, 32, 48) and the ODPC Guidance Note on Digital Marketing and Behavioural Advertising (2024). It should be reviewed by a qualified Kenyan advocate before publication.
      </p>
    </LegalLayout>
  );
}