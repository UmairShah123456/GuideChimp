"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getActiveAccount } from "@/lib/auth/session";
import { revalidateAccountGuides } from "@/lib/dashboard/revalidate";
import { normalizeHex } from "@/lib/branding/color";
import { THEMES } from "@/lib/branding/themes";
import { FONTS } from "@/lib/branding/fonts";
import type { FormState } from "@/lib/forms";

const isTheme = (slug: string) => THEMES.some((t) => t.slug === slug);
const isFont = (slug: string) => FONTS.some((f) => f.slug === slug);
const BACKDROPS = ["soft", "card", "none"];

/** Rename the account. Lives on the account page, separate from branding. */
export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await getActiveAccount();
  if (!account) return { error: "No account found." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Account name can't be empty." };

  const supabase = await createClient();
  const { error } = await supabase.from("accounts").update({ name }).eq("id", account.id);
  if (error) return { error: error.message };

  // The account name shows on staff guides, so guides need rebuilding too.
  await revalidateAccountGuides(account.id);
  revalidatePath("/account");
  revalidatePath("/branding");
  revalidatePath("/dashboard");
  return { ok: true, message: "Saved." };
}

/** Update the guest-portal look: logo, brand colour, theme and typefaces. */
export async function updateBrandingAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await getActiveAccount();
  if (!account) return { error: "No account found." };

  const brandColor = normalizeHex(String(formData.get("brand_color") ?? ""));
  if (!brandColor) return { error: "That doesn't look like a valid colour." };

  // Unknown slugs are rejected rather than silently coerced, so a stale form
  // can't quietly park an account on a theme it never chose.
  const themePreset = String(formData.get("theme_preset") ?? "");
  const fontHeading = String(formData.get("font_heading") ?? "");
  const fontBody = String(formData.get("font_body") ?? "");
  const logoBackdrop = String(formData.get("logo_backdrop") ?? "");
  if (!isTheme(themePreset)) return { error: "Pick one of the available themes." };
  if (!isFont(fontHeading) || !isFont(fontBody)) return { error: "Pick one of the available fonts." };
  if (!BACKDROPS.includes(logoBackdrop)) return { error: "Pick how your logo should sit on the header." };

  const logoRaw = String(formData.get("logo_url") ?? "").trim();
  const logoUrl = logoRaw === "" ? null : logoRaw;

  const supabase = await createClient();
  const { error } = await supabase
    .from("accounts")
    .update({
      logo_url: logoUrl,
      logo_backdrop: logoBackdrop,
      brand_color: brandColor,
      theme_preset: themePreset,
      font_heading: fontHeading,
      font_body: fontBody,
    })
    .eq("id", account.id);
  if (error) return { error: error.message };

  await revalidateAccountGuides(account.id);
  revalidatePath("/branding");
  revalidatePath("/dashboard");
  return { ok: true, message: "Branding saved." };
}
