/* Every value that varies by environment is read from the environment — see
   .env.example for the full list and .env.local for the local values.
   `NEXT_PUBLIC_*` names are the ones the browser bundle needs; the rest stay
   server-only. */

function required(name, value) {
  // Fails the build rather than silently shipping a site that 401s against the
  // CMS or points its canonicals at the wrong origin.
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. See .env.example.`);
  }
  return value;
}

/* Server-only vars are inlined as `undefined` in the browser bundle, so a
   client component that imports this module must not trip the check. Values
   guarded this way are only ever read on the server. */
function serverOnly(name, value) {
  if (typeof window !== "undefined") return "";
  return required(name, value);
}

// ContioReach Public API configuration.
export const BLOG_API_CONFIG = {
  BASE_URL: serverOnly("CMS_API_URL", process.env.CMS_API_URL),
  API_KEY: serverOnly("CMS_API_KEY", process.env.CMS_API_KEY),
  ENDPOINTS: {
    BLOGS: "/v1/blogs",
    AUTHORS: "/v1/authors",
    TAGS: "/v1/tags",
    CATEGORIES: "/v1/categories",
  },
};

// Shared secret the ContioReach app sends with its publish webhook.
export const REVALIDATION_SECRET = serverOnly(
  "REVALIDATION_SECRET",
  process.env.REVALIDATION_SECRET,
);

export const API_HEADERS = {
  "Content-Type": "application/json",
  "X-API-Key": BLOG_API_CONFIG.API_KEY,
};

export const CACHE_CONFIG = {
  REVALIDATE_TIME: 3600, // 1 hour
  TAGS: {
    BLOGS: "blogs",
    CATEGORIES: "categories",
    AUTHORS: "authors",
    TAGS: "tags",
  },
};

export const SITE_URL = required("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL);
export const SIGNUP_URL = required("NEXT_PUBLIC_SIGNUP_URL", process.env.NEXT_PUBLIC_SIGNUP_URL);
export const LOGIN_URL = required("NEXT_PUBLIC_LOGIN_URL", process.env.NEXT_PUBLIC_LOGIN_URL);

export const POSTS_PER_PAGE = 12;

/* Site-wide noindex. The site isn't ready to be indexed yet, so every page
   ships `noindex, nofollow` until NEXT_PUBLIC_ALLOW_INDEXING is set to "true".
   Flip that one env var to let search engines back in. */
export const NOINDEX = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true";

// Marketing site link used by the CTA's secondary button.
export const CONTACT_URL = "https://contioreach.com/contact-us";

// This repo is a public example, so the demo UI links back to the source.
export const REPO_URL = "https://github.com/contioreach/nextjs-starter-contioreach";
export const CMS_SITE_URL = "https://contioreach.com";
