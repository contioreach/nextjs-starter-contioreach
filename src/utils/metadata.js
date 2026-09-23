import { NOINDEX, SITE_URL } from "./const";

const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  alt,
  type = "website",
  keywords = [],
  noIndex = false,
  publishedTime,
  modifiedTime,
}) {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return {
    title,
    description,
    keywords: keywords.filter(Boolean),
    alternates: { canonical: url },
    // Site-wide noindex while NOINDEX is on; individual pages (a missing post,
    // say) can still opt out on their own.
    robots:
      noIndex || NOINDEX
        ? { index: false, follow: false, googleBot: { index: false, follow: false } }
        : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: "ContioReach",
      images: [{ url: ogImage, alt: alt || title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
