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
      lastUpdated="10 November 2026"
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
            <td>Essential for the site to function — session management, login, security, load balancing.</td>
            <td><strong>No</strong> (exempt)</td>
            <td><code>danamo_session</code>, <code>danamo_admin_session</code></td>
          </tr>
          <tr>
            <td><strong>Preferences</strong></td>
            <td>Remember your theme (light/dark) and language preferences.</td>
            <td><strong>Yes</strong> (opt-in)</td>
            <td><code>theme</code></td>
          </tr>
          <tr>
            <td><strong>Analytics</strong></td>
            <td>Understand how visitors use the site — page views, session duration, referral source.</td>
            <td><strong>Yes</strong> (opt-in)</td>
            <td>Vercel Analytics, Google Analytics (if enabled)</td>
          </tr>
          <tr>
            <td><strong>Marketing</strong></td>
            <td>Measure the effectiveness of campaigns and, where enabled, personalise advertising.</td>
            <td><strong>Yes</strong> (opt-in)</td>
            <td>[Insert if applicable]</td>
          </tr>
        </tbody>
      </table>

      <h2>3. How We Obtain Consent</h2>
      <p>
        In line with <strong>Section 32 of the Act</strong> and the ODPC&apos;s 2024 guidance, our consent mechanism operates as follows:
      </p>
      <ul>
        <li><strong>No pre-ticked boxes.</strong> Non-essential cookies are blocked until you take an affirmative action to accept them.</li>
        <li><strong>Granular choice.</strong> You can accept or reject each category (Analytics, Marketing, Preferences) independently — &quot;Accept all&quot; is never the only path.</li>
        <li><strong>Reject all option.</strong> A &quot;Reject all&quot; button is presented on the same surface as &quot;Accept all&quot;.</li>
        <li><strong>No scroll-as-consent.</strong> Simply continuing to browse the site does not constitute consent.</li>
        <li><strong>Withdrawal is as easy as giving.</strong> You can change your preferences at any time via the &quot;Cookie Preferences&quot; link in the footer.</li>
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
          <tr><td><code>danamo_admin_session</code></td><td>Authenticates admin users</td><td>12 hours</td><td>HttpOnly, SameSite=Strict (production)</td></tr>
          <tr><td><code>theme</code></td><td>Remembers light/dark mode preference</td><td>1 year</td><td>Functional</td></tr>
        </tbody>
      </table>

      <h2>5. Analytics Cookies</h2>
      <p>
        If you consent, we use analytics cookies to understand how the site is used so we can improve it. We configure our analytics to anonymise IP addresses and do not use analytics data to identify individual visitors. Where analytics data is transferred outside Kenya, we rely on the cross-border transfer mechanisms described in <strong>Section 48 of the Act</strong> — see our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>6. Third-Party Cookies</h2>
      <p>
        Some cookies are set by third parties we work with, such as hosting and analytics providers. These third parties act as data processors under written agreements and are bound to process data only on our instructions. Where a third party acts as an independent data controller (for example, an embedded video platform), their own privacy and cookie policies apply.
      </p>

      <h2>7. Children&apos;s Data</h2>
      <p>
        The Act treats anyone under 18 as a child for consent purposes. We do not knowingly use non-essential cookies on visitors we know to be children. If you are under 18, please ask a parent or guardian to review this policy with you.
      </p>

      <h2>8. How to Control Cookies</h2>
      <p>You can control cookies in three ways:</p>
      <ul>
        <li><strong>Our preference centre:</strong> click &quot;Cookie Preferences&quot; in the footer to accept or reject each category.</li>
        <li><strong>Browser settings:</strong> most browsers allow you to block or delete cookies. See your browser&apos;s help pages (Chrome, Firefox, Safari, Edge).</li>
        <li><strong>Opt-out tools:</strong> industry opt-out tools such as the Network Advertising Initiative opt-out page and Your Online Choices.</li>
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
      <p className="text-sm italic text-gray-500 dark:text-gray-400">
        This Cookies Policy is drafted to align with the Kenya Data Protection Act, 2019 (ss. 25, 30, 32, 48) and the ODPC Guidance Note on Digital Marketing and Behavioural Advertising (2024). It should be reviewed by a qualified Kenyan advocate before publication.
      </p>
    </LegalLayout>
  );
}