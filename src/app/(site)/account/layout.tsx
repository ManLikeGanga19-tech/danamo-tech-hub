import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Your Account",
  description:
    "Manage your Danamo Tech account.",
  path: "/account",
  noindex: true,
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
