/* The shared backdrop for every blog surface: a near-black ground with two
   soft colour blooms and a faint grid. Purely decorative, so it is hidden
   from assistive tech and never intercepts pointer events. */
export function Aurora({ className = "" }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/20 blur-[120px]" />
      <div className="absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[120px]" />
      <div
        className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(70%_50%_at_50%_0%,#000,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
