"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LinkButton } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/online-school", label: "Online School" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { firebaseUser, isAdmin } = useAuth();
  const pathname = usePathname();

  // Only the homepage opens on a full-bleed dark hero, so only there does it
  // make sense to start transparent and solidify on scroll. Every other page
  // keeps the plain, always-solid navbar (safer contrast against light content).
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const portalHref = isAdmin ? "/admin/dashboard" : "/student/dashboard";
  const portalLabel = isAdmin ? "Admin Dashboard" : "Student Portal";

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-sand/60 bg-ivory/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10 lg:px-16">
        <Link
          href="/"
          className={`font-display text-xl tracking-tight transition-colors duration-500 ${
            transparent ? "text-ivory" : "text-charcoal"
          }`}
        >
          Pam&rsquo;s <span className="text-accent">Fashion Academy</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-500 hover:text-accent ${
                transparent ? "text-ivory/80" : "text-charcoal/75"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {firebaseUser ? (
            <LinkButton
              href={portalHref}
              variant={transparent ? "outline-light" : "ghost"}
              size="md"
            >
              {portalLabel}
            </LinkButton>
          ) : (
            <Link
              href="/login"
              className={`text-sm font-medium transition-colors duration-500 hover:text-accent ${
                transparent ? "text-ivory/80" : "text-charcoal/75"
              }`}
            >
              Login
            </Link>
          )}
          <LinkButton
            href="/apply"
            variant="primary"
            size="md"
            className="transition-transform duration-300 hover:scale-105"
          >
            Apply Now
          </LinkButton>
        </div>

        <button
          className="flex flex-col gap-1.5 p-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 transition-all duration-500 ${transparent ? "bg-ivory" : "bg-charcoal"} ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 transition-all duration-500 ${transparent ? "bg-ivory" : "bg-charcoal"} ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 transition-all duration-500 ${transparent ? "bg-ivory" : "bg-charcoal"} ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-sand/60 bg-ivory px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-charcoal/80"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-sand/60 pt-5">
              {firebaseUser ? (
                <LinkButton href={portalHref} variant="secondary">
                  {portalLabel}
                </LinkButton>
              ) : (
                <LinkButton href="/login" variant="ghost">
                  Login
                </LinkButton>
              )}
              <LinkButton href="/apply" variant="primary">
                Apply Now
              </LinkButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
