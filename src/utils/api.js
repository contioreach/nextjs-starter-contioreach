import { API_HEADERS, BLOG_API_CONFIG, CACHE_CONFIG } from "./const";

/* Every read goes through here. In Next 16 `fetch` is uncached by default, so
   `cache: "force-cache"` is explicit; the tags are what the publish webhook
   (/api/revalidate/all) invalidates. */
async function apiRequest(endpoint, { tags = [] } = {}) {
  const url = `${BLOG_API_CONFIG.BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: API_HEADERS,
    cache: "force-cache",
    next: { revalidate: CACHE_CONFIG.REVALIDATE_TIME, tags },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error?.message || "API request failed");
  }

  return data;
}

function query(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.append(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getBlogs(params = {}) {
  const endpoint =
    BLOG_API_CONFIG.ENDPOINTS.BLOGS +
    query({
      page: params.page,
      limit: params.limit,
      category: params.category,
      author: params.author,
      tags: params.tags,
      search: params.search,
      minimal: params.minimal,
    });

  return apiRequest(endpoint, { tags: [CACHE_CONFIG.TAGS.BLOGS] });
}

export async function getBlogBySlug(slug) {
  // minimal=false so the detail page gets the full HTML body.
  const endpoint =
    BLOG_API_CONFIG.ENDPOINTS.BLOGS + query({ slug, minimal: "false" });

  return apiRequest(endpoint, {
    tags: [CACHE_CONFIG.TAGS.BLOGS, `blog-${slug}`],
  });
}

export async function getBlogsByCategory(categorySlug, params = {}) {
  return getBlogs({ ...params, category: categorySlug });
}

export async function getCategories(params = {}) {
  const endpoint =
    BLOG_API_CONFIG.ENDPOINTS.CATEGORIES +
    query({ page: params.page, limit: params.limit, id: params.id, slug: params.slug });

  return apiRequest(endpoint, { tags: [CACHE_CONFIG.TAGS.CATEGORIES] });
}

export async function getAuthors(params = {}) {
  const endpoint =
    BLOG_API_CONFIG.ENDPOINTS.AUTHORS +
    query({ page: params.page, limit: params.limit, id: params.id, slug: params.slug });

  return apiRequest(endpoint, { tags: [CACHE_CONFIG.TAGS.AUTHORS] });
}

export async function getTags(params = {}) {
  const endpoint =
    BLOG_API_CONFIG.ENDPOINTS.TAGS +
    query({ page: params.page, limit: params.limit, id: params.id, slug: params.slug });

  return apiRequest(endpoint, { tags: [CACHE_CONFIG.TAGS.TAGS] });
}

/* ---- transforms ---- */

export function transformBlogForDisplay(blog) {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    description: blog.description,
    coverImage: blog.coverImage,
    content: blog.content,
    publishedAt: blog.publishedAt,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    primaryKeyword: blog.primaryKeyword,
    readingTime: blog.readingTime ? `${blog.readingTime} min read` : null,
    author: blog.authors?.[0] || null,
    authors: blog.authors || [],
    tags: blog.tags || [],
    categories: blog.categories || [],
    category: blog.categories?.[0]?.name || "Uncategorized",
    categorySlug: blog.categories?.[0]?.slug || null,
  };
}

export function transformBlogsForDisplay(blogs) {
  return (blogs || []).map(transformBlogForDisplay);
}

/* ---- helpers for sitemaps / static params ---- */

export async function getAllBlogSlugs() {
  try {
    const response = await getBlogs({ minimal: "true", limit: 1000 });
    return response.data.map((blog) => ({ slug: blog.slug }));
  } catch (error) {
    console.error("Error fetching blog slugs:", error);
    return [];
  }
}

export async function getAllCategorySlugs() {
  try {
    const response = await getCategories({ limit: 100 });
    return response.data.map((category) => ({ slug: category.slug }));
  } catch (error) {
    console.error("Error fetching category slugs:", error);
    return [];
  }
}

export const EMPTY_META = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

// Never let a CMS outage take the page down — render an empty state instead.
export function handleApiError(error, fallbackData = null) {
  console.error("API Error:", error);
  if (fallbackData) return fallbackData;
  return { success: false, data: [], meta: { ...EMPTY_META } };
}

/* Fetch a page of posts plus the category list in one call site, with the
   error handling every listing page needs. */
export async function loadListing({ page = 1, limit = 12, category } = {}) {
  const [postsResult, categoriesResult] = await Promise.allSettled([
    category
      ? getBlogsByCategory(category, { page, limit, minimal: "true" })
      : getBlogs({ page, limit, minimal: "true" }),
    getCategories({ limit: 100 }),
  ]);

  let posts = [];
  let meta = { ...EMPTY_META, page, limit };

  if (postsResult.status === "fulfilled" && postsResult.value.success) {
    posts = transformBlogsForDisplay(postsResult.value.data);
    meta = postsResult.value.meta || meta;
  } else if (postsResult.status === "rejected") {
    handleApiError(postsResult.reason);
  }

  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value.data || [] : [];

  return { posts, meta, categories };
}
