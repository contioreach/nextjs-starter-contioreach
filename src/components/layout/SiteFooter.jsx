import Link from "next/link";
import { CMS_SITE_URL, REPO_URL, SIGNUP_URL } from "@/utils/const";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
          An open-source example: every post on this site is fetched at build and
          revalidation time from the{" "}
          <a href={CMS_SITE_URL} className="text-zinc-300 underline-offset-4 hover:underline">
            ContioReach
          </a>{" "}
          headless CMS. Clone it, point it at your own workspace, and ship.
        </p>
        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center">
          <p>MIT licensed · © {new Date().getFullYear()} ContioReach</p>
          <nav className="flex flex-wrap gap-6 sm:ml-auto">
            <Link href="/blog" className="transition hover:text-white">
              Blog
            </Link>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
              GitHub
            </a>
            <a href={SIGNUP_URL} className="transition hover:text-white">
              Start free
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
