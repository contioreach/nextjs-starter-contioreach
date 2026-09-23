import { NOINDEX, SITE_URL } from "@/utils/const";

export default function robots() {
  // Belt and braces with the per-page `noindex` tags: while the site is
  // closed off, crawlers are turned away at the door too.
  if (NOINDEX) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
