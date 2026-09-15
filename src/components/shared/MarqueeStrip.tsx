"use client";

interface Props {
  items: string[];
}

const fallbackItems = [
  "Fashion Design",
  "Pattern Making",
  "Sewing",
  "Branding",
  "Illustration",
  "Sustainable Fashion",
];

export function MarqueeStrip({ items }: Props) {
  const list = items.length > 0 ? items : fallbackItems;
  // Duplicate so the CSS scroll animation can loop seamlessly at -50%.
  const looped = [...list, ...list];

  return (
    <div
      className="group relative overflow-hidden border-y border-ivory/10 bg-black/40 py-4 backdrop-blur-sm"
      aria-hidden="true"
    >
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {looped.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-10 text-xs font-medium uppercase tracking-[0.25em] text-ivory/50"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
