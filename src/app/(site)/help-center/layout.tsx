import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Help Center: Answers and Support",
  description:
    "Find answers about working with Danamo Tech: starting a project, our case studies, FAQs, webinars, careers and how we handle your data.",
  path: "/help-center",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
