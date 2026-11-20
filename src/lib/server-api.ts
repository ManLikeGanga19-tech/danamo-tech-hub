// Base URL for server-side API calls (projects, blog, jobs, sitemap, llms.txt).
//
// At runtime the Next.js server reaches the backend on the private Docker
// network (BACKEND_INTERNAL_URL). That network does not exist during
// `next build`, so pages prerendered there would be baked in with empty lists
// and served to the first visitor after every deploy (often a search crawler).
// During the build we therefore read from the public API instead.
// Next.js sets NEXT_PHASE before it starts the prerender workers.
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

export const SERVER_API =
  IS_BUILD && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : `${process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8000"}/api/v1`;
