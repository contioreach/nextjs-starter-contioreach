import { BlogHero } from "@/components/blog/BlogHero";
import { BlogListing } from "@/components/blog/BlogListing";
import { CategoryPills } from "@/components/blog/CategoryPills";
import { CTASection } from "@/components/blog/CTASection";
import { Pagination } from "@/components/blog/Pagination";
import { JsonLd } from "@/components/seo/JsonLd";
import { loadListing } from "@/utils/api";
import { POSTS_PER_PAGE } from "@/utils/const";
import { buildMetadata } from "@/utils/metadata";
import { breadcrumbSchema } from "@/utils/schema";

export const metadata = buildMetadata({
  title: "Blog | Headless CMS, SEO & Content Strategy | ContioReach",
  description:
    "Practical guides on headless CMS, SEO, AI search, blogging, and the workflows behind content that gets discovered, read, and cited.",
  path: "/blog",
  alt: "The ContioReach blog",
  keywords: [
    "headless cms blog",
    "content marketing",
    "seo tips",
    "ai search optimization",
    "blogging workflow",
    "content strategy",
  ],
});

const breadcrumb = breadcrumbSchema([{ name: "Blog", path: "/blog" }]);

export default async function BlogPage({ searchParams }) {
  // searchParams is a Promise in Next 16; awaiting it makes the route dynamic,
  // which is what real pagination needs.
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params?.page, 10) || 1);

  const { posts, meta, categories } = await loadListing({
    page: currentPage,
    limit: POSTS_PER_PAGE,
  });

  return (
    <>
      <JsonLd id="breadcrumb-schema" data={breadcrumb} />

      <BlogHero
        heading={
          <>
            Writing about the craft of{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              publishing well
            </span>
          </>
        }
        paragraph="Headless CMS, SEO, AI search, and the workflows behind content that gets discovered, read, and cited."
        stat={meta.total ? `${meta.total} articles and counting` : null}
      />

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-14">
        <CategoryPills categories={categories} />
        <BlogListing posts={posts} featureFirst={currentPage === 1} />
        <Pagination meta={meta} basePath="/blog" />
      </div>

      <CTASection />
    </>
  );
}
