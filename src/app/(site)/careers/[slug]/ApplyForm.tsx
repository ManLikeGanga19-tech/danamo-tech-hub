"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_EXTENSIONS = [".pdf", ".doc", ".docx"];
const CV_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MIN_COVER_LETTER = 50;
const MAX_COVER_LETTER = 5000;

const inputClass =
  "w-full rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12";

function errorMessage(err: unknown): string {
  let msg = "We couldn't submit your application. Please try again.";
  if (err instanceof Error) {
    const raw = err.message.replace(/^API \d+: /, "");
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.detail === "string") msg = parsed.detail;
      else if (Array.isArray(parsed?.detail) && parsed.detail[0]?.msg) msg = parsed.detail[0].msg;
    } catch {
      if (raw) msg = raw;
    }
  }
  return msg;
}

export default function ApplyForm({ roleTitle }: { roleTitle: string }) {
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!CV_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
      setCvError("Please upload a PDF, DOC or DOCX file.");
      setCv(null);
    } else if (file.size > MAX_CV_BYTES) {
      setCvError("Your CV must be smaller than 5 MB.");
      setCv(null);
    } else {
      setCvError("");
      setCv(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!cv) {
      setCvError("Please attach your CV.");
      return;
    }
    if (coverLetter.trim().length < MIN_COVER_LETTER) {
      setError(`Your cover letter should be at least ${MIN_COVER_LETTER} characters.`);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("full_name", name.trim());
      fd.append("email", email.trim());
      if (phone.trim()) fd.append("phone", phone.trim());
      fd.append("role_slug", roleTitle);
      fd.append("cover_letter", coverLetter.trim());
      fd.append("cv", cv);

      await apiFetch("/careers/apply", { method: "POST", body: fd });
      setSubmitted(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10" role="status">
        <CheckCircle2 className="w-14 h-14 text-green-600 dark:text-green-400 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application sent</h3>
        <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
          Thank you for applying for the {roleTitle} role. We&apos;ve emailed a confirmation to{" "}
          <strong>{email}</strong> and will get back to you after reviewing your application.
        </p>
        <Link href="/careers#openings" className="inline-block mt-6 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          See other open roles
        </Link>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-700 dark:text-gray-300">
        <Loader2 className="w-5 h-5 animate-spin mr-2" aria-hidden="true" /> Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">Please log in or create an account to apply for this role.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-8 py-3 transition-colors">
            Log in to apply
          </Link>
          <Link href="/signup" className="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold px-8 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-md" role="alert">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="apply-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full name *</label>
          <Input id="apply-name" autoComplete="name" required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} disabled={submitting} />
        </div>
        <div className="space-y-2">
          <label htmlFor="apply-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email address *</label>
          <Input id="apply-email" type="email" autoComplete="email" required maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} disabled={submitting} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="apply-phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone number (optional)</label>
        <Input id="apply-phone" type="tel" autoComplete="tel" maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" className={inputClass} disabled={submitting} />
      </div>

      <div className="space-y-2">
        <label htmlFor="apply-cover" className="text-sm font-medium text-gray-700 dark:text-gray-300">Cover letter *</label>
        <Textarea
          id="apply-cover"
          rows={8}
          required
          minLength={MIN_COVER_LETTER}
          maxLength={MAX_COVER_LETTER}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder={`Tell us why you're a great fit for the ${roleTitle} role, and about relevant work you've done.`}
          className="w-full rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
          disabled={submitting}
        />
        <p className="text-xs text-gray-600 dark:text-gray-300 text-right">
          {coverLetter.length} / {MAX_COVER_LETTER}
        </p>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CV / Resume * (PDF, DOC or DOCX, max 5 MB)</span>
        {cv ? (
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <span className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-sm text-gray-900 dark:text-white truncate">{cv.name}</span>
            </span>
            <button type="button" onClick={() => setCv(null)} disabled={submitting} aria-label="Remove CV" className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
            }}
            disabled={submitting}
            className="flex flex-col items-center justify-center gap-2 w-full p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Click to upload or drag your CV here</span>
            <span className="text-xs text-gray-600 dark:text-gray-300">PDF, DOC or DOCX up to 5 MB</span>
          </button>
        )}
        <input ref={fileInputRef} type="file" accept={CV_ACCEPT} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        {cvError && <p className="text-red-600 dark:text-red-400 text-sm" role="alert">{cvError}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-4 shadow-lg shadow-blue-600/20 transition-colors"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" aria-hidden="true" /> Submitting…
          </>
        ) : (
          "Submit Application"
        )}
      </button>
      <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
        By applying you agree to our <Link href="/privacy" className="underline">Privacy Policy</Link>. We only use your CV to assess your application.
      </p>
    </form>
  );
}
