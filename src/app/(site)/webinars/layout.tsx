import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Tech Webinars for Kenyan Businesses",
  description:
    "Join free live webinars from Danamo Tech on software, digital tools and growing your business online, or watch replays of past sessions.",
  path: "/webinars",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
