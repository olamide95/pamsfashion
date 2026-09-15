"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms — pass increasing values for a cascading effect. */
  delay?: number;
  /** Visual style of the reveal. */
  variant?: "up" | "fade" | "scale";
}

/**
 * Fades/slides content in the first time it scrolls into view. Pure CSS
 * transitions driven by a single IntersectionObserver toggle — no animation
 * library needed. Renders children immediately (no layout shift, no
 * flash-of-invisible-content on slow connections); only the opacity/transform
 * is deferred. Respects prefers-reduced-motion via the transition classes
 * themselves, which globals.css neutralizes for reduced-motion users.
 */
export function Reveal({ children, className = "", delay = 0, variant = "up" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    variant === "up" ? "translate-y-8" : variant === "scale" ? "scale-95" : "";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0 scale-100" : `opacity-0 ${hiddenTransform}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
