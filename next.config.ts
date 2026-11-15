import type { NextConfig } from "next";

// Where the Next.js server reaches the FastAPI backend for the same-origin
// proxy used by the admin UI. Rewrites are resolved at BUILD time, so this is
// passed as a Docker build arg (http://danamo-backend:8000 in production).
const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  // Two root layouts ((site) and admin) need a standalone 404 page.
  experimental: {
    globalNotFound: true,
  },
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${BACKEND_INTERNAL_URL}/api/v1/:path*`,
      },
      // Proxy uploaded files so <img src="/uploads/webinars/xxx.jpg"> works
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_INTERNAL_URL}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
