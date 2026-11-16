import { isValidElement, type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { common } from "lowlight";
import http from "highlight.js/lib/languages/http";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import CodeBlock from "./CodeBlock";
import { SITE_URL } from "@/lib/site";

// Common languages plus the ones our articles use (HTTP requests, Dockerfiles).
const LANGUAGES = { ...common, http, dockerfile };

/** Language named on a fenced block ("```python" -> "python"). */
function languageOf(children: ReactNode): string | undefined {
  const child = Array.isArray(children) ? children[0] : children;
  if (!isValidElement(child)) return undefined;
  const className = (child as ReactElement<{ className?: string }>).props.className ?? "";
  return /language-([\w-]+)/.exec(className)?.[1];
}

/**
 * Renders article Markdown the same way on the public blog and in the admin
 * preview. Raw HTML in the Markdown is NOT rendered, so content can't inject
 * scripts; code is highlighted on the server.
 */
export default function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: false, languages: LANGUAGES }]]}
      components={{
        a: ({ href, children }) => {
          const external = href?.startsWith("http") && !href.startsWith(SITE_URL);
          return (
            <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {children}
            </a>
          );
        },
        img: ({ src, alt }) => <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" />,
        pre: ({ children }) => <CodeBlock language={languageOf(children)}>{children}</CodeBlock>,
        table: ({ children }) => (
          <div className="overflow-x-auto">
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
