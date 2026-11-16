"use client";

import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

const LABELS: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  jsx: "JSX",
  py: "Python",
  python: "Python",
  json: "JSON",
  http: "HTTP",
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  sql: "SQL",
  php: "PHP",
  html: "HTML",
  css: "CSS",
  yaml: "YAML",
  yml: "YAML",
  dockerfile: "Dockerfile",
  plaintext: "Text",
  text: "Text",
};

/** A code panel with a language label and a copy button. Highlighting is done on the server. */
export default function CodeBlock({ language, children }: { language?: string; children: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const label = language ? LABELS[language.toLowerCase()] ?? language.toUpperCase() : "Code";

  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): the reader can still select the text.
    }
  };

  return (
    <div className="code-block not-prose my-6 overflow-hidden rounded-xl border border-gray-800 bg-[#0d1117] shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#161b22]">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors"
          aria-label={copied ? "Copied" : `Copy ${label} code`}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre ref={ref} className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-200 font-mono" tabIndex={0}>
        {children}
      </pre>
    </div>
  );
}
