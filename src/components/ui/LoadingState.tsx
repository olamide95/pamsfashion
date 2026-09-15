export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label={label}>
      <div className="h-4 w-40 animate-pulse rounded-full bg-sand/70" />
      <div className="h-24 w-full animate-pulse rounded-2xl bg-sand/50" />
      <div className="h-24 w-full animate-pulse rounded-2xl bg-sand/40 [animation-delay:150ms]" />
    </div>
  );
}
