"use client";

import { useEffect, useState } from "react";
import { Loader2, RotateCcw, Send, XCircle } from "lucide-react";
import { adminFetch } from "@/lib/admin/client";
import { errorMessage } from "@/lib/errors";
import { SITE_URL } from "@/lib/site";

type Announcement = {
  id: string;
  kind: "blog" | "webinar" | "job" | "project";
  title: string;
  path: string;
  status: "queued" | "sending" | "sent" | "cancelled" | "failed";
  send_after: string;
  sent_at: string | null;
  sent_count: number;
  note: string | null;
};

const KIND_LABEL: Record<Announcement["kind"], string> = {
  blog: "Article",
  webinar: "Webinar",
  job: "Job opening",
  project: "Case study",
};

const STATUS_STYLE: Record<Announcement["status"], string> = {
  queued: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  sending: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  sent: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** "New on Danamo Tech" emails, queued automatically when something is published. */
export default function UpdatesPanel() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () =>
    adminFetch<Announcement[]>("/data/newsletter/announcements")
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
    // Refresh while something is queued or sending, so the status stays current.
    const timer = setInterval(load, 30_000);
    return () => clearInterval(timer);
  }, []);

  const act = async (a: Announcement, action: "cancel" | "retry") => {
    if (action === "cancel" && !confirm(`Cancel the email about "${a.title}"? Subscribers won't be told about it.`)) return;
    setBusy(a.id);
    try {
      await adminFetch(`/data/newsletter/announcements/${a.id}/${action}`, { method: "POST" });
      await load();
    } catch (err) {
      alert(errorMessage(err, `Could not ${action} this update.`));
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" /> Update emails
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Subscribers are emailed automatically when you publish an article, announce a webinar, open a job or publish a
          case study. Each email waits 10 minutes first, so you can fix or cancel it; edits never send a second email.
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : items.length === 0 ? (
        <p className="p-8 text-center text-sm text-gray-600 dark:text-gray-400">No update emails yet. Publish something and it will appear here.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {items.map((a) => (
            <li key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                  <span className="text-xs font-medium text-gray-500">{KIND_LABEL[a.kind]}</span>
                </div>
                <a href={`${SITE_URL}${a.path}`} target="_blank" rel="noopener noreferrer" className="block mt-1 font-medium text-gray-900 dark:text-white hover:text-blue-600 truncate">
                  {a.title}
                </a>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {a.status === "queued" && `Sends after ${when(a.send_after)}`}
                  {a.status === "sending" && `Sending… ${a.sent_count} so far`}
                  {a.status === "sent" && `Sent to ${a.sent_count} subscriber${a.sent_count === 1 ? "" : "s"}${a.sent_at ? ` on ${when(a.sent_at)}` : ""}`}
                  {(a.status === "cancelled" || a.status === "failed") && (a.note ?? "")}
                  {a.status === "failed" && a.sent_count > 0 && ` (${a.sent_count} already sent)`}
                </p>
              </div>
              {a.status === "queued" && (
                <button onClick={() => act(a, "cancel")} disabled={busy === a.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50">
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              )}
              {a.status === "failed" && (
                <button onClick={() => act(a, "retry")} disabled={busy === a.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 disabled:opacity-50">
                  <RotateCcw className="w-4 h-4" /> Retry
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
