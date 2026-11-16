"use client";

import { Copy, Facebook, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";

const btn =
  "inline-flex items-center justify-center w-11 h-11 rounded-full border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 bg-white dark:bg-[#1E1E2F] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

/**
 * Real share actions:
 * - Facebook / LinkedIn: their official share dialogs, opened with the
 *   article URL (they read the page's Open Graph tags for the preview card).
 * - Instagram has no web share link. On phones we open the system share
 *   sheet (which includes Instagram, WhatsApp, etc.); elsewhere we copy the
 *   link so it can be pasted into a story, bio or DM.
 */
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const encoded = encodeURIComponent(url);
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;

  const openPopup = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Popup on desktop; the plain link still works if this is blocked.
    const w = window.open(href, "share", "width=640,height=640,noopener,noreferrer");
    if (w) e.preventDefault();
  };

  const copy = async (message = "Article link copied!") => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(message);
    } catch {
      toast.error("Couldn't copy the link. Please copy it from the address bar.");
    }
  };

  const shareInstagram = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return; // user closed the sheet
      }
    }
    await copy("Link copied. Paste it into your Instagram story, bio or message.");
  };

  return (
    <div className="flex items-center gap-3">
      <button type="button" className={`${btn} hover:bg-gray-800 dark:hover:bg-gray-600`} onClick={() => copy()} aria-label="Copy article link">
        <Copy className="w-4 h-4" aria-hidden="true" />
      </button>
      <a href={facebook} target="_blank" rel="noopener noreferrer" onClick={(e) => openPopup(e, facebook)} className={`${btn} hover:bg-[#1877F2] hover:border-[#1877F2]`} aria-label="Share on Facebook">
        <Facebook className="w-4 h-4" aria-hidden="true" />
      </a>
      <a href={linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => openPopup(e, linkedin)} className={`${btn} hover:bg-[#0A66C2] hover:border-[#0A66C2]`} aria-label="Share on LinkedIn">
        <Linkedin className="w-4 h-4" aria-hidden="true" />
      </a>
      <button type="button" onClick={shareInstagram} className={`${btn} hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-[#DD2A7B]`} aria-label="Share to Instagram">
        <Instagram className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
