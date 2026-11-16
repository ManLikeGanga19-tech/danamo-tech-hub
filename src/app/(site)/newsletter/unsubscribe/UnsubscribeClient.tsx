"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MailX } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { errorMessage } from "@/lib/errors";

type State =
  | { kind: "loading" }
  | { kind: "invalid" }
  | { kind: "ready"; email: string }
  | { kind: "already"; email: string }
  | { kind: "done"; email: string };

/**
 * Opening the link never unsubscribes on its own (email scanners open links);
 * the person confirms with the button. Email clients can also unsubscribe in
 * one click through the List-Unsubscribe header, which calls the API directly.
 */
export default function UnsubscribeClient() {
  const [token, setToken] = useState("");
  const [state, setState] = useState<State>({ kind: "loading" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token") ?? "";
    apiFetch<{ email: string; subscribed: boolean }>(`/newsletter/unsubscribe?token=${encodeURIComponent(t)}`)
      .then((res) => {
        setToken(t);
        setState(res.subscribed ? { kind: "ready", email: res.email } : { kind: "already", email: res.email });
      })
      .catch(() => setState({ kind: "invalid" }));
  }, []);

  const confirm = async () => {
    if (state.kind !== "ready") return;
    setBusy(true);
    setError("");
    try {
      await apiFetch(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, { method: "POST" });
      setState({ kind: "done", email: state.email });
    } catch (err) {
      setError(errorMessage(err, "We couldn't unsubscribe you. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const card = "w-full max-w-md text-center p-10 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm";

  if (state.kind === "loading") {
    return (
      <div className={card} role="status">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" aria-hidden="true" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (state.kind === "invalid") {
    return (
      <div className={card}>
        <MailX className="w-12 h-12 text-gray-500 mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">This link isn&apos;t valid</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Use the unsubscribe link from your most recent email, or email{" "}
          <a href="mailto:hello@danamotech.co.ke?subject=Unsubscribe" className="text-blue-700 dark:text-blue-300 underline">hello@danamotech.co.ke</a>{" "}
          and we&apos;ll remove you.
        </p>
      </div>
    );
  }

  if (state.kind === "done" || state.kind === "already") {
    return (
      <div className={card} role="status">
        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You&apos;re unsubscribed</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          <strong>{state.email}</strong> will no longer receive Danamo Tech newsletter emails.
        </p>
        <Link href="/" className="text-blue-700 dark:text-blue-300 font-semibold hover:underline">Back to the website</Link>
      </div>
    );
  }

  return (
    <div className={card}>
      <MailX className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unsubscribe from our newsletter?</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        <strong>{state.email}</strong> will stop receiving updates about new articles, webinars, case studies and open roles.
      </p>
      {error && <p className="text-sm text-red-700 dark:text-red-400 mb-4" role="alert">{error}</p>}
      <button
        onClick={confirm}
        disabled={busy}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 transition-colors"
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />} Unsubscribe
      </button>
      <Link href="/" className="inline-block mt-4 text-sm text-gray-700 dark:text-gray-300 hover:underline">Keep me subscribed</Link>
    </div>
  );
}
