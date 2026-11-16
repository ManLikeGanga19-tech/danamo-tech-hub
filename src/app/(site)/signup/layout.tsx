import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create an Account",
  description:
    "Create a Danamo Tech account to apply for jobs, register for webinars and send project inquiries.",
  path: "/signup",
  noindex: true,
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
