/* What this example actually demonstrates — the reason a developer landed here
   from a search result. Each item points at the file that implements it. */
const features = [
  {
    title: "ISR + cache tags",
    body: "Posts are prerendered with generateStaticParams and refreshed on a one-hour window, with every request tagged so it can be invalidated individually.",
    file: "src/utils/api.js",
  },
  {
    title: "On-demand revalidation",
    body: "A signed webhook from the CMS calls revalidateTag(tag, \"max\"), so a published post goes live immediately without a redeploy.",
    file: "src/app/api/revalidate/all/route.js",
  },
  {
    title: "Server-rendered article body",
    body: "CMS HTML gets stable heading anchors and a table of contents in one server-side pass, instead of being parsed twice in the browser.",
    file: "src/utils/content.js",
  },
  {
    title: "Pagination and archives",
    body: "A real ?page=N listing plus category archives, both statically generated where the router allows it.",
    file: "src/app/blog/category/[slug]/page.js",
  },
  {
    title: "SEO, done properly",
    body: "Canonicals, Open Graph, BlogPosting and BreadcrumbList JSON-LD, a generated sitemap, and a single switch that gates indexing.",
    file: "src/utils/metadata.js",
  },
  {
    title: "One CMS boundary",
    body: "Two functions stand between your components and the API. Swap in Contentful, Sanity or Strapi without touching a component.",
    file: "src/utils/api.js",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">
        What this example demonstrates
      </h2>
      <p className="mt-2 max-w-2xl text-zinc-400">
        The parts most headless CMS tutorials leave out — and where to find each one in the repo.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
          >
            <h3 className="font-semibold text-white">{feature.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">{feature.body}</p>
            <code className="mt-4 block font-mono text-xs break-all text-cyan-300/80">
              {feature.file}
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}
