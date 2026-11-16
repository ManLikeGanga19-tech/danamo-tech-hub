import type { Metadata } from "next";
import Link from "next/link";

// Shown for URLs that match no route at all. The app has two root layouts
// ((site) and admin), so this page stands alone and links nowhere but "/" —
// which is the home page on the public host and the dashboard on the admin host.
//
// It deliberately imports NO stylesheet or font module: anything imported here
// is bundled into the client entry of BOTH root layouts, so importing the
// site's globals.css leaked the public site's styles into the admin app.

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const css = `
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
         padding: 0 16px; background: #fff; color: #111827;
         font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .nf { text-align: center; }
  .nf-code { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: .2em; color: #4b5563; margin: 0 0 12px; }
  .nf h1 { font-size: 30px; font-weight: 700; margin: 0 0 16px; }
  .nf-text { color: #4b5563; margin: 0 auto 32px; max-width: 28rem; }
  .nf a { display: inline-block; border-radius: 8px; background: #2563eb; color: #fff; padding: 12px 20px;
          font-size: 14px; font-weight: 600; text-decoration: none; }
  .nf a:hover { background: #1d4ed8; }
  @media (prefers-color-scheme: dark) {
    body { background: #0e0e15; color: #fff; }
    .nf-code, .nf-text { color: #d1d5db; }
  }
`;

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="nf">
          <p className="nf-code">404</p>
          <h1>Page not found</h1>
          <p className="nf-text">The page you are looking for does not exist.</p>
          <Link href="/">Go to the start page</Link>
        </div>
      </body>
    </html>
  );
}
