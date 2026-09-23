import { BlogCard } from "./BlogCard";

/* Grid of posts. On page 1 of a listing the first post runs full width as a
   featured card; deeper pages are a plain uniform grid so the "featured"
   treatment keeps meaning something. */
export function BlogListing({ posts = [], featureFirst = true }) {
  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-16 text-center">
        <p className="text-lg font-medium text-white">Nothing here yet</p>
        <p className="mt-2 text-sm text-zinc-400">
          New articles land regularly — check back shortly, or browse another category.
        </p>
      </div>
    );
  }

  const [first, ...rest] = posts;
  const featured = featureFirst ? first : null;
  const grid = featured ? rest : posts;

  return (
    <div className="space-y-8">
      {featured && <BlogCard post={featured} featured priority />}

      {grid.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((post, index) => (
            <BlogCard key={post.id || post.slug} post={post} priority={!featured && index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
