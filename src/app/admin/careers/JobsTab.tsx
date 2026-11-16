"use client";

import { useEffect, useState } from "react";
import { Briefcase, Edit3, ExternalLink, Loader2, Lock, Plus, Trash2, Unlock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFetch } from "@/lib/admin/client";
import { errorMessage } from "@/lib/errors";
import { SITE_URL } from "@/lib/site";

export type JobStatus = "draft" | "open" | "closed";

export type AdminJob = {
  id: string;
  title: string;
  slug: string;
  employment_type: "Full-time" | "Part-time" | "Contract" | "Internship";
  location: string;
  workplace: "Remote" | "Hybrid" | "On-site";
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  offer: string[];
  status: JobStatus;
  display_order: number;
  posted_at: string | null;
  application_count: number;
};

type Form = {
  title: string;
  slug: string;
  employment_type: AdminJob["employment_type"];
  location: string;
  workplace: AdminJob["workplace"];
  summary: string;
  about: string;
  responsibilities: string;
  requirements: string;
  nice_to_have: string;
  offer: string;
  status: JobStatus;
  display_order: number;
};

const EMPTY: Form = {
  title: "",
  slug: "",
  employment_type: "Full-time",
  location: "Mombasa, Kenya",
  workplace: "Hybrid",
  summary: "",
  about: "",
  responsibilities: "",
  requirements: "",
  nice_to_have: "",
  offer: "",
  status: "draft",
  display_order: 0,
};



const STATUS_STYLE: Record<JobStatus, string> = {
  open: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  closed: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

const lines = (text: string) => text.split("\n").map((l) => l.replace(/^\s*[-*•]\s*/, "").trim()).filter(Boolean);

function toForm(job: AdminJob): Form {
  return {
    title: job.title,
    slug: job.slug,
    employment_type: job.employment_type,
    location: job.location,
    workplace: job.workplace,
    summary: job.summary,
    about: job.about,
    responsibilities: job.responsibilities.join("\n"),
    requirements: job.requirements.join("\n"),
    nice_to_have: job.nice_to_have.join("\n"),
    offer: job.offer.join("\n"),
    status: job.status,
    display_order: job.display_order,
  };
}

function toPayload(f: Form) {
  return {
    title: f.title.trim(),
    slug: f.slug.trim(),
    employment_type: f.employment_type,
    location: f.location.trim(),
    workplace: f.workplace,
    summary: f.summary.trim(),
    about: f.about.trim(),
    responsibilities: lines(f.responsibilities),
    requirements: lines(f.requirements),
    nice_to_have: lines(f.nice_to_have),
    offer: lines(f.offer),
    status: f.status,
    display_order: Number(f.display_order) || 0,
  };
}

function payloadFromJob(job: AdminJob, status: JobStatus) {
  return { ...toPayload(toForm(job)), status };
}

export default function JobsTab({ onChanged }: { onChanged?: () => void }) {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminJob | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () =>
    adminFetch<AdminJob[]>("/data/jobs")
      .then((data) => {
        setJobs(data);
        setListError("");
      })
      .catch((err) => setListError(errorMessage(err, "Failed to load job openings.")))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setSlugTouched(false);
    setFormError("");
    setOpen(true);
  };

  const openEdit = (job: AdminJob) => {
    setEditing(job);
    setForm(toForm(job));
    setSlugTouched(true);
    setFormError("");
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const payload = toPayload(form);
    if (payload.status === "open" && (payload.responsibilities.length === 0 || payload.requirements.length === 0)) {
      setFormError("Add at least one responsibility and one requirement before opening the role.");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await adminFetch(`/data/jobs/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/data/jobs", { method: "POST", body: JSON.stringify(payload) });
      }
      setOpen(false);
      await load();
      onChanged?.();
    } catch (err) {
      setFormError(errorMessage(err, "Could not save the role."));
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (job: AdminJob, status: JobStatus) => {
    try {
      await adminFetch(`/data/jobs/${job.id}`, { method: "PATCH", body: JSON.stringify(payloadFromJob(job, status)) });
      await load();
    } catch (err) {
      alert(errorMessage(err, "Could not update the role."));
    }
  };

  const remove = async (job: AdminJob) => {
    const note = job.application_count
      ? `\n\nIts ${job.application_count} application(s) will be kept under the Applications tab.`
      : "";
    if (!confirm(`Delete the "${job.title}" role? This cannot be undone.${note}`)) return;
    try {
      await adminFetch(`/data/jobs/${job.id}`, { method: "DELETE" });
      await load();
      onChanged?.();
    } catch (err) {
      alert(errorMessage(err, "Could not delete the role."));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Only <strong>open</strong> roles appear on the careers page and accept applications. Drafts are private;
          closed roles are hidden but keep their applications.
        </p>
        <button onClick={openNew} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shrink-0">
          <Plus className="w-4 h-4" /> New role
        </button>
      </div>

      {listError && (
        <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-md">{listError}</div>
      )}

      <div className="bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm divide-y divide-gray-200 dark:divide-gray-800">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-700 dark:text-gray-300">No roles yet. Create your first job opening.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[job.status]}`}>{job.status}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{job.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {job.employment_type} · {job.location} · {job.workplace} · {job.application_count} application{job.application_count === 1 ? "" : "s"}
                  {job.posted_at && ` · posted ${new Date(job.posted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {job.status === "open" ? (
                  <>
                    <a href={`${SITE_URL}/careers/${job.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="View on website" title="View on website">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => setStatus(job, "closed")} className="p-2 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Close role" title="Close role (stop accepting applications)">
                      <Lock className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setStatus(job, "open")} className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Open role" title="Open role (publish on the website)">
                    <Unlock className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => openEdit(job)} className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Edit" title="Edit">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => remove(job)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label="Delete" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={(o) => !saving && setOpen(o)}>
        <DialogContent className="sm:max-w-3xl bg-white dark:bg-[#1E1E2F] rounded-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900 dark:text-white">{editing ? "Edit role" : "New role"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={save} className="space-y-5">
            {formError && (
              <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-md">{formError}</div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="j-title">Job title</Label>
                <Input
                  id="j-title"
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!slugTouched) set("slug", slugify(e.target.value));
                  }}
                  className="mt-1.5"
                  placeholder="e.g. Backend Engineer"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="j-slug">URL slug</Label>
                <Input id="j-slug" required maxLength={120} value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} className="mt-1.5 font-mono text-sm" />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">danamotech.co.ke/careers/{form.slug || "…"}</p>
              </div>
              <div>
                <Label htmlFor="j-type">Employment type</Label>
                <select id="j-type" value={form.employment_type} onChange={(e) => set("employment_type", e.target.value as Form["employment_type"])} className={`${fieldClass} h-10`}>
                  {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="j-workplace">Workplace</Label>
                <select id="j-workplace" value={form.workplace} onChange={(e) => set("workplace", e.target.value as Form["workplace"])} className={`${fieldClass} h-10`}>
                  {["Remote", "Hybrid", "On-site"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="j-location">Location</Label>
                <Input id="j-location" required maxLength={120} value={form.location} onChange={(e) => set("location", e.target.value)} className="mt-1.5" placeholder="Mombasa, Kenya" />
              </div>
              <div>
                <Label htmlFor="j-status">Status</Label>
                <select id="j-status" value={form.status} onChange={(e) => set("status", e.target.value as JobStatus)} className={`${fieldClass} h-10`}>
                  <option value="draft">Draft (private)</option>
                  <option value="open">Open (on website, accepting applications)</option>
                  <option value="closed">Closed (hidden, keeps applications)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="j-summary">Card summary <span className="font-normal text-gray-500">({form.summary.length}/300, shown on the careers page)</span></Label>
                <textarea id="j-summary" required maxLength={300} rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} className={fieldClass} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="j-about">About the role <span className="font-normal text-gray-500">(leave a blank line between paragraphs)</span></Label>
                <textarea id="j-about" required maxLength={10000} rows={5} value={form.about} onChange={(e) => set("about", e.target.value)} className={fieldClass} />
              </div>
              {([
                ["responsibilities", "What you'll do (responsibilities)"],
                ["requirements", "What we're looking for (requirements)"],
                ["nice_to_have", "Nice to have (optional)"],
                ["offer", "What we offer (optional)"],
              ] as const).map(([key, label]) => (
                <div key={key} className="sm:col-span-2">
                  <Label htmlFor={`j-${key}`}>{label} <span className="font-normal text-gray-500">(one per line)</span></Label>
                  <textarea id={`j-${key}`} rows={5} value={form[key]} onChange={(e) => set(key, e.target.value)} className={fieldClass} />
                </div>
              ))}
              <div>
                <Label htmlFor="j-order">Display order <span className="font-normal text-gray-500">(lower shows first)</span></Label>
                <Input id="j-order" type="number" min={0} max={10000} value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value))} className="mt-1.5" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} disabled={saving} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editing ? "Save changes" : "Create role"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
