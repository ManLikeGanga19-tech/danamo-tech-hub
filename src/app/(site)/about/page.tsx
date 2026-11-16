import AboutClient from "./AboutClient";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us: Software Developers in Mombasa",
  description:
    "Danamo Tech is a Mombasa software company building websites, apps and business systems for startups, SMEs and schools in Kenya. Learn who we are and how we work.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutClient />;
}
