"use client";

import { useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin/client";
import {
  CalendarDays,
  Download,
  Edit3,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  Plus,
  Send,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessage } from "@/lib/errors";

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  starts_at: string | null;
  duration_minutes: number;
  host: string;
  image_url: string;
  status: "upcoming" | "past";
  join_url: string | null;
  replay_url: string | null;
  registration_count: number;
  replay_count: number;
  finished: boolean;
}

interface Registration {
  id: string;
  name: string;
  email: string;
  kind: "live" | "replay";
  join_link_sent_at: string | null;
  reminder_sent_at: string | null;
  created_at: string;
}

type Form = {
  title: string;
  description: string;
  starts_at: string; // datetime-local value, East Africa Time
  duration_minutes: number;
  host: string;
  image_url: string;
  join_url: string;
  replay_url: string;
  status: "upcoming" | "past";
};

const EMPTY: Form = {
  title: "",
  description: "",
  starts_at: "",
  duration_minutes: 60,
  host: "Daniel Oganga",
  image_url: "",
  join_url: "",
  replay_url: "",
  status: "upcoming",
};

const EAT_OFFSET_MS = 3 * 60 * 60 * 1000;

/** UTC ISO string -> "YYYY-MM-DDTHH:mm" in East Africa Time for <input type="datetime-local">. */
function toEatInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(new Date(iso).getTime() + EAT_OFFSET_MS).toISOString().slice(0, 16);
}

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white";

export default function AdminWebinars() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Webinar | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [attendeesFor, setAttendeesFor] = useState<Webinar | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  const load = () =>
    adminFetch<Webinar[]>("/data/webinars")
      .then((data) => {
        setWebinars(data);
        setListError("");
      })
      .catch((err) => setListError(errorMessage(err, "Failed to load webinars.")))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setEditorOpen(true);
  };

  const openEdit = (w: Webinar) => {
    setEditing(w);
    setForm({
      title: w.title,
      description: w.description,
      starts_at: toEatInput(w.starts_at),
      duration_minutes: w.duration_minutes,
      host: w.host,
      image_url: w.image_url,
      join_url: w.join_url ?? "",
      replay_url: w.replay_url ?? "",
      status: w.status,
    });
    setImageFile(null);
    setImagePreview(w.image_url);
    setFormError("");
    setEditorOpen(true);
  };

  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setFormError("Please choose a JPG, PNG or WebP image.");
    if (file.size > 5 * 1024 * 1024) return setFormError("The image must be under 5 MB.");
    setFormError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.starts_at) return setFormError("Please choose the start date and time.");
    if (!imageFile && !form.image_url) return setFormError("Please upload a cover image.");

    const linkChanged = editing && form.join_url.trim() && form.join_url.trim() !== (editing.join_url ?? "");
    if (linkChanged && editing.registration_count > 0 && !editing.finished) {
      const ok = confirm(
        `Saving will email the ${editing.join_url ? "new" : ""} join link to ${editing.registration_count} registered attendee(s). Continue?`,
      );
      if (!ok) return;
    }

    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        imageUrl = (await adminFetch<{ url: string }>("/data/webinars/upload-image", { method: "POST", body: fd })).url;
      }
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        starts_at: form.starts_at, // no zone: the API reads it as East Africa Time
        duration_minutes: Number(form.duration_minutes) || 60,
        host: form.host.trim(),
        image_url: imageUrl,
        join_url: form.join_url.trim() || null,
        replay_url: form.replay_url.trim() || null,
        status: form.status,
      };
      if (editing) {
        await adminFetch(`/data/webinars/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/data/webinars", { method: "POST", body: JSON.stringify(payload) });
      }
      setEditorOpen(false);
      await load();
    } catch (err) {
      setFormError(errorMessage(err, "Could not save the webinar."));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (w: Webinar) => {
    const extra = w.registration_count + w.replay_count ? ` Its ${w.registration_count + w.replay_count} registration(s) will also be deleted.` : "";
    if (!confirm(`Delete "${w.title}"?${extra} This cannot be undone.`)) return;
    try {
      await adminFetch(`/data/webinars/${w.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      alert(errorMessage(err, "Could not delete the webinar."));
    }
  };

  const sendLink = async (w: Webinar) => {
    if (!confirm(`Email the join link to all ${w.registration_count} registered attendee(s) of "${w.title}" now?`)) return;
    setSending(w.id);
    try {
      const res = await adminFetch<{ count: number }>(`/data/webinars/${w.id}/send-link`, { method: "POST" });
      alert(`Join link sent to ${res.count} attendee(s).`);
      if (attendeesFor?.id === w.id) openAttendees(w);
    } catch (err) {
      alert(errorMessage(err, "Could not send the join link."));
    } finally {
      setSending(null);
    }
  };

  const openAttendees = async (w: Webinar) => {
    setAttendeesFor(w);
    setRegLoading(true);
    try {
      setRegistrations(await adminFetch<Registration[]>(`/data/webinars/${w.id}/registrations`));
    } catch (err) {
      alert(errorMessage(err, "Could not load attendees."));
    } finally {
      setRegLoading(false);
    }
  };

  const removeRegistration = async (r: Registration) => {
    if (!confirm(`Remove ${r.email} from this webinar?`)) return;
    try {
      await adminFetch(`/data/webinars/registrations/${r.id}`, { method: "DELETE" });
      setRegistrations((list) => list.filter((x) => x.id !== r.id));
      load();
    } catch (err) {
      alert(errorMessage(err, "Could not remove the attendee."));
    }
  };

  const exportCsv = async (w: Webinar) => {
    const res = await fetch(`/api/proxy/admin/data/webinars/${w.id}/registrations.csv`, { credentials: "include" });
    if (!res.ok) return alert("Could not export attendees.");
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = `${w.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-attendees.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const live = registrations.filter((r) => r.kind === "live");
  const replay = registrations.filter((r) => r.kind === "replay");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Webinars</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Attendees get the join link by email when you add it, and a reminder 24 hours before the start.
          </p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add webinar
        </button>
      </div>

      {listError && (
        <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-md">{listError}</div>
      )}

      {loading ? (
        <div className="flex justify-center h-64 items-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : webinars.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No webinars yet. Click <strong>Add webinar</strong> to create one.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.map((w) => (
            <div key={w.id} className="flex flex-col bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              {w.image_url && (
                <div className="w-full h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={w.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex-1">
                <span className={`inline-block px-2 py-1 text-xs font-bold rounded-md mb-3 ${w.finished ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}`}>
                  {w.finished ? "PAST" : "UPCOMING"}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{w.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> {w.starts_at ? `${w.date} · ${w.time}` : <span className="text-amber-600">No start time set — edit to add one</span>}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {w.registration_count} registered</span>
                  {w.replay_count > 0 && <span>{w.replay_count} replay view(s)</span>}
                  <span className="inline-flex items-center gap-1"><LinkIcon className="w-3 h-3" /> {w.finished ? (w.replay_url ? "Replay link set" : "No replay link") : w.join_url ? "Join link set" : "No join link yet"}</span>
                </div>
              </div>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1">
                <button onClick={() => openAttendees(w)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Users className="w-4 h-4" /> Attendees
                </button>
                {!w.finished && w.join_url && w.registration_count > 0 && (
                  <button onClick={() => sendLink(w)} disabled={sending === w.id} className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-700" title="Email join link to attendees" aria-label="Email join link to attendees">
                    {sending === w.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                )}
                <span className="flex-1" />
                <button onClick={() => openEdit(w)} className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-700" title="Edit" aria-label="Edit webinar">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => remove(w)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete" aria-label="Delete webinar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDITOR */}
      <Dialog open={editorOpen} onOpenChange={(o) => !saving && setEditorOpen(o)}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#1E1E2F] rounded-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900 dark:text-white">{editing ? "Edit webinar" : "New webinar"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            {formError && (
              <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-md">{formError}</div>
            )}
            <div>
              <Label htmlFor="w-title">Title</Label>
              <Input id="w-title" required maxLength={255} value={form.title} onChange={(e) => set("title", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="w-desc">Description</Label>
              <textarea id="w-desc" required maxLength={5000} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={fieldClass} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="w-start">Starts at (East Africa Time)</Label>
                <Input id="w-start" type="datetime-local" required value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="w-dur">Duration (minutes)</Label>
                <Input id="w-dur" type="number" min={15} max={600} step={15} value={form.duration_minutes} onChange={(e) => set("duration_minutes", Number(e.target.value))} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="w-host">Host</Label>
              <Input id="w-host" required maxLength={120} value={form.host} onChange={(e) => set("host", e.target.value)} className="mt-1.5" />
            </div>

            <div>
              <Label>Cover image</Label>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1.5 w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Cover preview" className="w-full h-40 object-cover" />
                ) : (
                  <span className="block p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload image</span>
                    <span className="block text-xs text-gray-500 mt-1">JPG, PNG or WebP · Max 5 MB</span>
                  </span>
                )}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <Label htmlFor="w-join">Join link (Zoom, Meet, Teams…)</Label>
                <Input id="w-join" type="url" value={form.join_url} onChange={(e) => set("join_url", e.target.value)} placeholder="https://meet.google.com/…" className="mt-1.5" />
                <p className="text-xs text-gray-500 mt-1">Private: only emailed to registered attendees.</p>
              </div>
              <div>
                <Label htmlFor="w-replay">Replay link (after the event)</Label>
                <Input id="w-replay" type="url" value={form.replay_url} onChange={(e) => set("replay_url", e.target.value)} placeholder="https://youtube.com/watch?v=…" className="mt-1.5" />
                <p className="text-xs text-gray-500 mt-1">Shown after a visitor enters their email.</p>
              </div>
              <div>
                <Label htmlFor="w-status">Status</Label>
                <select id="w-status" value={form.status} onChange={(e) => set("status", e.target.value as Form["status"])} className={`${fieldClass} h-10`}>
                  <option value="upcoming">Upcoming (becomes past automatically after it ends)</option>
                  <option value="past">Past (force now)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditorOpen(false)} disabled={saving} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">Cancel</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editing ? "Save changes" : "Create webinar"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ATTENDEES */}
      <Dialog open={!!attendeesFor} onOpenChange={(o) => !o && setAttendeesFor(null)}>
        <DialogContent className="sm:max-w-3xl bg-white dark:bg-[#1E1E2F] rounded-2xl max-h-[92vh] overflow-y-auto">
          {attendeesFor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-900 dark:text-white">{attendeesFor.title}</DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">{live.length} registered · {replay.length} replay view(s)</p>
              </DialogHeader>
              <div className="flex justify-end">
                <button onClick={() => exportCsv(attendeesFor)} disabled={!registrations.length} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
              {regLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
              ) : registrations.length === 0 ? (
                <p className="p-8 text-center text-gray-600 dark:text-gray-400">Nobody has registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500">
                        <th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Email</th><th className="py-2 pr-3">Type</th>
                        <th className="py-2 pr-3">Registered</th><th className="py-2 pr-3">Link sent</th><th className="py-2 pr-3">Reminder</th><th />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {registrations.map((r) => (
                        <tr key={r.id} className="text-gray-800 dark:text-gray-200">
                          <td className="py-2 pr-3">{r.name || "—"}</td>
                          <td className="py-2 pr-3"><a href={`mailto:${r.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{r.email}</a></td>
                          <td className="py-2 pr-3">{r.kind === "live" ? "Live" : "Replay"}</td>
                          <td className="py-2 pr-3 whitespace-nowrap">{fmt(r.created_at)}</td>
                          <td className="py-2 pr-3 whitespace-nowrap">{r.kind === "live" ? fmt(r.join_link_sent_at) : "—"}</td>
                          <td className="py-2 pr-3 whitespace-nowrap">{r.kind === "live" ? fmt(r.reminder_sent_at) : "—"}</td>
                          <td className="py-2 text-right">
                            <button onClick={() => removeRegistration(r)} className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label={`Remove ${r.email}`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
