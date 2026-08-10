"use client";

import { useActionState, useState } from "react";
import { updateBrandingAction } from "@/lib/account/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { MediaUploader } from "@/components/dashboard/MediaUploader";
import { BrandPreview } from "@/components/dashboard/BrandPreview";
import { FontPicker } from "@/components/dashboard/FontPicker";
import { normalizeHex } from "@/lib/branding/color";
import { THEMES } from "@/lib/branding/themes";
import { FONT_PAIRINGS, fontBySlug, matchingPairing } from "@/lib/branding/fonts";
import { asBackdrop, type LogoBackdrop } from "@/components/guest/BrandLogo";
import type { AccountRow } from "@/lib/guide/types";

/**
 * Starting points, not a limit — the picker below takes any colour. These are
 * spread around the wheel so a host can land near their brand in one click and
 * fine-tune from there.
 */
const SWATCHES = [
  "#2a6e7e",
  "#0f766e",
  "#166534",
  "#8a5a2b",
  "#b45309",
  "#b91c1c",
  "#be185d",
  "#6d28d9",
  "#1d4ed8",
  "#0369a1",
  "#3f3f46",
  "#111827",
];

function SectionLabel({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-3">
      <span className="text-[13px] font-semibold text-ink">{title}</span>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );
}

function ChoiceCard({
  selected,
  onSelect,
  title,
  description,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col gap-2 rounded-[var(--radius-card)] border-[1.5px] p-3 text-left transition-colors ${
        selected ? "border-accent bg-accent-tint" : "border-border bg-surface hover:border-accent-ring"
      }`}
    >
      {children}
      <div>
        <div className="text-[13px] font-bold text-ink">{title}</div>
        {description && <div className="mt-0.5 text-xs leading-snug text-muted">{description}</div>}
      </div>
    </button>
  );
}

export function BrandingForm({ account }: { account: AccountRow }) {
  const [state, action] = useActionState(updateBrandingAction, {});
  const [color, setColor] = useState(account.brand_color);
  const [hexDraft, setHexDraft] = useState(account.brand_color);
  const [theme, setTheme] = useState(account.theme_preset);
  const [heading, setHeading] = useState(account.font_heading);
  const [body, setBody] = useState(account.font_body);
  const [logo, setLogo] = useState(account.logo_url ?? "");
  const [backdrop, setBackdrop] = useState<LogoBackdrop>(asBackdrop(account.logo_backdrop));
  // Open the individual pickers straight away when the saved combination isn't
  // one of the presets — otherwise the host's own choice looks unselected.
  const [customFonts, setCustomFonts] = useState(!matchingPairing(account.font_heading, account.font_body));

  const branding = { brand_color: color, theme_preset: theme, font_heading: heading, font_body: body };
  const activePairing = matchingPairing(heading, body);

  // The hex box accepts partial typing; only a complete value moves the colour,
  // so the preview never flickers through nonsense mid-keystroke.
  function onHexChange(value: string) {
    setHexDraft(value);
    const parsed = normalizeHex(value);
    if (parsed) setColor(parsed);
  }

  return (
    <form action={action} className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <input type="hidden" name="brand_color" value={color} />
      <input type="hidden" name="theme_preset" value={theme} />
      <input type="hidden" name="font_heading" value={heading} />
      <input type="hidden" name="font_body" value={body} />
      <input type="hidden" name="logo_url" value={logo} />
      <input type="hidden" name="logo_backdrop" value={backdrop} />

      <div className="min-w-0 flex-1 rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-6">
        <div>
          <SectionLabel
            title="Logo"
            hint="Shown at the top of every guide. PNG, SVG or JPEG all work."
          />
          <MediaUploader
            bucket="branding"
            pathPrefix={account.id}
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            value={logo || null}
            onUploaded={setLogo}
            label="Upload logo"
          />

          {logo && (
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              <ChoiceCard
                selected={backdrop === "soft"}
                onSelect={() => setBackdrop("soft")}
                title="Blend in"
                description="Fades the edges of your artwork so a white background dissolves into the header."
              />
              <ChoiceCard
                selected={backdrop === "card"}
                onSelect={() => setBackdrop("card")}
                title="White card"
                description="Sits your logo on a deliberate white card. Best if the artwork runs edge to edge."
              />
              <ChoiceCard
                selected={backdrop === "none"}
                onSelect={() => setBackdrop("none")}
                title="Place as-is"
                description="For logos that are already transparent."
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          <SectionLabel
            title="Brand colour"
            hint="Any colour you like — headers, buttons, links and tints are all derived from it."
          />

          <div className="flex flex-wrap gap-2">
            {SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={hex}
                aria-pressed={color === hex}
                onClick={() => {
                  setColor(hex);
                  setHexDraft(hex);
                }}
                className={`h-8 w-8 rounded-full border-2 transition-transform ${
                  color === hex ? "scale-110 border-ink" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="relative h-11 w-11 flex-none cursor-pointer overflow-hidden rounded-[var(--radius-sm)] border-[1.5px] border-border">
              <span className="absolute inset-0" style={{ backgroundColor: color }} />
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  setHexDraft(e.target.value);
                }}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Pick a brand colour"
              />
            </label>
            <input
              value={hexDraft}
              onChange={(e) => onHexChange(e.target.value)}
              onBlur={() => setHexDraft(color)}
              spellCheck={false}
              aria-label="Brand colour hex"
              className="w-36 rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface px-3.5 py-2.5 font-mono text-sm uppercase text-ink outline-none focus:border-accent"
            />
            <span className="text-xs text-muted">Paste the hex from your brand guide.</span>
          </div>
        </div>

        <div className="mt-6">
          <SectionLabel
            title="Theme"
            hint="Sets the surfaces, corners and overall feel your colour sits in."
          />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {THEMES.map((t) => (
              <ChoiceCard
                key={t.slug}
                selected={theme === t.slug}
                onSelect={() => setTheme(t.slug)}
                title={t.name}
                description={t.description}
              >
                <div
                  className="flex h-12 items-center gap-2 overflow-hidden px-2.5"
                  style={{
                    background: t.neutrals.page,
                    borderRadius: `${10 * t.radius.scale}px`,
                    border: `1.5px solid ${t.neutrals.border}`,
                  }}
                >
                  <span
                    className="h-6 w-6 flex-none"
                    style={{ background: color, borderRadius: t.radius.pill }}
                  />
                  <span className="flex flex-col gap-1">
                    <span
                      className="block h-1.5 w-20 rounded-full"
                      style={{ background: t.neutrals.ink, opacity: 0.75 }}
                    />
                    <span
                      className="block h-1.5 w-12 rounded-full"
                      style={{ background: t.neutrals.muted, opacity: 0.6 }}
                    />
                  </span>
                </div>
              </ChoiceCard>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <SectionLabel title="Typeface" hint="Headings and body copy across the guest portal." />

          <div className="grid gap-2.5 sm:grid-cols-2">
            {FONT_PAIRINGS.map((p) => (
              <ChoiceCard
                key={p.slug}
                selected={!customFonts && activePairing?.slug === p.slug}
                onSelect={() => {
                  setHeading(p.heading);
                  setBody(p.body);
                  setCustomFonts(false);
                }}
                title={p.name}
                description={p.description}
              >
                <div>
                  <div
                    className="text-[22px] font-bold leading-tight text-ink"
                    style={{ fontFamily: fontBySlug(p.heading).stack }}
                  >
                    Welcome in
                  </div>
                  <div
                    className="text-[12.5px] text-muted"
                    style={{ fontFamily: fontBySlug(p.body).stack }}
                  >
                    The Wi-Fi code is on the fridge.
                  </div>
                </div>
              </ChoiceCard>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCustomFonts((c) => !c)}
            className="mt-3 text-[12.5px] font-bold text-accent"
          >
            {customFonts ? "Use a pairing instead" : "Or choose fonts individually →"}
          </button>

          {customFonts && (
            <div className="mt-3 flex flex-col gap-3 rounded-[var(--radius-card)] border-[1.5px] border-border bg-page p-3 sm:flex-row">
              <FontPicker
                label="Headings"
                value={heading}
                sample="Welcome in"
                onChange={setHeading}
              />
              <FontPicker
                label="Body text"
                value={body}
                sample="Wi-Fi is on the fridge"
                onChange={setBody}
              />
            </div>
          )}
        </div>

        <div className="mt-7 flex items-center gap-3">
          <SubmitButton pendingLabel="Saving…">Save branding</SubmitButton>
          {state.ok && <span className="text-[13px] font-semibold text-success">{state.message}</span>}
          {state.error && <span className="text-[13px] font-semibold text-danger">{state.error}</span>}
        </div>
      </div>

      {/* Sticky so the preview stays in view while the host works down the form. */}
      <div className="lg:sticky lg:top-6 lg:w-[380px] lg:flex-none">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
          Live preview
        </div>
        <BrandPreview
          branding={branding}
          accountName={account.name}
          logoUrl={logo || null}
          logoBackdrop={backdrop}
        />
      </div>
    </form>
  );
}
