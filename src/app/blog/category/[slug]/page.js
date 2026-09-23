import { notFound } from "next/navigation";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogListing } from "@/components/blog/BlogListing";
import { CategoryPills } from "@/components/blog/CategoryPills";
import { CTASection } from "@/components/blog/CTASection";
import { Pagination } from "@/components/blog/Pagination";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllCategorySlugs, getCategories, loadListing } from "@/utils/api";
import { POSTS_PER_PAGE } from "@/utils/const";
import { buildMetadata } from "@/utils/metadata";
import { breadcrumbSchema } from "@/utils/schema";

async function getCategory(slug) {
  try {
    const response = await getCategories({ slug });
    return response.success && response.data?.length ? response.data[0] : null;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return buildMetadata({
      title: "Category Not Found | ContioReach Blog",
      description: "The requested category could not be found.",
      path: `/blog/category/${slug}`,
      noIndex: true,
    });
  }

  const name = category.name.toLowerCase();
  return buildMetadata({
    title: `${category.name} Articles | ContioReach Blog`,
    description:
      category.description ||
      `Expert insights, strategies, and guides on ${name}. Browse every ${name} article on the ContioReach blog.`,
    path: `/blog/category/${slug}`,
    alt: `${category.name} articles on the ContioReach blog`,
    keywords: [name, slug, "headless cms", "content marketing", "blog"],
  });
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp?.page, 10) || 1);

  const category = await getCategory(slug);
  if (!category) notFound();

  const { posts, meta, categories } = await loadListing({
    page: currentPage,
    limit: POSTS_PER_PAGE,
    category: slug,
  });

  // Built after the category loads so the crumb uses its display name.
  const breadcrumb = breadcrumbSchema([
    { name: "Blog", path: "/blog" },
    { name: category.name, path: `/blog/category/${slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumb-schema" data={breadcrumb} />

      <BlogHero
        eyebrow={category.name}
        heading={
          <>
            Everything on{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              {category.name}
            </span>
          </>
        }
        paragraph={
          category.description ||
          `Expert insights, strategies, and guides on ${category.name.toLowerCase()}, plus what we're learning building ContioReach.`
        }
        stat={meta.total ? `${meta.total} articles in this category` : null}
      />

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-14">
        <CategoryPills categories={categories} active={slug} />
        <BlogListing posts={posts} featureFirst={currentPage === 1} />
        <Pagination meta={meta} basePath={`/blog/category/${slug}`} />
      </div>

      <CTASection />
    </>
  );
}
