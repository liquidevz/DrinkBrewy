/**
 * Decorative camera-viewfinder marks fixed over the viewport: corner
 * brackets plus small ticks down each side. Purely ornamental.
 */
export default function ViewfinderFrame() {
  const corner = "absolute size-3 border-cream/35";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-4 bottom-4 top-[4.75rem] z-[55] hidden md:inset-x-10 md:block"
    >
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />

      <div className="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col gap-10">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-px w-1.5 bg-cream/35" />
        ))}
      </div>
      <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-end gap-10">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-px w-1.5 bg-cream/35" />
        ))}
      </div>
    </div>
  );
}
