import Link from "next/link";

/* Category nav for the listing pages. `active` is the current category slug,
   or null on /blog. */
export function CategoryPills({ categories = [], active = null }) {
  if (categories.length === 0) return null;

  const items = [{ name: "All posts", slug: null, href: "/blog" }, ...categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    href: `/blog/category/${c.slug}`,
    count: c.postCount,
  }))];

  return (
    <nav aria-label="Blog categories" className="flex flex-wrap justify-center gap-2.5">
      {items.map((item) => {
        const isActive = item.slug === active;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-transparent bg-white text-zinc-950 shadow-[0_0_30px_-8px_rgba(255,255,255,0.6)]"
                : "border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/30 hover:text-white"
            }`}
          >
            {item.name}
            {typeof item.count === "number" && (
              <span className={isActive ? "text-zinc-500" : "text-zinc-500"}>{item.count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
