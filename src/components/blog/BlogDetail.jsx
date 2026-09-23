import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "./BlogCard";
import { ReadingProgress } from "./ReadingProgress";
import { ShareBar } from "./ShareBar";
import { TableOfContents } from "./TableOfContents";
import { Aurora } from "./Aurora";
import { SIGNUP_URL, SITE_URL } from "@/utils/const";
import { prepareContent } from "@/utils/content";
import { formatDate, initials, readingTimeFor } from "@/utils/format";

function AuthorCard({ author }) {
  if (!author) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
        Written by
      </p>
      <div className="flex items-start gap-3.5">
        {author.image ? (
          <Image
            src={author.image}
            alt={author.name || ""}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/15"
          />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 font-semibold text-zinc-200">
            {initials(author.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-white">{author.name}</p>
          {author.bio && <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{author.bio}</p>}
          {(author.twitter || author.website) && (
            <div className="mt-3 flex gap-4 text-xs font-medium">
              {author.twitter && (
                <a href={author.twitter} target="_blank" rel="noopener noreferrer nofollow" className="text-zinc-300 underline-offset-4 hover:underline">
                  Twitter
                </a>
              )}
              {author.website && (
                <a href={author.website} target="_blank" rel="noopener noreferrer nofollow" className="text-zinc-300 underline-offset-4 hover:underline">
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RailCta({ slug }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-600/25 to-cyan-500/20 p-5">
      <p className="text-base leading-snug font-semibold text-white">
        Your blog deserves a better content layer.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
        A headless CMS built specifically for blogs — plan, create, optimize, publish.
      </p>
      <a
        /* Attribution so the app can tell which article converted. */
        href={`${SIGNUP_URL}?utm_source=blog&utm_medium=article_cta&utm_campaign=${encodeURIComponent(slug || "blog")}`}
        className="mt-4 block rounded-full bg-white px-4 py-2.5 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
      >
        Start free
      </a>
      <p className="mt-2.5 text-center text-[11px] text-zinc-400">No credit card required</p>
    </div>
  );
}

function MetaCell({ label, value }) {
  return (
    <div>
      <p className="text-[11px] tracking-wide text-zinc-500 uppercase">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}

export function BlogDetail({ post, relatedBlogs = [] }) {
  const { html, toc } = prepareContent(post.content);

  const author = post.author;
  const published = formatDate(post.publishedAt, { month: "long" });
  // Only shown when it differs from the publish date — "Updated" repeating the
  // same day reads as a bug.
  const updated =
    post.updatedAt && post.updatedAt.slice(0, 10) !== (post.publishedAt || "").slice(0, 10)
      ? formatDate(post.updatedAt, { month: "long" })
      : null;
  const reading = readingTimeFor(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <article>
      <ReadingProgress />

      <header className="relative overflow-hidden border-b border-white/10">
        <Aurora />
        <div className="relative mx-auto max-w-4xl px-6 pt-14 pb-12 sm:pt-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <Link href="/blog" className="transition hover:text-white">
              Blog
            </Link>
            {post.categorySlug && (
              <>
                <span aria-hidden>/</span>
                <Link href={`/blog/category/${post.categorySlug}`} className="transition hover:text-white">
                  {post.category}
                </Link>
              </>
            )}
          </nav>

          <h1 className="mt-5 text-4xl leading-[1.08] font-semibold text-balance text-white sm:text-5xl">
            {post.title}
          </h1>

          {(post.excerpt || post.description) && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-zinc-400">
              {post.excerpt || post.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-white/10 pt-6">
            {author && (
              <div className="flex items-center gap-3">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.name || ""}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-white/15"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-zinc-200">
                    {initials(author.name)}
                  </span>
                )}
                <MetaCell label="Author" value={author.name} />
              </div>
            )}
            {published && <MetaCell label="Published" value={published} />}
            {updated && <MetaCell label="Updated" value={updated} />}
            {reading && <MetaCell label="Read time" value={reading} />}
            <div className="sm:ml-auto">
              <ShareBar url={url} title={post.title} />
            </div>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative -mt-0 aspect-[16/8] overflow-hidden rounded-3xl border border-white/10 sm:-mt-10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div
          className="blog-content"
          /* Body HTML comes from our own CMS. */
          dangerouslySetInnerHTML={{ __html: html || "<p>No content available.</p>" }}
        />

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <TableOfContents items={toc} />
          <AuthorCard author={author} />
          <RailCta slug={post.slug} />
        </aside>
      </div>

      {post.tags?.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id || tag.slug || tag.name}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {relatedBlogs.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Keep reading</h2>
              <Link href="/blog" className="text-sm text-zinc-400 transition hover:text-white">
                All articles →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((related) => (
                <BlogCard key={related.id || related.slug} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
