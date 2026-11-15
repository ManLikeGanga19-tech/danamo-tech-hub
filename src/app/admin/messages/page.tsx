"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/client";
import { Loader2, Mail, AlertCircle, Reply, Copy, Check, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function ContactMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable (e.g. insecure context) — ignore
    }
  };

  const replyHref = (m: Message) =>
    `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`;

  useEffect(() => {
    adminFetch<Message[]>("/data/messages")
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load messages. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Inquiries submitted through the website. Click a message to read it in full.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-md flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No messages yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              When clients contact you, their messages will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">From</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Subject</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open message from ${msg.name}: ${msg.subject}`}
                    onClick={() => setSelected(msg)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(msg);
                      }
                    }}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:outline-none focus-visible:bg-blue-50 dark:focus-visible:bg-blue-500/10 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{msg.name}</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {msg.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{msg.message}</span>
                        <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#1E1E2F] rounded-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-900 dark:text-white pr-8 break-words">
                  {selected.subject}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  {new Date(selected.created_at).toLocaleString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DialogDescription>
              </DialogHeader>

              <dl className="grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 text-sm border-y border-gray-200 dark:border-gray-800 py-4">
                <dt className="text-gray-500 dark:text-gray-400">From</dt>
                <dd className="font-medium text-gray-900 dark:text-white break-words">{selected.name}</dd>
                <dt className="text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="flex items-center gap-2 min-w-0">
                  <a href={`mailto:${selected.email}`} className="text-blue-600 dark:text-blue-400 hover:underline truncate">
                    {selected.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => copyEmail(selected.email)}
                    aria-label="Copy email address"
                    className="p-1 rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </dd>
              </dl>

              <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
                <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                  {selected.message}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <a
                  href={replyHref(selected)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Reply by email
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
