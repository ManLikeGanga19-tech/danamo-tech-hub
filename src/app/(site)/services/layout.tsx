import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Software & Web Development Services in Kenya",
  description:
    "Custom web development, SaaS, e-commerce, UI/UX design, SEO, cloud and IT consulting from Danamo Tech in Mombasa. Tell us about your project and get a quote.",
  path: "/services",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
