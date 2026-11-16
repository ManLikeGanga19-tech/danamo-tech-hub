"use client";

import { useEffect, useRef, useState } from "react";
import { Edit3, Eye, EyeOff, FileText, ImageIcon, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFetch } from "@/lib/admin/client";
import MarkdownContent from "@/components/markdown/MarkdownContent";
import { errorMessage } from "@/lib/errors";
import type { BlogPost } from "@/lib/blog";

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  author_name: string;
  cover_image_url: string;
  status: "draft" | "published";
};

const EMPTY: Form = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: "",
  author_name: "Daniel Oganga",
  cover_image_url: "",
  status: "draft",
};

const MARKDOWN_HELP = "## Heading   **bold**   *italic*   [link](https://...)   - list item   > quote   ![image](https://...)";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function toPayload(f: Form) {
  return {
    title: f.title.trim(),
    slug: f.slug.trim(),
    excerpt: f.excerpt.trim(),
    content: f.content,
    tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
    author_name: f.author_name.trim() || "Daniel Oganga",
    cover_image_url: f.cover_image_url || null,
    status: f.status,
  };
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPosts = () =>
    adminFetch<BlogPost[]>("/data/blog")
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { fetchPosts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setSlugTouched(false);
    setTab("write");
    setError("");
    setOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags.join(", "),
      author_name: p.author_name,
      cover_image_url: p.cover_image_url ?? "",
      status: p.status,
    });
    setSlugTouched(true);
    setTab("write");
    setError("");
    setOpen(true);
  };

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onTitle = (title: string) =>
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));

  const uploadCover = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const { url } = await adminFetch<{ url: string }>("/data/blog/upload-image", { method: "POST", body });
      set("cover_image_url", url);
    } catch (err) {
      setError(errorMessage(err, "Image upload failed"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = toPayload(form);
      if (editing) {
        await adminFetch(`/data/blog/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/data/blog", { method: "POST", body: JSON.stringify(payload) });
      }
      setOpen(false);
      fetchPosts();
    } catch (err) {
      setError(errorMessage(err, "Failed to save the article"));
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (p: BlogPost) => {
    try {
      await adminFetch(`/data/blog/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...toPayload({ ...p, tags: p.tags.join(", "), cover_image_url: p.cover_image_url ?? "" }), status: p.status === "published" ? "draft" : "published" }),
      });
      fetchPosts();
    } catch (err) {
      alert(errorMessage(err, "Failed to update"));
    }
  };

  const remove = async (p: BlogPost) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await adminFetch(`/data/blog/${p.id}`, { method: "DELETE" });
      fetchPosts();
    } catch (err) {
      alert(errorMessage(err, "Failed to delete"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Write articles for the website. Drafts are only visible here; published articles appear on the blog within a minute.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> New article
        </button>
      </div>

      <div className="bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No articles yet</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Click &quot;New article&quot; to write your first post.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center">
                  {p.cover_image_url ? (
                    <img src={p.cover_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${p.status === "published" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"}`}>
                      {p.status.toUpperCase()}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{p.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">/blog/{p.slug} · {p.read_minutes} min read · {p.tags.join(", ") || "no tags"}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => togglePublish(p)} className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label={p.status === "published" ? "Unpublish" : "Publish"} title={p.status === "published" ? "Unpublish" : "Publish"}>
                    {p.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Edit" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(p)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label="Delete" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl bg-white dark:bg-[#1E1E2F] rounded-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900 dark:text-white">{editing ? "Edit article" : "New article"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={save} className="space-y-5">
            {error && (
              <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-md">
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="b-title">Title</Label>
                <Input id="b-title" value={form.title} onChange={(e) => onTitle(e.target.value)} required maxLength={200} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="b-slug">URL slug</Label>
                <Input id="b-slug" value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} required maxLength={200} className="mt-1.5 font-mono text-sm" />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">danamotech.co.ke/blog/{form.slug || "…"}</p>
              </div>
              <div>
                <Label htmlFor="b-tags">Tags (comma separated)</Label>
                <Input id="b-tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Web Development, SaaS" className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="b-excerpt">Summary <span className="font-normal text-gray-500">({form.excerpt.length}/500, shown on cards and when shared)</span></Label>
                <textarea id="b-excerpt" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} required maxLength={500} rows={2}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <Label htmlFor="b-author">Author</Label>
                <Input id="b-author" value={form.author_name} onChange={(e) => set("author_name", e.target.value)} maxLength={120} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="b-status">Status</Label>
                <select id="b-status" value={form.status} onChange={(e) => set("status", e.target.value as Form["status"])}
                  className="w-full mt-1.5 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-white">
                  <option value="draft">Draft (hidden from public)</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Cover image</Label>
              <div className="mt-1.5 flex items-center gap-4">
                <div className="w-40 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  {form.cover_image_url ? <img src={form.cover_image_url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex flex-col gap-2">
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])} />
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} {form.cover_image_url ? "Replace image" : "Upload image"}
                  </button>
                  {form.cover_image_url && (
                    <button type="button" onClick={() => set("cover_image_url", "")} className="text-xs text-red-600 text-left hover:underline">Remove image</button>
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-400">JPG, PNG or WebP, max 5 MB. Wide images (16:9) look best.</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="b-content">Article</Label>
                <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 text-sm" role="tablist">
                  {(["write", "preview"] as const).map((t) => (
                    <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                      className={`px-3 py-1 rounded-md capitalize ${tab === t ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {tab === "write" ? (
                <>
                  <textarea id="b-content" value={form.content} onChange={(e) => set("content", e.target.value)} required rows={16}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 font-mono text-sm leading-relaxed text-gray-900 dark:text-white" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Markdown: <code>{MARKDOWN_HELP}</code></p>
                </>
              ) : (
                <div className="mt-1.5 min-h-[20rem] rounded-xl border border-gray-200 dark:border-gray-700 p-5 prose dark:prose-invert prose-blue max-w-none prose-code:before:content-none prose-code:after:content-none prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-gray-100 dark:prose-code:bg-gray-800">
                  {form.content.trim() ? <MarkdownContent>{form.content}</MarkdownContent> : <p className="text-gray-500">Nothing to preview yet.</p>}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editing ? "Save changes" : form.status === "published" ? "Publish" : "Save draft"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
