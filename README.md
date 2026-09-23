# Next.js Headless CMS Example

A complete, production-shaped blog built with **Next.js 16 (App Router)** and a **headless CMS**, using [ContioReach](https://contioreach.com) as the content backend.

Not a toy. It ships the things a real content site actually needs and most examples skip: incremental static regeneration, an on-demand revalidation webhook, category archives, pagination, a table of contents generated from the article body, full SEO metadata, JSON-LD, and a sitemap.

```bash
npx degit contioreach/nextjs-starter-contioreach my-blog
cd my-blog && npm install
cp .env.example .env.local   # add your API key
npm run dev
```

> Looking for another stack? See the [Nuxt](https://github.com/contioreach/nuxtjs-starter-contioreach), [Astro](https://github.com/contioreach/astro-starter-contioreach), [SvelteKit](https://github.com/contioreach/sveltekit-starter-contioreach) and [Remix](https://github.com/contioreach/remix-starter-contioreach) examples.

---

## What's in the box

| Feature | Where |
| --- | --- |
| Blog index with pagination | [`src/app/blog/page.js`](src/app/blog/page.js) |
| Article page (SSG via `generateStaticParams`) | [`src/app/blog/[slug]/page.js`](src/app/blog/%5Bslug%5D/page.js) |
| Category archives | [`src/app/blog/category/[slug]/page.js`](src/app/blog/category/%5Bslug%5D/page.js) |
| Typed-ish CMS client with ISR + cache tags | [`src/utils/api.js`](src/utils/api.js) |
| On-demand revalidation webhook | [`src/app/api/revalidate/all/route.js`](src/app/api/revalidate/all/route.js) |
| Table of contents + stable heading anchors | [`src/utils/content.js`](src/utils/content.js) |
| Metadata, Open Graph, JSON-LD, sitemap, robots | [`src/utils/metadata.js`](src/utils/metadata.js), [`src/utils/schema.js`](src/utils/schema.js) |
| Article typography (raw CMS HTML) | [`src/app/globals.css`](src/app/globals.css) |

Styling is Tailwind CSS v4. No UI library, no MDX pipeline, no database — the CMS is the only backend.

---

## 1. Environment variables

Copy the template and fill it in:

```bash
cp .env.example .env.local
```

```env
CMS_API_URL=https://cms-api.contioreach.com
CMS_API_KEY=cms_xxxxxxxxxxxxxxxxxxxxxxxx
REVALIDATION_SECRET=revalidate_xxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ALLOW_INDEXING=false
NEXT_PUBLIC_SIGNUP_URL=https://app.contioreach.com/signup
NEXT_PUBLIC_LOGIN_URL=https://app.contioreach.com/login
```

Get `CMS_API_KEY` and `REVALIDATION_SECRET` from your ContioReach workspace settings (free plan is enough). Every variable is read in exactly one place — [`src/utils/const.js`](src/utils/const.js) — which throws a named error at build time if one is missing, rather than shipping a site that quietly 401s.

`CMS_API_KEY` and `REVALIDATION_SECRET` are server-only and never reach the browser bundle.

---

## 2. Fetching content

All reads go through one helper. Two details matter here and are the most common source of "why is my CMS content stale / why is my build so slow" questions:

```js
// src/utils/api.js
async function apiRequest(endpoint, { tags = [] } = {}) {
  const response = await fetch(`${BLOG_API_CONFIG.BASE_URL}${endpoint}`, {
    headers: API_HEADERS,
    cache: "force-cache",                                  // 1
    next: { revalidate: 3600, tags },                      // 2
  });
  // ...
}
```

1. **`cache: "force-cache"` is required in Next.js 15+.** `fetch` is no longer cached by default. Examples written for Next 13/14 omit this and silently hit your CMS on every request.
2. **`tags` are what makes instant publishing possible.** Time-based `revalidate` alone means up to an hour of stale content; tags let the CMS push an invalidation the moment an author hits publish (next section).

The CMS returns its own shape, so a thin transform layer (`transformBlogForDisplay`) maps it to what the components consume. Keeping that boundary in one file is what lets you swap Contentful/Sanity/Strapi in without touching a single component.

### Rendering strategy per route

| Route | Strategy | Why |
| --- | --- | --- |
| `/blog/[slug]` | SSG + ISR | `generateStaticParams` prerenders every post at build; ISR keeps them fresh |
| `/blog`, `/blog/category/[slug]` | Dynamic, cached data | `searchParams` (`?page=2`) is awaited, which opts the route out of static rendering — but the underlying `fetch` is still cached, so it stays fast |
| `/`, `/sitemap.xml` | Static + ISR | — |

---

## 3. Instant publishing with on-demand revalidation

Time-based ISR alone means an author waits up to an hour to see their post. The webhook closes that gap.

Point your CMS's publish webhook at `POST /api/revalidate/all`:

```js
// src/app/api/revalidate/all/route.js
for (const tag of Object.values(CACHE_CONFIG.TAGS)) {
  revalidateTag(tag, "max");
}
revalidatePath("/blog/[slug]", "page");
```

Two things worth copying into your own project:

- **The second argument to `revalidateTag` is new and not optional in practice.** `"max"` means stale-while-revalidate: visitors are served the cached page instantly while the refresh happens behind them. The old one-argument form is deprecated and makes the next request block on your CMS.
- **Tags and paths do different jobs.** Tags invalidate *data* wherever it's used; `revalidatePath` invalidates *rendered routes*. Content sites generally need both.

Test it locally:

```bash
curl -X POST http://localhost:3000/api/revalidate/all \
  -H "x-api-key: $REVALIDATION_SECRET" \
  -H "content-type: application/json" \
  -d '{"post":{"slug":"hello-world"}}'
```

An unknown secret returns `401`, so the endpoint is safe to leave public.

---

## 4. Rendering CMS HTML safely

Most headless CMSs hand you an HTML string. This example prepares it **once on the server** ([`src/utils/content.js`](src/utils/content.js)) and hands both the HTML and the table of contents down as props — rather than the common pattern of parsing the article twice in two client-side effects:

- injects stable `id`s on every `h2`/`h3`, de-duplicating repeated headings (`summary`, `summary-2`) so anchors never collide
- collects those headings into the table of contents, so the sidebar and the body can't drift apart
- wraps `<table>` so wide tables scroll instead of blowing out the layout
- falls back to a minimal Markdown renderer for plain-text bodies

Article typography is plain CSS on element selectors in `globals.css` (no `@tailwindcss/typography` needed), because the markup comes from the CMS, not from your JSX.

---

## 5. SEO

- `buildMetadata()` — canonical URL, Open Graph, Twitter card, article timestamps
- `blogPostingSchema()` / `breadcrumbSchema()` — JSON-LD injected via a tiny `<JsonLd>` component
- `src/app/sitemap.js` — every post and category, generated from the CMS
- `src/app/robots.js` — respects the same indexing switch

**This example ships `noindex` by default.** `NEXT_PUBLIC_ALLOW_INDEXING=false` keeps demo deployments out of search results so they can't compete with your real site. Set it to `true` when you go live.

---

## Deploy

```bash
npm run build && npm start
```

Deploy to Vercel, Netlify, or any Node host. Set the same environment variables in your host's dashboard, then add the deployed `https://your-site.com/api/revalidate/all` as the publish webhook in your CMS.

Remote images are whitelisted in `next.config.mjs`:

```js
images: { remotePatterns: [{ protocol: "https", hostname: "contiocdn.com" }] }
```

Change that hostname to your CMS's media domain or `next/image` will refuse to optimize your cover images.

---

## Using a different CMS

The CMS boundary is two files. To swap in Contentful, Sanity, Strapi or WordPress:

1. Rewrite the request helpers in `src/utils/api.js` (endpoints, auth header, query params).
2. Update `transformBlogForDisplay()` to map that CMS's field names onto this shape:

```js
{ id, slug, title, excerpt, description, coverImage, content,
  publishedAt, updatedAt, readingTime, authors, tags, categories }
```

Nothing else in the app knows where content comes from.

---

## Why ContioReach

Most headless CMSs are general-purpose content platforms you then bend into a blog. [ContioReach](https://contioreach.com) is built for blogs specifically: content planning, SEO optimization, internal linking and cover-image generation are part of the CMS rather than things you bolt on afterwards. Your frontend stays entirely yours — this repo is the proof.

[Start free →](https://app.contioreach.com/signup)

## License

MIT — see [LICENSE](LICENSE). Use it as a starting point for anything.
