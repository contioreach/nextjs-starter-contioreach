"use client";

import { useEffect, useState } from "react";

/* Sticky contents rail. The headings are parsed on the server and handed in,
   so this only tracks which one is on screen. */
export function TableOfContents({ items = [] }) {
  const [activeId, setActiveId] = useState(items[0]?.id || "");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -35% 0%" },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const scrollTo = (event, id) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    // Offset so the heading clears the sticky page header.
    const top = element.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
      <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
        On this page
      </p>
      <ul className="max-h-[60vh] space-y-1 overflow-y-auto border-l border-white/10">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => scrollTo(event, item.id)}
                className={`-ml-px block border-l-2 py-1.5 pr-2 text-sm leading-snug transition ${
                  active
                    ? "border-fuchsia-400 font-medium text-white"
                    : "border-transparent text-zinc-400 hover:border-white/30 hover:text-zinc-200"
                }`}
                style={{ paddingLeft: `${14 + (item.level - 2) * 12}px` }}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
