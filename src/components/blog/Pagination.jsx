import Link from "next/link";

/* Builds the window of page numbers around the current page, with `null`
   standing in for an ellipsis. */
function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const out = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) out.push(null);
    out.push(page);
    previous = page;
  }
  return out;
}

export function Pagination({ meta, basePath = "/blog" }) {
  const total = meta?.totalPages || 0;
  if (total <= 1) return null;

  const current = meta.page || 1;
  const href = (page) => (page === 1 ? basePath : `${basePath}?page=${page}`);

  const arrow =
    "inline-flex h-10 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-4 text-sm font-medium text-zinc-300 transition hover:border-white/30 hover:text-white";

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      {meta.hasPrevPage ? (
        <Link href={href(current - 1)} rel="prev" className={arrow}>
          ← Previous
        </Link>
      ) : (
        <span className={`${arrow} cursor-not-allowed opacity-40`}>← Previous</span>
      )}

      <ul className="flex items-center gap-1.5">
        {pageWindow(current, total).map((page, index) =>
          page === null ? (
            <li key={`gap-${index}`} className="px-1 text-zinc-600">
              …
            </li>
          ) : (
            <li key={page}>
              <Link
                href={href(page)}
                aria-current={page === current ? "page" : undefined}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${
                  page === current
                    ? "bg-white text-zinc-950"
                    : "border border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/30 hover:text-white"
                }`}
              >
                {page}
              </Link>
            </li>
          ),
        )}
      </ul>

      {meta.hasNextPage ? (
        <Link href={href(current + 1)} rel="next" className={arrow}>
          Next →
        </Link>
      ) : (
        <span className={`${arrow} cursor-not-allowed opacity-40`}>Next →</span>
      )}
    </nav>
  );
}
