"use client";

import { useEffect, useState } from "react";
import { REPO_URL, SIGNUP_URL } from "@/utils/const";

/* Top-of-page notice while the site runs on the demo workspace's key, or on a
   key the CMS rejects. The layout decides which on the server and passes only
   that status — the key itself never reaches the browser. It goes away by
   itself once CMS_API_KEY holds a working key of your own. */

const DISMISSED_KEY = "contioreach-demo-banner-dismissed";

// Lets signups that start here be counted, and by framework.
function signupLink() {
  const url = new URL(SIGNUP_URL);
  url.searchParams.set("ref", "cli");
  url.searchParams.set("fw", "next");
  return url.toString();
}

const HELP_URL = `${REPO_URL}#use-your-own-content`;

export function DemoBanner({ status }) {
  const [dismissed, setDismissed] = useState(false);

  /* Hidden for this browser session only: it comes back on the next visit for
     as long as the demo key is still in use. Read after mount, because
     sessionStorage does not exist during the server render. */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY) === "1") setDismissed(true);
    } catch {
      // Storage blocked (private mode, strict settings): just keep showing it.
    }
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
  }

  if (status === "invalid") {
    return (
      <div role="alert" className="border-b border-amber-400/25 bg-amber-400/[0.08]">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-6 py-2.5 sm:items-center">
          <span className="mt-0.5 shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wider text-amber-200 uppercase sm:mt-0">
            Key error
          </span>
          <p className="flex-1 text-sm leading-relaxed text-zinc-300">
            Invalid API key. ContioReach rejected the <code className="font-mono text-amber-200">CMS_API_KEY</code>{" "}
            in <code className="font-mono text-amber-200">.env.local</code> — copy it again from Developer Settings and
            restart the dev server.{" "}
            <a
              href={HELP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold whitespace-nowrap text-white underline decoration-amber-400/60 underline-offset-4 transition hover:decoration-amber-300"
            >
              How to set your key
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (status !== "demo" || dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Demo content notice"
      className="border-b border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-500/[0.12] via-zinc-950 to-cyan-400/[0.12]"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-6 py-2.5 sm:items-center">
        <span className="mt-0.5 shrink-0 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wider text-fuchsia-200 uppercase sm:mt-0">
          Demo
        </span>
        <p className="flex-1 text-sm leading-relaxed text-zinc-300">
          You&apos;re viewing demo content. Create your free ContioReach account and set your API key in{" "}
          <code className="font-mono text-cyan-300">.env.local</code> to show your own posts.{" "}
          <span className="whitespace-nowrap">
            <a
              href={signupLink()}
              className="font-semibold text-white underline decoration-fuchsia-400/60 underline-offset-4 transition hover:decoration-fuchsia-300"
            >
              Create account →
            </a>
            <span className="mx-2 text-zinc-600" aria-hidden>
              ·
            </span>
            <a
              href={HELP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 underline decoration-white/20 underline-offset-4 transition hover:text-white"
            >
              How to set your key
            </a>
          </span>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss demo notice"
          className="-mr-1.5 shrink-0 rounded-md p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L8.94 10l-4.72 4.72a.75.75 0 1 0 1.06 1.06L10 11.06l4.72 4.72a.75.75 0 1 0 1.06-1.06L11.06 10l4.72-4.72a.75.75 0 0 0-1.06-1.06L10 8.94 5.28 4.22Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
