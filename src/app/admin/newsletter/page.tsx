"use client";

import { useEffect, useState, useMemo } from "react";
import { adminFetch } from "@/lib/admin/client";
import { Loader2, Mail, Plus, Trash2, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Subscriber {
    id: string;
    email: string;
    confirmed: boolean;
    created_at: string;
    unsubscribed_at: string | null;
}

export default function AdminNewsletter() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const fetchSubscribers = async (showSpinner = false) => {
        if (showSpinner) setLoading(true);
        try {
            const data = await adminFetch<Subscriber[]>("/data/newsletter");
            setSubscribers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubscribers(true); }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return subscribers;
        const q = search.toLowerCase();
        return subscribers.filter((s) => s.email.toLowerCase().includes(q));
    }, [subscribers, search]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await adminFetch("/data/newsletter", {
                method: "POST",
                body: JSON.stringify({ email: newEmail }),
            });
            setNewEmail("");
            setIsModalOpen(false);
            fetchSubscribers();
        } catch (err: any) {
            setError(err?.message?.replace(/^API \d+: /, "") || "Failed to add subscriber");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Remove ${email} from the newsletter list?`)) return;
        try {
            await adminFetch(`/data/newsletter/${id}`, { method: "DELETE" });
            fetchSubscribers();
        } catch {
            alert("Failed to delete");
        }
    };

    const handleExport = () => {
        if (subscribers.length === 0) return;
        const headers = ["Email", "Confirmed", "Subscribed Date"];
        const rows = subscribers.map((s) => [
            `"${s.email.replace(/"/g, '""')}"`,
            s.confirmed ? "Yes" : "No",
            new Date(s.created_at).toISOString(),
        ]);
        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your email list. {subscribers.length} total subscribers.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" className="rounded-lg">
                        <button type="button" onClick={handleExport} disabled={subscribers.length === 0}>
                            <Download className="w-4 h-4 mr-2" /> Export CSV
                        </button>
                    </Button>
                    <Button asChild onClick={() => { setIsModalOpen(true); setError(""); setNewEmail(""); }} className="bg-blue-600 text-white rounded-lg">
                        <button type="button">
                            <Plus className="w-4 h-4 mr-2" /> Add Subscriber
                        </button>
                    </Button>
                </div>
            </div>

            {/* Search */}
            {subscribers.length > 0 && (
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search by email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 rounded-xl"
                    />
                </div>
            )}

            <div className="bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" /></div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                            {search ? "No matches found" : "No subscribers yet"}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {search ? `No emails match "${search}"` : "Subscribe to the newsletter on the public site to see them here."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Subscribed</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{s.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${s.confirmed ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}`}>
                                                {s.confirmed ? "Confirmed" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(s.id, s.email)} className="text-red-500 hover:text-red-700 p-1" aria-label="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ADD MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-[#1E1E2F] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Subscriber Manually</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4 mt-2">
                        <div>
                            <Label>Email Address</Label>
                            <Input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="rounded-xl h-12 mt-1.5" placeholder="user@example.com" />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <Button asChild className="w-full bg-blue-600 text-white rounded-xl py-6">
                            <button type="submit" disabled={submitting}>
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Subscriber"}
                            </button>
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}