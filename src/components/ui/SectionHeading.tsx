interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-left";
  const textColor = light ? "text-ivory" : "text-charcoal";
  const descColor = light ? "text-ivory/70" : "text-charcoal/65";

  return (
    <div className={`flex flex-col gap-4 max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <span className="font-body text-xs md:text-sm uppercase tracking-[0.25em] text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-3xl md:text-5xl leading-[1.1] ${textColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`font-body text-base md:text-lg leading-relaxed ${descColor}`}>
          {description}
        </p>
      )}
    </div>
  );
}
