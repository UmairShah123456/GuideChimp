import type { CSSProperties, ReactNode } from "react";
import { resolveBranding, type Branding } from "@/lib/branding/vars";

export { resolveBranding };
export type { Branding };

/**
 * Applies an account's brand — colour, theme preset and font pairing — to a
 * subtree.
 *
 * The heavy lifting is in `resolveBranding`: it writes concrete `--color-*`,
 * `--radius-*` and `--font-*` values that shadow the `:root` tokens Tailwind's
 * `@theme` emits, because `@theme` resolves its `var()` inputs at `:root` and
 * would otherwise ignore anything we set further down the tree.
 *
 * The font pairing's class has to sit on the same element: it is what declares
 * the `--font-*` variables the inline `--font-sans` / `--font-display` point at.
 */
export function ThemeScope({
  branding,
  children,
  className,
  style,
}: {
  branding: Branding;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const { vars, fontClass } = resolveBranding(branding);
  return (
    <div
      className={[fontClass, "font-sans", className].filter(Boolean).join(" ")}
      style={{ ...vars, ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}
