/**
 * Open roles shown on /careers and /careers/[slug].
 * To open or close a role, add or remove an entry here.
 */

export type Job = {
  slug: string;
  title: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  location: string;
  /** Remote, Hybrid or On-site — used for structured data. */
  workplace: "Remote" | "Hybrid" | "On-site";
  /** One or two sentences for the listing card. */
  summary: string;
  /** Opening paragraphs of the role page. */
  about: string[];
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  offer: string[];
  /** ISO date the role was posted. */
  postedAt: string;
};

export const jobs: Job[] = [
  {
    slug: "frontend-developer",
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote (Kenya)",
    workplace: "Remote",
    summary:
      "Build responsive, enterprise-grade web apps with React, Next.js, and Tailwind CSS.",
    about: [
      "Danamo Tech builds software that businesses and schools across Kenya rely on every day, including our own products ShuleHQ, WIFI.OS and VendaPOS, plus custom systems for clients.",
      "As a Frontend Developer you will turn designs into fast, accessible interfaces and work closely with the backend team on the APIs behind them.",
    ],
    responsibilities: [
      "Build and maintain web applications with React, Next.js and TypeScript",
      "Turn Figma designs into responsive, accessible, pixel-accurate UI",
      "Integrate REST APIs and handle loading, error and empty states properly",
      "Keep pages fast: code splitting, image optimisation and good Core Web Vitals",
      "Review pull requests and help keep the codebase clean and consistent",
    ],
    requirements: [
      "2+ years of professional experience with React",
      "Strong TypeScript, HTML and CSS (Tailwind CSS is a plus)",
      "Experience with Next.js (App Router) or a similar framework",
      "Comfortable with Git, pull requests and code review",
      "Good written English and clear communication when working remotely",
    ],
    niceToHave: [
      "Experience with Framer Motion or other animation libraries",
      "Familiarity with accessibility standards (WCAG)",
      "Some backend experience (Python/FastAPI or Node.js)",
    ],
    offer: [
      "Remote-first work with flexible hours",
      "Real products used by real customers in Kenya",
      "Mentorship and time for learning",
      "Competitive pay based on experience",
    ],
    postedAt: "2026-11-01",
  },
  {
    slug: "backend-engineer",
    title: "Backend Engineer",
    type: "Full-time",
    location: "Mombasa, Kenya",
    workplace: "Hybrid",
    summary:
      "Design scalable APIs, manage databases, and build robust infrastructure using Python or Node.js.",
    about: [
      "Our systems handle school records, billing and payments, so they need to be correct, secure and always available.",
      "As a Backend Engineer you will design APIs, model data and run the services behind our products, working from our Mombasa office and remotely.",
    ],
    responsibilities: [
      "Design and build REST APIs with Python (FastAPI) or Node.js",
      "Model data and write efficient queries and migrations for PostgreSQL",
      "Integrate third-party services such as M-Pesa, SMS and email providers",
      "Write automated tests and keep services observable with good logging",
      "Deploy and maintain services with Docker on Linux servers",
    ],
    requirements: [
      "3+ years building backend services in production",
      "Strong Python or Node.js, and solid SQL (PostgreSQL preferred)",
      "Understanding of authentication, security and data protection basics",
      "Experience with Docker and Linux",
      "Able to work from Mombasa at least part of the week",
    ],
    niceToHave: [
      "M-Pesa Daraja API integration experience",
      "Redis, background jobs and caching",
      "CI/CD with GitHub Actions",
    ],
    offer: [
      "Hybrid work between our Mombasa office and home",
      "Ownership of systems that matter to our customers",
      "Mentorship and time for learning",
      "Competitive pay based on experience",
    ],
    postedAt: "2026-11-01",
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    type: "Part-time",
    location: "Remote (Kenya)",
    workplace: "Remote",
    summary:
      "Craft intuitive, accessible, and visually stunning user experiences for our clients.",
    about: [
      "Good software starts with understanding the people who use it, from school bursars to shop owners.",
      "As a part-time UI/UX Designer you will research, design and test the experiences for our products and client projects.",
    ],
    responsibilities: [
      "Design user flows, wireframes and high-fidelity UI in Figma",
      "Maintain and extend our design system and components",
      "Run quick user interviews and usability tests, then act on what you learn",
      "Work with developers to make sure designs are built as intended",
    ],
    requirements: [
      "A portfolio showing web or mobile product design work",
      "Strong Figma skills, including components and auto layout",
      "Understanding of accessibility, typography and visual hierarchy",
      "Able to explain design decisions clearly",
    ],
    niceToHave: [
      "Experience designing dashboards or admin tools",
      "Basic HTML/CSS knowledge",
      "Motion or illustration skills",
    ],
    offer: [
      "Flexible part-time schedule, fully remote",
      "Variety: our own products plus client projects",
      "Competitive pay based on experience",
    ],
    postedAt: "2026-11-01",
  },
];

export function getJob(slug: string): Job | undefined {
  return jobs.find((job) => job.slug === slug);
}
