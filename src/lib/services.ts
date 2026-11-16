/**
 * Service pages (/services/<slug>) — content from the "Service Page Content
 * Briefs" doc. One source of truth for the /services hub, the home page
 * cards, the sitemap and llms.txt.
 *
 * Facts only: every claim must be true of Danamo Tech. Prices are not
 * published until Danamo supplies ranges.
 */

export type IconKey = "code" | "wallet" | "package" | "cart" | "search" | "brush" | "server" | "headphones" | "megaphone";

export type ServiceSection = {
  heading: string;
  paragraphs?: string[];
  /** Feature grid: short title + one line. */
  features?: { title: string; text: string }[];
  /** Numbered process steps. */
  steps?: { title: string; text: string }[];
  /** Plain bullet list. */
  bullets?: string[];
};

export type CaseStudyKey = "shulehq" | "wifios" | "vendapos" | "tusome" | "usafe" | "woodenhouses" | "noahport";

export type Service = {
  slug: string;
  /** Option value in the /services inquiry form (?service=<value>). */
  value: string;
  /** Short name used in cards, menus and breadcrumbs. */
  name: string;
  /** One line for cards. */
  summary: string;
  icon: IconKey;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string[];
  sections: ServiceSection[];
  proof: { key: CaseStudyKey; note: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
  /** What changes the price (shown instead of published prices for now). */
  pricing: string[];
};

export const caseStudies: Record<CaseStudyKey, { slug: string; title: string; ownProduct: boolean }> = {
  shulehq: { slug: "shulehq-school-management-saas", title: "ShuleHQ", ownProduct: true },
  wifios: { slug: "wifios-isp-billing-platform", title: "WIFI.OS", ownProduct: true },
  vendapos: { slug: "vendapos-point-of-sale", title: "VendaPOS", ownProduct: true },
  tusome: { slug: "tusome-cbc-elearning", title: "Tusome", ownProduct: true },
  usafe: { slug: "u-safe-ppe-commerce-platform", title: "U-SAFE KE", ownProduct: false },
  woodenhouses: { slug: "wooden-houses-kenya-platform", title: "Wooden Houses Kenya", ownProduct: false },
  noahport: { slug: "noahport-mdm-device-management", title: "Noahport MDM", ownProduct: false },
};

export const services: Service[] = [
  // 1 ─────────────────────────────────────────────────────────────
  {
    slug: "web-development",
    value: "Web Development",
    name: "Custom Web Development",
    summary: "Business websites and web apps built to bring in inquiries and sales.",
    icon: "code",
    seoTitle: "Web Development Company in Mombasa, Kenya",
    seoDescription:
      "Custom websites and web apps built in Mombasa for Kenyan businesses: fast, mobile-first, M-Pesa ready and easy to update. See our work and get a quote.",
    h1: "Web Development in Mombasa for Growing Kenyan Businesses",
    intro: [
      "Danamo Tech is a web development company in Mombasa that builds custom websites and web applications for businesses, schools and startups across Kenya. We build sites that load fast on a phone, show up on Google and turn visitors into inquiries, orders and payments.",
      "Whether you need your first proper business website, a customer portal or a system to replace spreadsheets, we scope it with you, build it, and stay around to support it.",
    ],
    sections: [
      {
        heading: "What we build",
        features: [
          { title: "Business websites", text: "Fast, mobile-first sites that explain what you do and capture inquiries." },
          { title: "Web applications", text: "Portals, booking and ordering systems, and internal tools built around how you work." },
          { title: "Admin dashboards", text: "One place to manage leads, quotes, orders, content and reports." },
          { title: "Website redesigns", text: "Rebuild a slow or dated site without losing your Google rankings." },
          { title: "Integrations", text: "M-Pesa payments, SMS and email notifications, and your existing tools." },
          { title: "Content you control", text: "Update pages, products and posts yourself, with no developer needed." },
        ],
      },
      {
        heading: "Why custom instead of a template",
        paragraphs: [
          "Templates and page builders are fine for a simple brochure site. They become a problem when you need payments, logins, workflows or speed: plugins pile up, pages slow down and monthly fees grow.",
          "A custom build gives you a site that does exactly what your business needs, loads quickly on mobile data, integrates with M-Pesa properly and is yours to keep. You own the code, and there are no page-builder subscriptions.",
        ],
      },
      {
        heading: "How we work",
        steps: [
          { title: "Discovery call", text: "We learn about your business, customers and goals, and what the site must do." },
          { title: "Scope and quote", text: "A written scope listing pages, features, timeline and price, so there are no surprises." },
          { title: "Design", text: "Layouts and a clickable design you approve before we write code." },
          { title: "Build with regular demos", text: "You see working progress as we build and can give feedback early." },
          { title: "Testing and launch", text: "We test on phones and browsers, set up hosting, HTTPS and analytics, and go live." },
          { title: "Handover and support", text: "We train your team to update the site, and offer support plans after launch." },
        ],
      },
      {
        heading: "Technology that serves your business",
        bullets: [
          "Next.js and React for fast pages that Google can read and rank.",
          "Python (FastAPI) or Node.js back ends with PostgreSQL databases for reliable data.",
          "Docker-based hosting with automatic HTTPS, backups and monitoring.",
          "Search-engine basics built in: clean URLs, page titles, structured data and sitemaps.",
        ],
      },
    ],
    proof: [
      { key: "woodenhouses", note: "Marketing site and admin dashboard: every quote request captured and tracked in one place." },
      { key: "usafe", note: "Storefront and admin control plane for a PPE distributor, with a request-a-quote flow for bulk buyers." },
    ],
    pricing: [
      "The number of pages and custom features (logins, booking, payments, dashboards)",
      "Integrations such as M-Pesa, SMS, email or existing systems",
      "Whether you supply the text and photos or we prepare them",
      "Hosting and support after launch",
    ],
    faqs: [
      { q: "How much does a website cost in Kenya?", a: "It depends on what the site has to do. A simple business website costs far less than a web app with logins, payments and a dashboard. Tell us what you need and we'll send a written quote with a fixed scope." },
      { q: "How long does it take to build a website?", a: "A small business website usually takes a few weeks. Web applications with custom features take longer, typically a few months. You get a timeline in the quote and regular demos as we build." },
      { q: "Will I be able to update the website myself?", a: "Yes. We build an admin area where you can edit pages, products, posts and contact details, and we show your team how to use it." },
      { q: "Do you work with clients outside Mombasa?", a: "Yes. We are based in Mombasa and work with clients across Kenya and East Africa, and remotely with international clients." },
      { q: "Do you provide hosting, domains and maintenance?", a: "We can host and maintain what we build, including HTTPS, backups and updates, through a support plan. If you prefer your own hosting, we deploy there instead." },
      { q: "Can you redesign my existing website?", a: "Yes. We rebuild slow or dated sites and keep your existing pages and URLs working, so you don't lose the Google rankings you already have." },
    ],
    related: ["mpesa-integration", "ecommerce-development", "ui-ux-design", "seo"],
  },

  // 2 ─────────────────────────────────────────────────────────────
  {
    slug: "mpesa-integration",
    value: "M-Pesa Integration",
    name: "M-Pesa Integration",
    summary: "STK Push, Paybill and Till payments that confirm automatically.",
    icon: "wallet",
    seoTitle: "M-Pesa Integration for Websites & Apps in Kenya",
    seoDescription:
      "We integrate M-Pesa STK Push, Paybill and Till payments into websites, apps and business systems, with automatic confirmation and reconciliation.",
    h1: "M-Pesa Integration for Websites, Apps and Business Systems",
    intro: [
      "Danamo Tech integrates M-Pesa into websites, mobile apps and business systems for Kenyan businesses. Your customers pay with a PIN prompt on their phone, and your system marks the order, invoice or subscription as paid automatically, with no more checking SMS messages and updating records by hand.",
      "We run M-Pesa in production in our own products, ShuleHQ, WIFI.OS and Tusome, so we know what happens when payments are delayed, duplicated or fail.",
    ],
    sections: [
      {
        heading: "What we integrate",
        features: [
          { title: "STK Push (Lipa na M-Pesa Online)", text: "The customer gets a PIN prompt on their phone at checkout." },
          { title: "Paybill and Till (C2B)", text: "Payments made from the M-Pesa menu are matched to the right account automatically." },
          { title: "Payouts and refunds (B2C)", text: "Send money to customers, agents or staff from your system." },
          { title: "Transaction status checks", text: "Confirm payments that were delayed or interrupted, so nothing is lost." },
          { title: "Reconciliation reports", text: "Every payment matched to an order or invoice, ready for your accountant." },
          { title: "Receipts and notifications", text: "Automatic receipts and SMS or email confirmations." },
        ],
      },
      {
        heading: "How an M-Pesa payment works",
        steps: [
          { title: "Customer clicks Pay", text: "Your website or app sends the amount and phone number to Safaricom's Daraja API." },
          { title: "PIN prompt", text: "The customer sees an M-Pesa prompt on their phone and enters their PIN." },
          { title: "Safaricom confirms", text: "Safaricom sends the result to your system's secure callback address." },
          { title: "Order marked paid", text: "Your system verifies the payment, records the M-Pesa receipt number and updates the order, invoice or subscription." },
          { title: "Customer notified", text: "The customer sees a confirmation and gets a receipt by SMS or email." },
        ],
      },
      {
        heading: "What you need from Safaricom",
        paragraphs: [
          "To receive payments you need an M-Pesa Paybill or Till number, and your app must be approved to go live on Safaricom's Daraja platform. We guide you through the application, set up the test environment, and handle the go-live steps with you.",
          "Safaricom's requirements and charges change from time to time, so we confirm the current process with you at the start of each project.",
        ],
      },
      {
        heading: "Built to be reliable",
        bullets: [
          "Callbacks are verified before an order is marked paid, so fake confirmations are rejected.",
          "Duplicate callbacks are detected, so a customer is never charged or credited twice.",
          "Payments with no callback are rechecked automatically with a status query.",
          "Every transaction is logged for audit and reconciliation, in line with the Kenya Data Protection Act, 2019.",
        ],
      },
    ],
    proof: [
      { key: "shulehq", note: "Parents pay school fees by M-Pesa STK Push, and invoices update automatically." },
      { key: "wifios", note: "Internet customers pay by STK Push or Paybill, and their service is restored instantly." },
      { key: "tusome", note: "Families subscribe to CBC lessons with M-Pesa STK Push in seconds." },
    ],
    pricing: [
      "Adding M-Pesa to an existing system or building it into a new one",
      "Which payment types you need (STK Push, Paybill/Till, payouts)",
      "Reconciliation, reporting and receipt requirements",
      "The platform your current system runs on",
    ],
    faqs: [
      { q: "How long does M-Pesa integration take?", a: "The code is often the quicker part: the Safaricom go-live approval can take longer, so we start it early. You get a timeline for your project in the quote." },
      { q: "Do I need a Paybill or a Till number?", a: "You need one of them to receive money. Paybill suits payments against an account number (like invoices or school fees); a Till suits buy-goods payments. We help you choose." },
      { q: "Can you add M-Pesa to my existing website?", a: "Usually yes. We first review how your site or system handles orders and invoices, so each payment updates the right records, then confirm the approach in the quote." },
      { q: "What happens if the customer pays but the callback fails?", a: "Our integrations query Safaricom for the transaction status when no callback arrives, so the payment is still matched and the order is updated." },
      { q: "Can customers also pay with Airtel Money or card?", a: "Yes. We can add card payments and other mobile money options through a payment provider alongside M-Pesa." },
    ],
    related: ["web-development", "ecommerce-development", "saas-development"],
  },

  // 3 ─────────────────────────────────────────────────────────────
  {
    slug: "saas-development",
    value: "SaaS",
    name: "SaaS Product Development",
    summary: "From MVP to a live product with paying customers.",
    icon: "package",
    seoTitle: "SaaS & Software Product Development in Kenya",
    seoDescription:
      "From MVP to a live product with paying customers: we design, build and run SaaS platforms in Kenya, like our own ShuleHQ and WIFI.OS.",
    h1: "SaaS Product Development, From MVP to Paying Customers",
    intro: [
      "Danamo Tech is a SaaS development company in Kenya that designs, builds and runs software products. We don't only build SaaS for clients: we run our own, including ShuleHQ for schools and WIFI.OS for internet providers, so we build with real operating experience.",
      "If you are a founder with a product idea, or a company turning an internal tool into a product others can pay for, we help you launch fast and grow safely.",
    ],
    sections: [
      {
        heading: "What we deliver",
        features: [
          { title: "Product scoping", text: "Turn the idea into a clear first version: users, core features and what can wait." },
          { title: "MVP build", text: "A working product real customers can sign up for and use." },
          { title: "Multi-tenant architecture", text: "Each customer gets their own space and data, on one platform you manage." },
          { title: "Subscriptions and billing", text: "Plans, trials and recurring payments by M-Pesa and card." },
          { title: "Admin and reporting", text: "A control panel to onboard customers, manage plans and see usage." },
          { title: "Hosting and operations", text: "Deployment, monitoring, backups and updates once you have customers." },
        ],
      },
      {
        heading: "MVP first, then grow",
        paragraphs: [
          "The fastest way to a successful product is to launch a focused first version, learn from real users, and build what they actually need. We help you cut the scope to what matters for launch, without cutting corners on security or data.",
        ],
        steps: [
          { title: "Discover", text: "Users, problem, competitors and the smallest product worth paying for." },
          { title: "MVP", text: "Design and build the core product with billing and an admin panel." },
          { title: "Launch", text: "Hosting, monitoring and onboarding for your first customers." },
          { title: "Grow", text: "Ship improvements based on usage and feedback, on a regular release cycle." },
        ],
      },
      {
        heading: "Built for Kenyan customers",
        bullets: [
          "M-Pesa subscriptions and payments, with card payments where needed.",
          "Mobile-first interfaces that work well on mid-range phones and slower connections.",
          "SMS and email notifications for sign-ups, payments and reminders.",
          "Data handling designed with the Kenya Data Protection Act, 2019 in mind.",
        ],
      },
      {
        heading: "After launch",
        paragraphs: [
          "Software products need ongoing care. We can stay on as your product team: monitoring, backups, security updates, bug fixes and new features, on a monthly plan or per release.",
        ],
      },
    ],
    proof: [
      { key: "shulehq", note: "Our multi-tenant school management SaaS: each school gets its own portal with isolated data." },
      { key: "wifios", note: "Our ISP billing platform: each provider gets its own console, captive portal and staff accounts." },
      { key: "tusome", note: "Our CBC e-learning subscription product with a free trial and M-Pesa plans." },
      { key: "vendapos", note: "Our upcoming multi-tenant point-of-sale platform, in active development." },
    ],
    pricing: [
      "The size of the first version (MVP) and how many user types it serves",
      "Billing and payment requirements",
      "Integrations with other systems or hardware",
      "Whether you want us to host and run the product after launch",
    ],
    faqs: [
      { q: "How much does it cost to build an MVP in Kenya?", a: "It depends on the scope of the first version. We help you define the smallest version worth launching, then quote it as a fixed scope so you know the cost upfront." },
      { q: "How long until my product can take its first customers?", a: "A focused MVP typically takes a few months from discovery to launch. We agree the timeline in the scope and show working progress throughout." },
      { q: "Who owns the code and the customer data?", a: "You do. The code, the product and your customers' data belong to you." },
      { q: "Can you host and maintain the product after launch?", a: "Yes. We can run hosting, monitoring, backups and updates, and keep developing new features on a monthly plan." },
      { q: "Can my SaaS charge customers through M-Pesa?", a: "Yes. We build M-Pesa subscriptions and payments into products, as we have in our own products ShuleHQ, WIFI.OS and Tusome." },
    ],
    related: ["mpesa-integration", "cloud-devops", "ui-ux-design"],
  },

  // 4 ─────────────────────────────────────────────────────────────
  {
    slug: "ecommerce-development",
    value: "E-Commerce",
    name: "E-Commerce Development",
    summary: "Online shops with M-Pesa and card checkout, and an admin you can run.",
    icon: "cart",
    seoTitle: "E-Commerce Website Development in Kenya",
    seoDescription:
      "Online shops built for Kenya: M-Pesa and card checkout, delivery options, stock and order management, and an admin your team can run.",
    h1: "E-Commerce Websites That Sell, With M-Pesa Checkout",
    intro: [
      "Danamo Tech builds e-commerce websites for Kenyan businesses that want to sell online with a checkout their customers already trust. Shoppers pay by M-Pesa or card, you get the order instantly, and your team manages products, stock and deliveries from one dashboard.",
      "We build stores for retail orders and for businesses that sell in bulk and quote corporate buyers.",
    ],
    sections: [
      {
        heading: "Features of the stores we build",
        features: [
          { title: "Product catalogue", text: "Categories, brands, filters, search and rich product pages." },
          { title: "M-Pesa and card checkout", text: "STK Push at checkout, with card payments where you need them." },
          { title: "Delivery options", text: "Delivery zones and fees, pickup points and order tracking." },
          { title: "Stock and orders", text: "Live stock levels, order statuses and low-stock alerts." },
          { title: "Bulk quote requests", text: "Let corporate buyers request quotes instead of paying online." },
          { title: "Customer accounts", text: "Order history, saved addresses and repeat ordering." },
        ],
      },
      {
        heading: "Custom store or Shopify and WooCommerce?",
        paragraphs: [
          "Hosted platforms like Shopify are quick to start and suit simple shops. WooCommerce suits businesses already on WordPress. Both rely on plugins and monthly fees, and M-Pesa support varies.",
          "A custom store makes sense when you need M-Pesa built in properly, business-to-business quoting, unusual pricing or delivery rules, integration with your own systems, or full control of speed and data. We will tell you honestly which fits your budget and plans.",
        ],
      },
      {
        heading: "Running the store day to day",
        bullets: [
          "An admin dashboard to manage products, prices, stock and orders.",
          "Instant order notifications by email, and SMS where needed.",
          "Sales reports by product, category and period.",
          "Roles and permissions for staff, with an activity log.",
        ],
      },
      {
        heading: "Getting found by shoppers",
        paragraphs: [
          "A store only sells if people find it. We build product pages Google can read, with clean URLs, structured product data, fast mobile pages and a sitemap. Our SEO services can take it further.",
        ],
      },
    ],
    proof: [
      { key: "usafe", note: "A multi-brand PPE catalogue with a request-a-quote flow for bulk and corporate buyers." },
    ],
    pricing: [
      "The number of products and how they vary (sizes, colours, brands)",
      "Payment and delivery rules",
      "Bulk quoting, wholesale pricing or customer accounts",
      "Integration with your stock, accounting or courier systems",
    ],
    faqs: [
      { q: "How much does an online shop cost in Kenya?", a: "It depends on your catalogue, payment and delivery needs. Tell us what you sell and how you deliver, and we'll send a quote with a fixed scope." },
      { q: "Can customers pay with M-Pesa at checkout?", a: "Yes. We build M-Pesa STK Push into checkout, so the order is marked paid as soon as the customer enters their PIN." },
      { q: "Can my store connect to a courier for delivery?", a: "We can set delivery zones and fees, and integrate with a courier that offers an API. We'll confirm what your preferred courier supports." },
      { q: "Can I add and edit products myself?", a: "Yes. You manage products, prices, photos and stock from the admin dashboard." },
      { q: "Can you move my existing store to a new platform?", a: "Yes. We migrate products, customers and order history where your current platform allows it, and keep your product URLs working for Google." },
    ],
    related: ["mpesa-integration", "web-development", "seo", "digital-marketing"],
  },

  // 5 ─────────────────────────────────────────────────────────────
  {
    slug: "seo",
    value: "SEO",
    name: "SEO Services",
    summary: "Get found on Google in Mombasa and across Kenya.",
    icon: "search",
    seoTitle: "SEO Services in Mombasa & Kenya",
    seoDescription:
      "Get found on Google in Mombasa and across Kenya: technical SEO, local SEO and Google Business Profile, and content that brings in customers.",
    h1: "SEO Services in Mombasa That Bring Customers From Google",
    intro: [
      "Danamo Tech provides SEO services in Mombasa for businesses that want more customers from Google. SEO simply means showing up when people search for what you sell, in your area, and turning those visitors into calls, inquiries and sales.",
      "Because we build websites as well as optimise them, we fix the technical problems that hold most Kenyan sites back, not only the keywords.",
    ],
    sections: [
      {
        heading: "What we do",
        features: [
          { title: "Technical SEO", text: "Speed, indexing, canonical URLs, sitemaps, structured data and mobile usability." },
          { title: "On-page SEO", text: "Page titles, descriptions, headings, content and internal links for the searches that matter." },
          { title: "Local SEO", text: "Google Business Profile, Maps, local directories and reviews for Mombasa and beyond." },
          { title: "Content plans", text: "Pages and articles that answer what your customers are searching for." },
          { title: "Search Console and analytics", text: "Set up, monitored and explained in plain language." },
          { title: "AI search visibility", text: "Clear, consistent business facts that search engines and AI assistants can read." },
        ],
      },
      {
        heading: "Local SEO for Mombasa businesses",
        paragraphs: [
          "Many customers search with \"near me\" or a town name. Showing up there depends on a complete Google Business Profile, consistent business details across the web, genuine reviews, and a website that clearly says where you work. We set up and improve all of these.",
        ],
      },
      {
        heading: "How we work",
        steps: [
          { title: "Audit", text: "We check how Google sees your site and where you rank today." },
          { title: "Prioritised fix list", text: "Every issue ranked by impact, starting with what stops pages being indexed." },
          { title: "Monthly work", text: "Fixes, content and local SEO, agreed each month." },
          { title: "Plain-language reports", text: "What changed, what it achieved and what comes next." },
        ],
      },
      {
        heading: "What results to expect, and when",
        paragraphs: [
          "Technical fixes can show in Google within weeks. Rankings for competitive searches usually take several months of steady work. Nobody can honestly guarantee the first position on Google, and we never will.",
        ],
      },
    ],
    proof: [],
    pricing: [
      "A one-off audit or ongoing monthly SEO",
      "The size of your website and how many locations you serve",
      "How much new content is needed",
      "Whether technical fixes need development work",
    ],
    faqs: [
      { q: "How long does SEO take to work?", a: "Technical fixes can show results within weeks. Ranking for competitive searches usually takes several months of consistent work." },
      { q: "Do you guarantee first place on Google?", a: "No. No one honest can guarantee a ranking, because Google decides. We focus on the work that reliably improves visibility and report on progress every month." },
      { q: "What is local SEO and does my business need it?", a: "Local SEO helps you appear when people search for your service in a town or \"near me\". If your customers are in Mombasa or a specific area, you need it." },
      { q: "Can you set up my Google Business Profile?", a: "Yes. We set it up or improve it, with the right categories, services, photos and description, and show you how to collect reviews within Google's rules." },
      { q: "Do I need a new website to improve my SEO?", a: "Not always. Many sites can be fixed. If your site is too slow or hard to change, we'll tell you whether a rebuild is the better investment." },
    ],
    related: ["web-development", "digital-marketing", "ecommerce-development"],
  },

  // 6 ─────────────────────────────────────────────────────────────
  {
    slug: "ui-ux-design",
    value: "Branding",
    name: "Branding & UI/UX Design",
    summary: "Brand identity, website and app design, tested with real users.",
    icon: "brush",
    seoTitle: "UI/UX Design & Branding in Mombasa, Kenya",
    seoDescription:
      "Brand identity, website and app design, and clickable prototypes tested with real users, from a Mombasa team that also builds what it designs.",
    h1: "UI/UX Design and Branding for Websites and Apps",
    intro: [
      "Danamo Tech provides UI/UX design and branding in Mombasa for businesses building websites, apps and software. Good design makes software easy to use and makes your business look as trustworthy as it is.",
      "Because the same team designs and builds, what you approve is what gets built.",
    ],
    sections: [
      {
        heading: "What we design",
        features: [
          { title: "Brand identity", text: "Logo, colours, typography and simple brand guidelines." },
          { title: "Website design", text: "Page layouts that guide visitors to call, inquire or buy." },
          { title: "App and dashboard UI", text: "Clear screens for complex tasks such as billing, school records or stock." },
          { title: "Design systems", text: "Reusable components that keep every screen consistent." },
          { title: "Clickable prototypes", text: "Try the product before it is built, and change it cheaply." },
          { title: "UX reviews", text: "Find where users get stuck in an existing site or app." },
        ],
      },
      {
        heading: "Our design process",
        steps: [
          { title: "Research", text: "Who the users are, what they need to do and where they struggle today." },
          { title: "Wireframes", text: "The structure of each screen, agreed before visual design." },
          { title: "Visual design", text: "Colours, type and imagery that fit your brand." },
          { title: "Prototype and test", text: "A clickable prototype, tested with real users where possible." },
          { title: "Hand-off to build", text: "Design files and components ready for development." },
        ],
      },
      {
        heading: "Designing for Kenyan users",
        bullets: [
          "Mobile-first layouts, since most visitors arrive on a phone.",
          "Light pages that load quickly on mobile data.",
          "Clear, familiar payment flows for M-Pesa.",
          "Accessible design that follows WCAG 2.1 AA: readable contrast, keyboard use and clear labels.",
        ],
      },
    ],
    proof: [
      { key: "shulehq", note: "Dashboards for directors, secretaries and parents, each focused on their daily tasks." },
      { key: "wifios", note: "An ISP console, captive portal and field tools designed for staff and customers on mobile." },
    ],
    pricing: [
      "Brand identity only, or design for a website or app",
      "The number of screens and user types",
      "Whether user research and testing are included",
      "Whether we also build the design",
    ],
    faqs: [
      { q: "What is the difference between UI and UX?", a: "UX (user experience) is how easy and useful a product is: the flow, structure and steps. UI (user interface) is how it looks: layout, colours, type and components. We do both." },
      { q: "Do I get the source design files?", a: "Yes. You receive the design files and brand assets for your project." },
      { q: "Can you redesign my existing app without rebuilding it?", a: "Often yes. We can redesign screens and improve flows within your existing product, then implement the changes step by step." },
      { q: "How many design revisions are included?", a: "The number of revision rounds is agreed in the scope before we start, so you know exactly what is included." },
    ],
    related: ["web-development", "saas-development", "digital-marketing"],
  },

  // 7 ─────────────────────────────────────────────────────────────
  {
    slug: "cloud-devops",
    value: "Cloud",
    name: "Cloud & DevOps",
    summary: "Reliable hosting, automated deployments, backups and monitoring.",
    icon: "server",
    seoTitle: "Cloud Hosting & DevOps Services in Kenya",
    seoDescription:
      "Reliable hosting for your apps: Docker deployments, automatic HTTPS, CI/CD, backups and monitoring, set up and managed from Mombasa.",
    h1: "Cloud Hosting and DevOps That Keep Your Systems Running",
    intro: [
      "Danamo Tech sets up and manages cloud hosting and DevOps for Kenyan businesses whose websites and systems need to stay online. Downtime and failed updates cost sales and trust; we make releases routine and systems dependable.",
      "We run our own products and several client systems in production on infrastructure we built and maintain, so we know what it takes to keep things running.",
    ],
    sections: [
      {
        heading: "What we set up",
        features: [
          { title: "Servers", text: "A virtual private server or cloud setup sized for your traffic and budget." },
          { title: "Docker deployments", text: "Each app in its own container, easy to update and move between providers." },
          { title: "Automatic HTTPS", text: "Certificates issued and renewed automatically for every domain." },
          { title: "CI/CD pipelines", text: "Code is tested and built automatically, so releases are repeatable." },
          { title: "Backups", text: "Scheduled database and file backups, with tested restores." },
          { title: "Monitoring and alerts", text: "Health checks and alerts before your customers notice a problem." },
        ],
      },
      {
        heading: "Migrations without the drama",
        paragraphs: [
          "Moving from shared hosting or a single fragile server is where things often break. We plan migrations step by step, test the new setup before switching, and schedule any cut-over for a quiet time, with a rollback plan ready.",
        ],
      },
      {
        heading: "Security and data protection",
        bullets: [
          "Firewalls that expose only what must be public.",
          "Least-privilege access for people and services.",
          "Security headers, rate limiting and protected admin areas.",
          "Practices aligned with the Kenya Data Protection Act, 2019.",
        ],
      },
      {
        heading: "Managed hosting and maintenance",
        paragraphs: [
          "After setup, we can manage everything for you on a monthly plan: updates, backups, uptime checks and fixes, with agreed response times.",
        ],
      },
    ],
    proof: [
      { key: "wifios", note: "Router provisioning over an encrypted WireGuard management network, with live status." },
      { key: "shulehq", note: "Multi-tenant SaaS deployed with Docker, serving each school on its own subdomain." },
      { key: "usafe", note: "Docker-first architecture, so hosting can move between providers by configuration." },
    ],
    pricing: [
      "A one-off setup or ongoing monthly management",
      "How many apps, databases and domains you run",
      "Backup frequency and how quickly you need recovery",
      "Support hours and response times",
    ],
    faqs: [
      { q: "Should I use a big cloud provider or a VPS?", a: "It depends on your traffic, budget and where your users are. A well-run VPS suits many Kenyan businesses; large cloud providers suit systems that must scale quickly. We recommend based on your needs." },
      { q: "Can you take over hosting from my current developer?", a: "Yes. We review the current setup, document it, fix the risks and then take over management." },
      { q: "How often are backups taken?", a: "We agree the schedule with you based on how often your data changes, and we test that backups can actually be restored." },
      { q: "What happens if my site goes down?", a: "Monitoring alerts us when a site or service fails a health check, so problems are found quickly. Response times are agreed in your support plan." },
    ],
    related: ["saas-development", "it-consulting", "web-development"],
  },

  // 8 ─────────────────────────────────────────────────────────────
  {
    slug: "it-consulting",
    value: "Consulting",
    name: "IT Consulting & Support",
    summary: "Clear advice before you spend, and support after you launch.",
    icon: "headphones",
    seoTitle: "IT Consulting & Support in Mombasa, Kenya",
    seoDescription:
      "Independent advice on the right software, systems and costs for your business, plus ongoing support, from a Mombasa team that builds and runs software.",
    h1: "IT Consulting and Support for Kenyan Businesses",
    intro: [
      "Danamo Tech offers IT consulting in Mombasa for business owners and managers who know they need better technology but aren't sure what to buy. Get clear, practical advice before you spend, from a team that builds and runs software every day.",
    ],
    sections: [
      {
        heading: "When to talk to us",
        features: [
          { title: "Choosing software", text: "Off-the-shelf or custom? We compare options for your budget and needs." },
          { title: "Replacing paper and spreadsheets", text: "Find the right system to run sales, stock, fees or records." },
          { title: "Rescuing a stalled project", text: "Review what exists, what is missing and how to finish it." },
          { title: "Checking a quote", text: "A second opinion on a proposal from another developer." },
          { title: "Data protection", text: "Practical steps towards the Kenya Data Protection Act, 2019 for systems holding customer data." },
          { title: "Planning for growth", text: "Make sure today's systems will cope with tomorrow's customers." },
        ],
      },
      {
        heading: "What you get from a consultation",
        paragraphs: [
          "A written recommendation in plain language: the options, what each would cost and how long it would take, and what we would do in your position. You can take it to any provider; you are not obliged to hire us to build it.",
        ],
      },
      {
        heading: "Ongoing support",
        bullets: [
          "Maintenance of existing websites and systems, including ones built by others.",
          "Bug fixes and small improvements on request.",
          "Agreed response times, so you know when to expect help.",
          "Regular check-ins on security, backups and performance.",
        ],
      },
    ],
    proof: [
      { key: "noahport", note: "Scoped and built a dedicated device management system to control a shared fleet of company phones." },
      { key: "woodenhouses", note: "Replaced scattered enquiry channels with one dashboard to track every quote request." },
    ],
    pricing: [
      "A one-off consultation or an ongoing support plan",
      "The size and condition of the systems involved",
      "Support hours and response times you need",
    ],
    faqs: [
      { q: "Can you support a system another company built?", a: "Usually yes. We review the code and hosting first, then tell you honestly what it would take to support it." },
      { q: "How does a consultation start?", a: "With a short call to understand your business and the problem. Any detailed review or written recommendation is quoted upfront, before work begins." },
      { q: "Can you help us comply with the Kenya Data Protection Act?", a: "We can review how your systems collect, store and secure personal data, and fix the technical gaps. For legal advice, work with a data protection lawyer alongside us." },
      { q: "Do you work on-site in Mombasa or remotely?", a: "Both. We are based in Mombasa and can meet clients there, and we work remotely with clients elsewhere in Kenya and beyond." },
    ],
    related: ["cloud-devops", "web-development", "saas-development"],
  },

  // 9 ─────────────────────────────────────────────────────────────
  {
    slug: "digital-marketing",
    value: "Marketing",
    name: "Digital Marketing & Social Media",
    summary: "Ads, content and tracking measured in leads and sales.",
    icon: "megaphone",
    seoTitle: "Digital Marketing & Social Media in Mombasa",
    seoDescription:
      "Google and social media ads, content and analytics that turn visitors into leads and sales, tracked to real results for Mombasa and Kenyan businesses.",
    h1: "Digital Marketing That Brings Measurable Leads",
    intro: [
      "Danamo Tech provides digital marketing in Mombasa for businesses that want more inquiries and sales online, measured in leads and revenue rather than likes. We combine advertising and content with what we know best: fast websites and landing pages that convert.",
    ],
    sections: [
      {
        heading: "What we do",
        features: [
          { title: "Google Ads", text: "Search campaigns for people already looking for what you sell." },
          { title: "Facebook and Instagram ads", text: "Targeted campaigns to reach new customers in your area." },
          { title: "Social media content", text: "Posts and visuals that keep your brand active and consistent." },
          { title: "Email campaigns", text: "Newsletters and follow-ups to customers who opted in." },
          { title: "Landing pages", text: "Focused pages built to turn ad clicks into inquiries." },
          { title: "Tracking and analytics", text: "Conversion tracking set up with visitor consent, so every shilling is measured." },
        ],
      },
      {
        heading: "Measured in results",
        paragraphs: [
          "Before we spend on ads, we set up tracking so we can see which campaigns bring inquiries and sales. Each month you get a short report on cost per lead and what we will change next.",
        ],
      },
      {
        heading: "Ads work better on a good website",
        paragraphs: [
          "Paying for clicks to a slow or confusing site wastes money. Because we also build websites, we fix the pages your ads send people to, so more visitors become customers.",
        ],
      },
    ],
    proof: [],
    pricing: [
      "Which channels you want to use",
      "Campaign setup and monthly management",
      "Content and design needed each month",
      "Your ad budget, which you pay directly to Google or Meta",
    ],
    faqs: [
      { q: "How much should a small business spend on ads in Kenya?", a: "Start with a budget you can sustain for a few months, so there is enough data to learn what works. We'll recommend a starting budget based on your goals and market." },
      { q: "Do you manage our social media accounts day to day?", a: "We can create and schedule content and run campaigns. Day-to-day replies to customers usually work best from your own team, and we set up the tools to make that easy." },
      { q: "How soon will we see results from ads?", a: "Ads can bring traffic within days. It usually takes a few weeks of testing to find the campaigns that bring leads at a good cost." },
      { q: "Do I own my ad accounts and data?", a: "Yes. Ad accounts, pages and analytics are set up in your name, and we work in them with access you control." },
    ],
    related: ["seo", "web-development", "ecommerce-development"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
