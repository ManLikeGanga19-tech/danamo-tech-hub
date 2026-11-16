import type { Metadata } from "next";
import BlogIndex from "./BlogIndex";
import { getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical articles from Danamo Tech on software, products and running technology for growing businesses.",
  alternates: { canonical: "/blog" },
};

// Re-fetched at most once a minute, so new posts appear without a redeploy.
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogIndex posts={posts} />;
}
