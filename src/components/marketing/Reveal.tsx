"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "scale";

/**
 * Reveals its children once they scroll into view. Uses a single
 * IntersectionObserver per instance and unobserves after the first entry, so
 * content never re-hides on scroll-back. The animation itself lives in CSS
 * (`[data-reveal]` in globals.css) and only touches opacity/transform.
 *
 * `delay` staggers siblings; keep it under ~250ms so nothing feels laggy.
 */
export function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  direction?: Direction;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (or reduced motion handled in CSS): show it.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      // Start a little before the element is fully on screen.
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={direction}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
