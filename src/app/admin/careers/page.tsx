"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/client";
import { Loader2, Briefcase, Download, AlertCircle, FileText } from "lucide-react";

interface Application {
  id: string;
  full_name: string;
  email: string;
  role_slug: string;
  created_at: string;
  cv_file_id: string | null;
}

export default function CareerApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<Application[]>("/data/applications")
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load applications. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleDownloadCv = async (cvId: string, applicantName: string) => {
    if (!cvId) return;
    setDownloadingId(cvId);

    try {
      // Fetch the file securely through the Next.js proxy
      const res = await fetch(`/api/proxy/admin/data/cv/${cvId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Download failed");

      // Convert to blob and trigger download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Create a clean filename based on the applicant's name
      a.download = `${applicantName.replace(/\s+/g, "_")}_CV.pdf`;
      
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Could not download the CV. It may have been removed from the server.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Career Applications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review candidates and download their CVs securely.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-md flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No applications yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              When candidates apply for open roles, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Applicant</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase text-right">Resume / CV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {new Date(app.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{app.full_name}</div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <Briefcase className="w-3 h-3" />
                        {app.role_slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.cv_file_id ? (
                        <button
                          onClick={() => handleDownloadCv(app.cv_file_id!, app.full_name)}
                          disabled={downloadingId === app.cv_file_id}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                        >
                          {downloadingId === app.cv_file_id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          Download CV
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 italic">
                          <FileText className="w-4 h-4" />
                          No CV attached
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}