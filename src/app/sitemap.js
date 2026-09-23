import { getAllBlogSlugs, getAllCategorySlugs } from "@/utils/api";
import { SITE_URL } from "@/utils/const";

export default async function sitemap() {
  const [posts, categories] = await Promise.all([getAllBlogSlugs(), getAllCategorySlugs()]);
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, priority: 0.9 },
    ...categories.map((category) => ({
      url: `${SITE_URL}/blog/category/${category.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
