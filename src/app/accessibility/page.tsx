import LegalLayout from "@/components/Legal/LegalLayout";

export const metadata = {
  title: "Accessibility Statement | Danamo Tech",
  description: "Danamo Tech's commitment to digital accessibility under the Constitution of Kenya, the Persons with Disabilities Act, 2003, and WCAG 2.1 Level AA.",
};

export default function AccessibilityPage() {
  return (
    <LegalLayout
      title="Accessibility Statement"
      subtitle="Our commitment to making our website and services usable by everyone, including persons with disabilities."
      lastUpdated="10 November 2026"
    >
      <p>
        Danamo Tech Ltd is committed to ensuring that our digital properties are accessible to all people, including persons with disabilities. This statement describes our standards, measures, known limitations, and feedback mechanisms.
      </p>

      <h2>1. Legal Framework</h2>
      <p>
        Accessibility is both a legal obligation and a core value for us. Our approach is informed by:
      </p>
      <ul>
        <li><strong>The Constitution of Kenya, 2010</strong> — particularly <strong>Article 27</strong> (equality and freedom from discrimination) and <strong>Article 54</strong> (rights of persons with disabilities, including the right to access educational institutions and facilities, and to reasonable access to all places, public transport, and information).</li>
        <li><strong>The Persons with Disabilities Act, 2003 (No. 14 of 2003)</strong> — which requires reasonable accommodation and non-discrimination in access to services and facilities.</li>
        <li><strong>The Kenya Information and Communications Act (KICA, Cap 411A)</strong> — which requires that the special needs of persons with disabilities are considered in the provision of information and communication services.</li>
        <li><strong>The Access to Information Act, 2016 (No. 18 of 2016), Section 5(2)</strong> — which requires that information be disseminated taking into consideration the need to reach persons with disabilities.</li>
        <li><strong>The Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>, published by the World Wide Web Consortium (W3C), as the primary technical standard for our website.</li>
      </ul>

      <h2>2. Scope</h2>
      <p>This statement applies to:</p>
      <ul>
        <li>Our main website at <strong>danamotech.co.ke</strong></li>
        <li>Our admin portal and internal dashboards</li>
        <li>Forms, newsletters, and other interactive features on the Site</li>
        <li>Downloadable documents and PDFs (available in alternative formats on request)</li>
      </ul>

      <h2>3. Our Standards</h2>
      <p>
        We design and maintain our website to meet <strong>WCAG 2.1 Level AA</strong> wherever practicable. This means ensuring content is:
      </p>
      <ul>
        <li><strong>Perceivable</strong> — text alternatives for meaningful images, sufficient colour contrast, captions for video, and content that can be presented in different ways.</li>
        <li><strong>Operable</strong> — full keyboard navigation, visible focus indicators, sufficient time limits, and no content that could trigger seizures.</li>
        <li><strong>Understandable</strong> — clear language, predictable navigation, and form error messages that identify the field and suggest a correction.</li>
        <li><strong>Robust</strong> — standards-compliant markup that works with current and future assistive technologies.</li>
      </ul>

      <h2>4. Measures We Have Taken</h2>
      <ul>
        <li>Semantic HTML structure with a logical heading hierarchy on every page.</li>
        <li>Descriptive alternative text on meaningful images; decorative images marked appropriately with <code>aria-hidden</code> or empty <code>alt</code>.</li>
        <li>Form fields with associated <code>&lt;label&gt;</code> elements and descriptive error messages.</li>
        <li>Keyboard-navigable menus, modals, carousels, and form flows.</li>
        <li>Sufficient colour contrast on primary text, buttons, and interactive elements.</li>
        <li>Visible focus indicators for keyboard users.</li>
        <li>Responsive layouts that support zoom up to 200% without loss of content or function.</li>
        <li>A &quot;skip to main content&quot; link on every page.</li>
        <li>Prefers-reduced-motion support for users who have requested reduced animation in their operating system.</li>
      </ul>

      <h2>5. Assistive Technology Compatibility</h2>
      <p>
        Our primary templates and forms are tested with commonly used assistive technologies, including:
      </p>
      <ul>
        <li><strong>Screen readers:</strong> NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android).</li>
        <li><strong>Screen magnification</strong> up to 200% and 400%.</li>
        <li><strong>Keyboard-only navigation</strong>, including tab order and focus trapping in modals.</li>
        <li><strong>Voice control</strong> tools such as Dragon NaturallySpeaking and OS-native voice control.</li>
      </ul>

      <h2>6. Known Limitations</h2>
      <p>
        We are committed to continuous improvement and acknowledge the following limitations:
      </p>
      <ul>
        <li>Some third-party embedded content (for example, YouTube or Vimeo videos) may not fully meet WCAG 2.1 AA. We select accessible providers where possible and provide transcripts on request.</li>
        <li>PDF documents published before [insert date] may not be fully tagged for screen readers. Accessible versions are available on request.</li>
        <li>Legacy blog articles may have images without descriptive alt text. We are retrospectively remediating these.</li>
      </ul>
      <p>
        If you encounter a barrier, please tell us — we will provide the information or service in an accessible format within a reasonable time.
      </p>

      <h2>7. Feedback and Contact</h2>
      <p>
        We welcome feedback on the accessibility of our website. If you experience any barrier, or would like information in an alternative format (for example, large print, audio, or a Word document instead of a PDF), please contact:
      </p>
      <ul>
        <li><strong>Email:</strong> support@danamotech.co.ke</li>
        <li><strong>Phone:</strong> +254 785 640 048</li>
        <li><strong>Postal:</strong> Danamo Tech Ltd, 93294 - 80102, Mombasa, Kenya</li>
      </ul>
      <p>
        We aim to acknowledge accessibility feedback within 2 working days and to provide a substantive response within 10 working days.
      </p>

      <h2>8. Enforcement</h2>
      <p>
        If you are not satisfied with our response, you may raise the matter with the <strong>National Council for Persons with Disabilities (NCPWD)</strong> or, where the matter concerns access to information, with the <strong>Commission on Administrative Justice (Office of the Ombudsman)</strong> or the <strong>Office of the Data Protection Commissioner</strong> where personal data is involved.
      </p>

      <h2>9. Ongoing Commitment</h2>
      <p>
        We review this statement at least annually, and whenever we make significant changes to the Site. We conduct periodic accessibility audits and incorporate findings into our design and development process. Our development team receives accessibility training as part of onboarding.
      </p>

      <h2>10. Preparation of This Statement</h2>
      <p>
        This statement was prepared using the W3C&apos;s <em>Accessibility Statement Generator</em> as a template, and adapted to reflect the Kenyan legal framework and our specific digital properties. It was last reviewed on <strong>10 November 2026</strong>.
      </p>

      <hr />
      <p className="text-sm italic text-gray-500 dark:text-gray-400">
        This Accessibility Statement is drafted to align with the Constitution of Kenya, 2010 (Arts. 27 and 54), the Persons with Disabilities Act, 2003, the Kenya Information and Communications Act (Cap 411A), the Access to Information Act, 2016 (s. 5(2)), and WCAG 2.1 Level AA. It should be reviewed by a qualified Kenyan advocate before publication and updated whenever the Site materially changes.
      </p>
    </LegalLayout>
  );
}