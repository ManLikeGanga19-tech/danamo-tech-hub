"use client";

import { useEffect, useState, useRef } from "react";
import { adminFetch } from "@/lib/admin/client";
import { Loader2, Plus, Trash2, Edit3, Upload, Handshake, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
}

const emptyForm = {
  name: "",
  website_url: "",
  display_order: 0,
  is_active: true,
};

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const [formData, setFormData] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const fetchPartners = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await adminFetch<Partner[]>("/data/partners");
      setPartners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(true); }, []);

  const openCreateModal = () => {
    setEditingPartner(null);
    setFormData({ ...emptyForm, display_order: partners.length });
    setLogoFile(null);
    setLogoPreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      website_url: partner.website_url || "",
      display_order: partner.display_order,
      is_active: partner.is_active,
    });
    setLogoFile(null);
    setLogoPreview(partner.logo_url);
    setIsModalOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Logo must be under 5 MB"); return; }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { alert("Partner name is required"); return; }

    setSubmitting(true);
    try {
      // 1. Upload logo if a new one was picked
      let finalLogoUrl = logoPreview;
      if (logoFile) {
        const fd = new FormData();
        fd.append("file", logoFile);
        const res = await adminFetch<{ url: string }>("/data/partners/upload-logo", {
          method: "POST",
          body: fd,
        });
        finalLogoUrl = res.url;
      }

      if (!finalLogoUrl) {
        alert("Please upload a logo");
        setSubmitting(false);
        return;
      }

      const payload = {
        name: formData.name,
        logo_url: finalLogoUrl,
        website_url: formData.website_url || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      if (editingPartner) {
        await adminFetch(`/data/partners/${editingPartner.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/data/partners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      fetchPartners(true);
    } catch (err: any) {
      alert(err?.message?.replace(/^API \d+: /, "") || "Failed to save partner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from partners?`)) return;
    try {
      await adminFetch(`/data/partners/${id}`, { method: "DELETE" });
      fetchPartners();
    } catch {
      alert("Failed to delete");
    }
  };

  const toggleActive = async (partner: Partner) => {
    try {
      await adminFetch(`/data/partners/${partner.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: partner.name,
          logo_url: partner.logo_url,
          website_url: partner.website_url,
          display_order: partner.display_order,
          is_active: !partner.is_active,
        }),
      });
      fetchPartners();
    } catch {
      alert("Failed to toggle");
    }
  };

  const moveOrder = async (partner: Partner, direction: -1 | 1) => {
    const newOrder = Math.max(0, partner.display_order + direction);
    try {
      await adminFetch(`/data/partners/${partner.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: partner.name,
          logo_url: partner.logo_url,
          website_url: partner.website_url,
          display_order: newOrder,
          is_active: partner.is_active,
        }),
      });
      fetchPartners();
    } catch {
      alert("Failed to reorder");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partners</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage the logos that appear on the homepage slider.
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-blue-600 text-white rounded-lg">
          <Plus className="w-4 h-4 mr-2" /> Add Partner
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : partners.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800">
          <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No partners yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Add your first partner to show them on the homepage.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-20">Order</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Logo</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Website</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {partners.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveOrder(p, -1)}
                        disabled={i === 0}
                        className="text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveOrder(p, 1)}
                        disabled={i === partners.length - 1}
                        className="text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20 h-14 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-center p-2">
                      <img src={p.logo_url} alt={p.name} className="max-w-full max-h-full object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {p.website_url ? (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 truncate block max-w-xs">
                        {p.website_url}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${p.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                    >
                      {p.is_active ? <><Eye className="w-3 h-3" /> Active</> : <><EyeOff className="w-3 h-3" /> Hidden</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEditModal(p)} className="text-gray-500 hover:text-blue-600 p-1" aria-label="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:text-red-700 p-1" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-[#1E1E2F] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label>Partner Name *</Label>
              <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl" placeholder="Acme Corp" />
            </div>

            <div>
              <Label>Website URL (optional)</Label>
              <Input value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} className="rounded-xl" placeholder="https://acme.com" />
            </div>

            <div>
              <Label>Logo *</Label>
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              <div onClick={() => logoInputRef.current?.click()} className="mt-2 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {logoPreview ? (
                  <div className="relative p-6 flex items-center justify-center h-32">
                    <img src={logoPreview} alt="Preview" className="max-h-24 max-w-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white text-sm font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload logo</p>
                    <p className="text-xs text-gray-500 mt-1">PNG with transparent background recommended</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} className="rounded-xl" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show on site</span>
                </label>
              </div>
            </div>

            <Button asChild className="w-full bg-blue-600 text-white rounded-xl py-6 mt-4">
              <button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingPartner ? "Save Changes" : "Add Partner"}
              </button>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}