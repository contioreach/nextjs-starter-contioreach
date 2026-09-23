import Link from "next/link";
import { Aurora } from "@/components/blog/Aurora";
import { BlogListing } from "@/components/blog/BlogListing";
import { CategoryPills } from "@/components/blog/CategoryPills";
import { CTASection } from "@/components/blog/CTASection";
import { Eyebrow } from "@/components/blog/Eyebrow";
import { FeatureGrid } from "@/components/blog/FeatureGrid";
import { loadListing } from "@/utils/api";
import { REPO_URL } from "@/utils/const";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "Next.js Headless CMS Example | ContioReach",
  description:
    "An open-source Next.js 16 App Router blog powered by a headless CMS — ISR, on-demand revalidation webhooks, category archives, JSON-LD and sitemaps included.",
  path: "/",
  keywords: [
    "headless cms next js example",
    "nextjs headless cms",
    "next.js app router blog",
    "incremental static regeneration",
    "on-demand revalidation",
  ],
});

export default async function Home() {
  // Seven newest posts: one featured card plus two rows.
  const { posts, categories } = await loadListing({ page: 1, limit: 7 });

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <Aurora />
        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-20 text-center sm:pt-32">
          <Eyebrow>Open-source example</Eyebrow>

          <h1 className="mt-6 text-5xl leading-[1.03] font-semibold text-balance text-white sm:text-7xl">
            Next.js ×{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              headless CMS
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-zinc-400">
            A complete blog on the Next.js 16 App Router, with every post on this site fetched
            from the ContioReach headless CMS. Incremental static regeneration, instant publishing
            over a webhook, and the SEO work already done.
          </p>

          {/* The copy-paste starting point: the first thing a developer who
              arrived from a search result is looking for. */}
          <div className="mx-auto mt-9 flex max-w-xl items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left">
            <span aria-hidden className="font-mono text-sm text-zinc-600">
              $
            </span>
            <code className="overflow-x-auto font-mono text-sm whitespace-nowrap text-zinc-200">
              npx degit contioreach/nextjs-headless-cms-example my-blog
            </code>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              View on GitHub
            </a>
            <Link
              href="/blog"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50"
            >
              See the live blog →
            </Link>
          </div>

          <p className="mt-6 font-mono text-xs text-zinc-600">
            Next.js 16 · React 19 · Tailwind CSS v4 · MIT
          </p>
        </div>
      </section>

      <FeatureGrid />

      <section className="mx-auto max-w-7xl border-t border-white/10 px-6 py-16 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Live from the CMS</h2>
            <p className="mt-2 max-w-xl text-zinc-400">
              Not fixtures — these are real posts served through the code in this repo.
            </p>
          </div>
          <Link
            href="/blog"
            className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-white/30 hover:text-white"
          >
            View all articles →
          </Link>
        </div>

        <div className="mb-10">
          <CategoryPills categories={categories} />
        </div>

        <BlogListing posts={posts} />
      </section>

      <CTASection />
    </>
  );
}
