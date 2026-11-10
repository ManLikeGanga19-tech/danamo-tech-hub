"use client";

import { useEffect, useState, useRef } from "react";
import { adminFetch } from "@/lib/admin/client";
import { Loader2, Plus, Trash2, Edit3, FolderKanban, Upload, Image as ImageIcon, X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    content: string;
    client_name: string | null;
    client_industry: string | null;
    image_url: string;
    gallery: string[];
    technologies: string[];
    live_url: string | null;
    featured: boolean;
    status: string;
}

const emptyForm = {
    title: "", slug: "", category: "", description: "", content: "",
    client_name: "", client_industry: "",
    live_url: "", featured: false, status: "draft",
};

const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [formData, setFormData] = useState(emptyForm);
    const [techInput, setTechInput] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [gallery, setGallery] = useState<string[]>([]);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const fetchProjects = async (showSpinner = false) => {
        if (showSpinner) setLoading(true);
        try {
            const data = await adminFetch<Project[]>("/data/projects");
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(true); }, []);

    const openCreateModal = () => {
        setEditingProject(null);
        setFormData(emptyForm);
        setTechInput("");
        setImageFile(null);
        setImagePreview("");
        setGallery([]);
        setSlugManuallyEdited(false);
        setIsModalOpen(true);
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            slug: project.slug,
            category: project.category,
            description: project.description,
            content: project.content,
            client_name: project.client_name || "",
            client_industry: project.client_industry || "",
            live_url: project.live_url || "",
            featured: project.featured,
            status: project.status,
        });
        setTechInput((project.technologies || []).join(", "));
        setImageFile(null);
        setImagePreview(project.image_url);
        setGallery(project.gallery || []);
        setSlugManuallyEdited(true);
        setIsModalOpen(true);
    };

    const handleTitleChange = (val: string) => {
        setFormData((prev) => ({
            ...prev,
            title: val,
            slug: slugManuallyEdited ? prev.slug : generateSlug(val),
        }));
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { alert("Please select an image"); return; }
        if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB"); return; }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setUploadingGallery(true);
        try {
            const uploaded: string[] = [];
            for (const file of files) {
                if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) continue;
                const fd = new FormData();
                fd.append("file", file);
                const res = await adminFetch<{ url: string }>("/data/projects/upload-image", {
                    method: "POST",
                    body: fd,
                });
                uploaded.push(res.url);
            }
            setGallery((prev) => [...prev, ...uploaded]);
        } catch {
            alert("Failed to upload gallery images");
        } finally {
            setUploadingGallery(false);
            e.target.value = "";
        }
    };

    const removeGalleryImage = (url: string) => {
        setGallery((prev) => prev.filter((g) => g !== url));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.slug || !formData.category || !formData.description || !formData.content) {
            alert("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Upload cover image if a new one was picked
            let finalImageUrl = imagePreview;
            if (imageFile) {
                const fd = new FormData();
                fd.append("file", imageFile);
                const res = await adminFetch<{ url: string }>("/data/projects/upload-image", {
                    method: "POST",
                    body: fd,
                });
                finalImageUrl = res.url;
            }

            if (!finalImageUrl) {
                alert("Please upload a cover image");
                setSubmitting(false);
                return;
            }

            const payload = {
                ...formData,
                image_url: finalImageUrl,
                gallery,
                technologies: techInput.split(",").map((t) => t.trim()).filter(Boolean),
            };

            if (editingProject) {
                await adminFetch(`/data/projects/${editingProject.id}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
            } else {
                await adminFetch("/data/projects", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }

            setIsModalOpen(false);
            fetchProjects(true);
        } catch (err: any) {
            const msg = err?.message?.replace(/^API \d+: /, "") || "Failed to save project";
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        try {
            await adminFetch(`/data/projects/${id}`, { method: "DELETE" });
            fetchProjects();
        } catch {
            alert("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your portfolio of case studies.
                    </p>
                </div>
                <Button onClick={openCreateModal} className="bg-blue-600 text-white rounded-lg">
                    <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center h-64 items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : projects.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800">
                    <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No projects yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        Click <strong>Add Project</strong> to publish your first case study.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => (
                        <div key={p.id} className="bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="relative w-full h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />}
                                <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-md ${p.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"}`}>
                                    {p.status.toUpperCase()}
                                </span>
                                {p.featured && (
                                    <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-md bg-blue-600 text-white">
                                        FEATURED
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                                    {p.category}
                                </p>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">{p.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{p.description}</p>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEditModal(p)} className="text-gray-500 hover:text-blue-600 p-1" aria-label="Edit">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        {p.status === "published" && (
                                            <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 p-1" aria-label="View live">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                    <button onClick={() => handleDelete(p.id, p.title)} className="text-red-500 hover:text-red-700 p-1" aria-label="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CREATE / EDIT MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#1E1E2F] rounded-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Title *</Label>
                                <Input required value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} className="rounded-xl" />
                            </div>
                            <div>
                                <Label>Slug *</Label>
                                <Input required value={formData.slug} onChange={(e) => { setFormData((p) => ({ ...p, slug: e.target.value })); setSlugManuallyEdited(true); }} className="rounded-xl" />
                            </div>
                        </div>

                        <div>
                            <Label>Category *</Label>
                            <Input required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="rounded-xl" placeholder="e.g. Web Development, SaaS, E-Commerce" />
                        </div>

                        <div>
                            <Label>Short Description * (max 500)</Label>
                            <textarea required rows={2} maxLength={500} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full mt-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm resize-none" />
                        </div>

                        <div>
                            <Label>Full Content * (HTML supported)</Label>
                            <textarea required rows={6} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full mt-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm resize-none font-mono text-xs" placeholder="<p>Your case study...</p>" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Client Name</Label>
                                <Input value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} className="rounded-xl" />
                            </div>
                            <div>
                                <Label>Client Industry</Label>
                                <Input value={formData.client_industry} onChange={(e) => setFormData({ ...formData, client_industry: e.target.value })} className="rounded-xl" />
                            </div>
                        </div>

                        <div>
                            <Label>Technologies (comma-separated)</Label>
                            <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} className="rounded-xl" placeholder="React, Next.js, Tailwind, PostgreSQL" />
                        </div>

                        <div>
                            <Label>Live URL</Label>
                            <Input value={formData.live_url} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} className="rounded-xl" placeholder="https://example.com" />
                        </div>

                        {/* COVER IMAGE */}
                        <div>
                            <Label>Cover Image *</Label>
                            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                            <div onClick={() => coverInputRef.current?.click()} className="mt-2 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <p className="text-white text-sm font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Click to change</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload cover image</p>
                                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or WebP &middot; Max 5 MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* GALLERY */}
                        <div>
                            <Label>Gallery Images</Label>
                            <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                            <Button asChild variant="outline" className="mt-2 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => galleryInputRef.current?.click()}
                                    disabled={uploadingGallery}
                                >
                                    {uploadingGallery ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                                    Add Gallery Images
                                </button>
                            </Button>
                            {gallery.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-3">
                                    {gallery.map((url) => (
                                        <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <img src={url} alt="Gallery" className="w-full h-20 object-cover" />
                                            <button type="button" onClick={() => removeGalleryImage(url)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div>
                                <Label>Status</Label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full mt-1.5 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm">
                                    <option value="draft">Draft (hidden from public)</option>
                                    <option value="published">Published (visible to public)</option>
                                </select>
                            </div>
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured (top of grid)</span>
                                </label>
                            </div>
                        </div>

                        <Button asChild className="w-full bg-blue-600 text-white rounded-xl py-6 mt-4">
                            <button type="submit" disabled={submitting}>
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingProject ? "Save Changes" : "Publish Project"}
                            </button>
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}