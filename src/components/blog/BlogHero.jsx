import { Aurora } from "./Aurora";
import { Eyebrow } from "./Eyebrow";

export function BlogHero({
  eyebrow = "The ContioReach blog",
  heading,
  paragraph,
  stat,
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <Aurora />
      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-14 text-center sm:pt-28 sm:pb-20">
        <Eyebrow>{eyebrow}</Eyebrow>

        <h1 className="mt-6 text-4xl leading-[1.05] font-semibold text-balance text-white sm:text-6xl">
          {heading}
        </h1>

        {paragraph && (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-zinc-400">
            {paragraph}
          </p>
        )}

        {stat && <p className="mt-6 text-sm text-zinc-500">{stat}</p>}
      </div>
    </section>
  );
}
