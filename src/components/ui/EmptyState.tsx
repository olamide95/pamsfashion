import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-sand bg-ivory-deep/50 px-8 py-16 text-center">
      <p className="font-display text-xl text-charcoal">{title}</p>
      {description && <p className="max-w-sm text-sm text-charcoal/60">{description}</p>}
      {action}
    </div>
  );
}
