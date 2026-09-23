import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/blog/BlogDetail";
import { CTASection } from "@/components/blog/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAllBlogSlugs,
  getBlogBySlug,
  getBlogsByCategory,
  transformBlogForDisplay,
  transformBlogsForDisplay,
} from "@/utils/api";
import { buildMetadata } from "@/utils/metadata";
import { blogPostingSchema, breadcrumbSchema } from "@/utils/schema";

async function getPost(slug) {
  try {
    const response = await getBlogBySlug(slug);
    if (!response.success || !response.data) return null;
    // The API returns a list even when queried by slug.
    const blog = Array.isArray(response.data) ? response.data[0] : response.data;
    return blog ? transformBlogForDisplay(blog) : null;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

async function getRelated(categorySlug, currentId) {
  if (!categorySlug) return [];
  try {
    // Fetch 4 so the current post can be dropped and 3 still remain.
    const response = await getBlogsByCategory(categorySlug, { page: 1, limit: 4, minimal: "true" });
    if (!response.success) return [];
    return transformBlogsForDisplay(response.data)
      .filter((blog) => blog.id !== currentId)
      .slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch related blogs:", error);
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return buildMetadata({
      title: "Blog Post Not Found | ContioReach",
      description: "The requested blog post could not be found.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${post.title} | ContioReach`,
    description: post.description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage || undefined,
    alt: post.title,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    keywords: [
      post.category?.toLowerCase(),
      post.primaryKeyword,
      ...(post.tags?.map((tag) => tag.name?.toLowerCase()) || []),
      "headless cms",
      "content marketing",
      "blog",
    ].filter(Boolean),
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const relatedBlogs = await getRelated(post.categorySlug, post.id);

  // Home > Blog > Article — the leaf uses the post's own title rather than the
  // SEO title with its site suffix.
  const breadcrumb = breadcrumbSchema([
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumb-schema" data={breadcrumb} />
      <JsonLd id="article-schema" data={blogPostingSchema(post)} />
      <BlogDetail post={post} relatedBlogs={relatedBlogs} />
      <CTASection />
    </>
  );
}
