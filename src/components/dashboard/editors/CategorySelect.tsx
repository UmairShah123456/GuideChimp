"use client";

import { useEffect, useRef, useState } from "react";
import { inputBase } from "./ui";
import { CategoryIcon, LOCAL_CATEGORIES } from "@/components/guest/categories";
import { ChevronRight } from "@/components/guest/icons";

/**
 * Category picker for a local-guide entry. This is a custom listbox rather than
 * a native <select> because the options carry the same icons the guest sees —
 * browsers won't render markup inside native option elements.
 */
export function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  // Close on a click outside or on Escape, so it behaves like the native control.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function openAt(index: number) {
    setActiveIndex(Math.max(0, index));
    setOpen(true);
  }

  function choose(v: string) {
    onChange(v);
    setOpen(false);
    trigger.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      trigger.current?.focus();
      return;
    }
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openAt(LOCAL_CATEGORIES.indexOf(value as (typeof LOCAL_CATEGORIES)[number]));
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(
        (i) => (i + step + LOCAL_CATEGORIES.length) % LOCAL_CATEGORIES.length,
      );
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(LOCAL_CATEGORIES[activeIndex]);
    }
  }

  return (
    <div ref={wrap} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() =>
          open
            ? setOpen(false)
            : openAt(LOCAL_CATEGORIES.indexOf(value as (typeof LOCAL_CATEGORIES)[number]))
        }
        className={`${inputBase} flex items-center gap-2 text-left`}
      >
        {value ? (
          <>
            <CategoryIcon category={value} className="h-4 w-4 flex-none text-accent" />
            <span className="min-w-0 flex-1 truncate">{value}</span>
          </>
        ) : (
          <span className="min-w-0 flex-1 truncate text-muted">Category</span>
        )}
        <ChevronRight className="h-4 w-4 flex-none rotate-90 text-muted" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface py-1 shadow-lg"
        >
          {LOCAL_CATEGORIES.map((c, i) => (
            <li key={c}>
              <button
                type="button"
                role="option"
                aria-selected={c === value}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => choose(c)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                  i === activeIndex ? "bg-accent-subtle" : ""
                } ${c === value ? "font-bold text-accent" : "text-body"}`}
              >
                <CategoryIcon category={c} className="h-4 w-4 flex-none" />
                <span className="min-w-0 flex-1 truncate">{c}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
