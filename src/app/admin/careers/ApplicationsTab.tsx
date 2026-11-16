"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, Download, Eye, FileText, Loader2, Mail, Phone, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminFetch } from "@/lib/admin/client";
import { errorMessage } from "@/lib/errors";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role_slug: string; // role title at the time of applying
  job_id: string | null;
  cover_letter: string | null;
  cv_file_id: string | null;
  cover_letter_file_id: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["received", "reviewing", "shortlisted", "interview", "offered", "hired", "rejected"] as const;

const STATUS_STYLE: Record<string, string> = {
  received: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  reviewing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  shortlisted: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  interview: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  offered: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  hired: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

async function downloadFile(fileId: string, fallbackName: string) {
  const res = await fetch(`/api/proxy/admin/data/cv/${fileId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Download failed");
  // Keep the applicant's original file name and extension when the server sends it.
  const disposition = res.headers.get("content-disposition") ?? "";
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
  const name = match ? decodeURIComponent(match[1]) : fallbackName;
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ApplicationsTab({ refreshKey }: { refreshKey: number }) {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewing, setViewing] = useState<Application | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<Application[]>("/data/applications")
      .then((data) => {
        setApps(data);
        setError("");
      })
      .catch((err) => setError(errorMessage(err, "Failed to load applications.")))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const roles = useMemo(() => Array.from(new Set(apps.map((a) => a.role_slug))).sort(), [apps]);
  const shown = apps.filter(
    (a) => (roleFilter === "all" || a.role_slug === roleFilter) && (statusFilter === "all" || a.status === statusFilter),
  );

  const download = async (fileId: string, app: Application, kind: "CV" | "Cover_Letter") => {
    setBusy(fileId);
    try {
      await downloadFile(fileId, `${app.full_name.replace(/\s+/g, "_")}_${kind}`);
    } catch {
      alert(`Could not download the ${kind === "CV" ? "CV" : "cover letter"}. It may have been removed from the server.`);
    } finally {
      setBusy(null);
    }
  };

  const updateStatus = async (app: Application, status: string) => {
    try {
      const updated = await adminFetch<Application>(`/data/applications/${app.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setApps((list) => list.map((a) => (a.id === app.id ? updated : a)));
      setViewing((v) => (v && v.id === app.id ? updated : v));
    } catch (err) {
      alert(errorMessage(err, "Could not update the status."));
    }
  };

  const remove = async (app: Application) => {
    if (!confirm(`Delete ${app.full_name}'s application, CV and cover letter permanently?`)) return;
    try {
      await adminFetch(`/data/applications/${app.id}`, { method: "DELETE" });
      setApps((list) => list.filter((a) => a.id !== app.id));
      setViewing(null);
    } catch (err) {
      alert(errorMessage(err, "Could not delete the application."));
    }
  };

  const selectClass =
    "h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-white";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <select aria-label="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={selectClass}>
          <option value="all">All roles</option>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${selectClass} capitalize`}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="sm:ml-auto self-center text-sm text-gray-600 dark:text-gray-400">
          {shown.length} of {apps.length} application{apps.length === 1 ? "" : "s"}
        </span>
      </div>

      {error && (
        <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-md">{error}</div>
      )}

      <div className="bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : shown.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-700 dark:text-gray-300">{apps.length ? "No applications match these filters." : "No applications yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  {["Date", "Applicant", "Role", "Status", ""].map((h) => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {shown.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{formatDate(app.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{app.full_name}</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{app.role_slug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[app.status] ?? STATUS_STYLE.received}`}>{app.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button onClick={() => setViewing(app)} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#1E1E2F] rounded-2xl max-h-[92vh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-900 dark:text-white">{viewing.full_name}</DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Applied for <strong>{viewing.role_slug}</strong> on {formatDate(viewing.created_at)}</p>
              </DialogHeader>

              <div className="space-y-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <a href={`mailto:${viewing.email}`} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"><Mail className="w-4 h-4" /> {viewing.email}</a>
                  {viewing.phone && (
                    <a href={`tel:${viewing.phone}`} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"><Phone className="w-4 h-4" /> {viewing.phone}</a>
                  )}
                </div>

                <div>
                  <label htmlFor="app-status" className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select id="app-status" value={viewing.status} onChange={(e) => updateStatus(viewing, e.target.value)} className={`${selectClass} w-full mt-1.5 capitalize`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  {viewing.cv_file_id ? (
                    <button onClick={() => download(viewing.cv_file_id!, viewing, "CV")} disabled={busy === viewing.cv_file_id} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white">
                      {busy === viewing.cv_file_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download CV
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-gray-500 italic"><FileText className="w-4 h-4" /> No CV on file</span>
                  )}
                  {viewing.cover_letter_file_id && (
                    <button onClick={() => download(viewing.cover_letter_file_id!, viewing, "Cover_Letter")} disabled={busy === viewing.cover_letter_file_id} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60">
                      {busy === viewing.cover_letter_file_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download cover letter
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Cover letter</h3>
                  {viewing.cover_letter ? (
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {viewing.cover_letter}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {viewing.cover_letter_file_id ? "Uploaded as a file — use “Download cover letter” above." : "No cover letter."}
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
                  <button onClick={() => remove(viewing)} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Trash2 className="w-4 h-4" /> Delete application
                  </button>
                  <a href={`mailto:${viewing.email}?subject=${encodeURIComponent(`Your application for ${viewing.role_slug} at Danamo Tech`)}`} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Mail className="w-4 h-4" /> Reply by email
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
