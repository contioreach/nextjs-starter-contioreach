"use client";

import { useState } from "react";

const iconClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-zinc-300 transition hover:border-white/35 hover:text-white";

export function ShareBar({ url, title }) {
  const [copied, setCopied] = useState(false);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title || "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is blocked in some contexts; the share links still work.
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs tracking-wide text-zinc-500 uppercase">Share</span>

      <a
        href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="Share on X"
        className={iconClass}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z" />
        </svg>
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="Share on LinkedIn"
        className={iconClass}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21h-4V9Z" />
        </svg>
      </a>

      <a
        href={`mailto:?subject=${t}&body=${u}`}
        aria-label="Share by email"
        className={iconClass}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      </a>

      <button type="button" onClick={copy} aria-label="Copy link" className={iconClass}>
        {copied ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]" aria-hidden>
            <path d="m5 13 4 4L19 7" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden>
            <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
            <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
          </svg>
        )}
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
