import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Log In",
  description:
    "Log in to your Danamo Tech account.",
  path: "/login",
  noindex: true,
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
