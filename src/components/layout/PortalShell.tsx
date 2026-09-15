"use client";

import { useState, type ReactNode } from "react";

export function PortalShell({
  sidebar,
  children,
  title,
}: {
  sidebar: ReactNode;
  children: ReactNode;
  title: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory-deep lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-sand bg-ivory lg:block">
        {sidebar}
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-sand bg-ivory px-6 py-4 lg:hidden">
          <span className="font-display text-lg text-charcoal">{title}</span>
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex flex-col gap-1.5 p-2"
          >
            <span className={`h-0.5 w-6 bg-charcoal transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-charcoal transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-charcoal transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </header>

        {mobileOpen && (
          <div className="border-b border-sand bg-ivory lg:hidden">{sidebar}</div>
        )}

        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
