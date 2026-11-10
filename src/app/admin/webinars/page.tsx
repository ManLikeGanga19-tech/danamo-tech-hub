"use client";

import { useEffect, useState, useRef } from "react";
import { adminFetch } from "@/lib/admin/client";
import { Loader2, Plus, Trash2, Calendar, Link as LinkIcon, Upload, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  host: string;
  image_url: string;
  status: "upcoming" | "past";
  join_url?: string | null;
  replay_url?: string | null;
}

export default function AdminWebinars() {
  const [activeTab, setActiveTab] = useState<"events" | "registrations">("events");
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", date: "", time: "", host: "",
    join_url: "", replay_url: "", status: "upcoming",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchWebinars = () => {
    setLoading(true);
    adminFetch<Webinar[]>("/data/webinars")
      .then(setWebinars)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWebinars(); }, []);

  const openCreateModal = () => {
    setFormData({
      title: "", description: "", date: "", time: "", host: "",
      join_url: "", replay_url: "", status: "upcoming",
    });
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, or WebP)");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5 MB");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please upload a cover image");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload image
      const fd = new FormData();
      fd.append("file", imageFile);
      const { url } = await adminFetch<{ url: string }>("/data/webinars/upload-image", {
        method: "POST",
        body: fd,
      });

      // 2. Create webinar with the returned URL
      await adminFetch("/data/webinars", {
        method: "POST",
        body: JSON.stringify({ ...formData, image_url: url }),
      });

      setIsModalOpen(false);
      fetchWebinars();
    } catch (err) {
      alert("Failed to create webinar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webinar?")) return;
    try {
      await adminFetch(`/data/webinars/${id}`, { method: "DELETE" });
      fetchWebinars();
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Webinars</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your live events and registrations.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex">
            <button onClick={() => setActiveTab("events")} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "events" ? "bg-white dark:bg-[#1E1E2F] shadow text-blue-600" : "text-gray-500"}`}>Events</button>
            <button onClick={() => setActiveTab("registrations")} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "registrations" ? "bg-white dark:bg-[#1E1E2F] shadow text-blue-600" : "text-gray-500"}`}>Attendees</button>
          </div>
          <Button onClick={openCreateModal} className="bg-blue-600 text-white rounded-lg">
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : activeTab === "events" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800">
              <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No webinars yet. Click <strong>Add Event</strong> to create one.</p>
            </div>
          ) : (
            webinars.map((w) => (
              <div key={w.id} className="bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                {w.image_url && (
                  <div className="w-full h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={w.image_url} alt={w.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <span className={`inline-block px-2 py-1 text-xs font-bold rounded-md mb-3 ${w.status === 'upcoming' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>{w.status.toUpperCase()}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{w.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{w.date} &middot; {w.time}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" /> {w.host}
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> {w.join_url || w.replay_url ? "Link attached" : "No link"}
                  </span>
                  <button onClick={() => handleDelete(w.id)} className="text-red-500 hover:text-red-700 p-1" aria-label="Delete webinar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500">The attendees table will render here next.</p>
        </div>
      )}

      {/* CREATE MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-[#1E1E2F] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create New Webinar</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div>
              <Label>Title</Label>
              <Input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <Label>Description</Label>
              <Input required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date (e.g. June 15, 2025)</Label>
                <Input required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <Label>Time (e.g. 3:00 PM GMT)</Label>
                <Input required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <div>
              <Label>Host Name</Label>
              <Input required value={formData.host} onChange={e => setFormData({ ...formData, host: e.target.value })} className="rounded-xl" />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <Label>Cover Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors overflow-hidden"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Click to change
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload image</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG or WebP &middot; Max 5 MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <Label>Status</Label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full mt-1.5 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm">
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
              <div>
                <Label>Join URL (Live)</Label>
                <Input value={formData.join_url} onChange={e => setFormData({ ...formData, join_url: e.target.value })} className="rounded-xl" placeholder="https://zoom.us/..." />
              </div>
            </div>

            {formData.status === "past" && (
              <div>
                <Label>Replay URL (YouTube/Vimeo)</Label>
                <Input value={formData.replay_url} onChange={e => setFormData({ ...formData, replay_url: e.target.value })} className="rounded-xl" placeholder="https://youtube.com/watch?v=..." />
              </div>
            )}

            <Button asChild className="w-full bg-blue-600 text-white rounded-xl py-6 mt-4">
              <button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Webinar"}
              </button>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}