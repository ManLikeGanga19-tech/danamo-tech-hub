import { pageMetadata } from "@/lib/seo";
import BlogIndex from "./BlogIndex";
import { getPublishedPosts } from "@/lib/blog";

export const metadata = pageMetadata({
  title: "Blog: Software & Tech Insights for Businesses",
  description:
    "Practical articles from Danamo Tech in Mombasa on custom software, websites, M-Pesa integration, SaaS and running technology for growing Kenyan businesses.",
  path: "/blog",
});

// Re-fetched at most once a minute, so new posts appear without a redeploy.
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogIndex posts={posts} />;
}
