import { CONTACT_URL, REPO_URL, SIGNUP_URL } from "@/utils/const";

export function CTASection({
  heading = "Point it at your own content.",
  paragraph = "Clone the repo, drop in a ContioReach API key, and you have a blog running on a CMS built specifically for blogs — with your frontend still entirely yours.",
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-600/20 via-violet-600/10 to-cyan-500/20 px-8 py-14 text-center sm:px-16">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/25 blur-[100px]" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-balance text-white sm:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-300">{paragraph}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={SIGNUP_URL}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Get a free API key
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50"
            >
              Read the source
            </a>
          </div>
          <p className="mt-5 text-xs text-zinc-400">
            No credit card required · MIT licensed ·{" "}
            <a href={CONTACT_URL} className="underline-offset-4 hover:underline">
              Talk to us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
