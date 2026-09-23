import Image from "next/image";
import Link from "next/link";
import { formatDate, initials, readingTimeFor } from "@/utils/format";

/* One post in a grid. `featured` turns the card into a two-column hero card
   for the first post on a listing. */
export function BlogCard({ post, featured = false, priority = false }) {
  const date = formatDate(post.publishedAt);
  const reading = readingTimeFor(post);
  const author = post.author;

  return (
    <article
      className={`group relative isolate flex overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06] ${
        featured ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      {/* Gradient hairline that lights up on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div
        className={`relative overflow-hidden bg-zinc-900 ${
          featured ? "aspect-[16/10] lg:aspect-auto lg:w-[52%]" : "aspect-[16/9]"
        }`}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority={priority}
            sizes={featured ? "(max-width: 1024px) 100vw, 52vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#3b0764,#0e7490)]" />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />

        {post.category && (
          <span className="absolute top-4 left-4 rounded-full border border-white/20 bg-zinc-950/60 px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-100 uppercase backdrop-blur">
            {post.category}
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col p-6 ${featured ? "lg:justify-center lg:p-10" : ""}`}>
        <h3
          className={`font-semibold text-balance text-white ${
            featured ? "text-2xl leading-tight sm:text-3xl" : "text-lg leading-snug"
          }`}
        >
          {/* The whole card is the link target via this stretched anchor, so
              the heading stays the single accessible name for the card. */}
          <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0 before:content-['']">
            {post.title}
          </Link>
        </h3>

        {(post.excerpt || post.description) && (
          <p
            className={`mt-3 text-zinc-400 ${
              featured ? "text-base leading-relaxed" : "line-clamp-3 text-sm leading-relaxed"
            }`}
          >
            {post.excerpt || post.description}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4 text-xs text-zinc-500">
          {author?.image ? (
            <Image
              src={author.image}
              alt={author.name || ""}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-white/15"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-zinc-200">
              {initials(author?.name)}
            </span>
          )}
          <span className="truncate font-medium text-zinc-300">{author?.name || "ContioReach"}</span>
          {date && <span className="text-zinc-600">•</span>}
          {date && <time dateTime={post.publishedAt}>{date}</time>}
          {reading && <span className="ml-auto shrink-0 text-zinc-500">{reading}</span>}
        </div>
      </div>
    </article>
  );
}
