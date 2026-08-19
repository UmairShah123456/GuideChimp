/**
 * Dial-code picker data + helpers shared by the host editor and guest portal.
 * Numbers are stored as a local part plus a separate `dialCode` (e.g. "+44");
 * `fullPhone` recombines them into an international number so WhatsApp/tel/sms
 * links dial the right place.
 */

export interface DialCode {
  code: string; // "+44"
  country: string; // "United Kingdom"
  iso: string; // "GB" — ISO 3166-1 alpha-2, used to derive the flag emoji
}

/**
 * Turn an ISO 3166-1 alpha-2 code into its flag emoji by mapping each letter to
 * its regional-indicator symbol ("GB" → 🇬🇧).
 */
export function flagEmoji(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

/** Dial codes, UK first (the app's primary market), then alphabetical. */
export const DIAL_CODES: DialCode[] = [
  { code: "+44", country: "United Kingdom", iso: "GB" },
  { code: "+353", country: "Ireland", iso: "IE" },
  { code: "+1", country: "United States", iso: "US" },
  { code: "+1", country: "Canada", iso: "CA" },
  { code: "+61", country: "Australia", iso: "AU" },
  { code: "+33", country: "France", iso: "FR" },
  { code: "+49", country: "Germany", iso: "DE" },
  { code: "+34", country: "Spain", iso: "ES" },
  { code: "+39", country: "Italy", iso: "IT" },
  { code: "+351", country: "Portugal", iso: "PT" },
  { code: "+31", country: "Netherlands", iso: "NL" },
  { code: "+213", country: "Algeria", iso: "DZ" },
  { code: "+54", country: "Argentina", iso: "AR" },
  { code: "+374", country: "Armenia", iso: "AM" },
  { code: "+43", country: "Austria", iso: "AT" },
  { code: "+994", country: "Azerbaijan", iso: "AZ" },
  { code: "+973", country: "Bahrain", iso: "BH" },
  { code: "+880", country: "Bangladesh", iso: "BD" },
  { code: "+375", country: "Belarus", iso: "BY" },
  { code: "+32", country: "Belgium", iso: "BE" },
  { code: "+591", country: "Bolivia", iso: "BO" },
  { code: "+387", country: "Bosnia and Herzegovina", iso: "BA" },
  { code: "+55", country: "Brazil", iso: "BR" },
  { code: "+359", country: "Bulgaria", iso: "BG" },
  { code: "+855", country: "Cambodia", iso: "KH" },
  { code: "+237", country: "Cameroon", iso: "CM" },
  { code: "+56", country: "Chile", iso: "CL" },
  { code: "+86", country: "China", iso: "CN" },
  { code: "+57", country: "Colombia", iso: "CO" },
  { code: "+506", country: "Costa Rica", iso: "CR" },
  { code: "+385", country: "Croatia", iso: "HR" },
  { code: "+357", country: "Cyprus", iso: "CY" },
  { code: "+420", country: "Czechia", iso: "CZ" },
  { code: "+45", country: "Denmark", iso: "DK" },
  { code: "+593", country: "Ecuador", iso: "EC" },
  { code: "+20", country: "Egypt", iso: "EG" },
  { code: "+372", country: "Estonia", iso: "EE" },
  { code: "+251", country: "Ethiopia", iso: "ET" },
  { code: "+358", country: "Finland", iso: "FI" },
  { code: "+995", country: "Georgia", iso: "GE" },
  { code: "+233", country: "Ghana", iso: "GH" },
  { code: "+30", country: "Greece", iso: "GR" },
  { code: "+502", country: "Guatemala", iso: "GT" },
  { code: "+852", country: "Hong Kong", iso: "HK" },
  { code: "+36", country: "Hungary", iso: "HU" },
  { code: "+354", country: "Iceland", iso: "IS" },
  { code: "+91", country: "India", iso: "IN" },
  { code: "+62", country: "Indonesia", iso: "ID" },
  { code: "+964", country: "Iraq", iso: "IQ" },
  { code: "+972", country: "Israel", iso: "IL" },
  { code: "+225", country: "Ivory Coast", iso: "CI" },
  { code: "+81", country: "Japan", iso: "JP" },
  { code: "+962", country: "Jordan", iso: "JO" },
  { code: "+254", country: "Kenya", iso: "KE" },
  { code: "+965", country: "Kuwait", iso: "KW" },
  { code: "+371", country: "Latvia", iso: "LV" },
  { code: "+961", country: "Lebanon", iso: "LB" },
  { code: "+370", country: "Lithuania", iso: "LT" },
  { code: "+352", country: "Luxembourg", iso: "LU" },
  { code: "+60", country: "Malaysia", iso: "MY" },
  { code: "+356", country: "Malta", iso: "MT" },
  { code: "+230", country: "Mauritius", iso: "MU" },
  { code: "+52", country: "Mexico", iso: "MX" },
  { code: "+373", country: "Moldova", iso: "MD" },
  { code: "+377", country: "Monaco", iso: "MC" },
  { code: "+212", country: "Morocco", iso: "MA" },
  { code: "+977", country: "Nepal", iso: "NP" },
  { code: "+64", country: "New Zealand", iso: "NZ" },
  { code: "+234", country: "Nigeria", iso: "NG" },
  { code: "+389", country: "North Macedonia", iso: "MK" },
  { code: "+47", country: "Norway", iso: "NO" },
  { code: "+968", country: "Oman", iso: "OM" },
  { code: "+92", country: "Pakistan", iso: "PK" },
  { code: "+507", country: "Panama", iso: "PA" },
  { code: "+51", country: "Peru", iso: "PE" },
  { code: "+63", country: "Philippines", iso: "PH" },
  { code: "+48", country: "Poland", iso: "PL" },
  { code: "+974", country: "Qatar", iso: "QA" },
  { code: "+40", country: "Romania", iso: "RO" },
  { code: "+7", country: "Russia", iso: "RU" },
  { code: "+966", country: "Saudi Arabia", iso: "SA" },
  { code: "+381", country: "Serbia", iso: "RS" },
  { code: "+65", country: "Singapore", iso: "SG" },
  { code: "+421", country: "Slovakia", iso: "SK" },
  { code: "+386", country: "Slovenia", iso: "SI" },
  { code: "+27", country: "South Africa", iso: "ZA" },
  { code: "+82", country: "South Korea", iso: "KR" },
  { code: "+94", country: "Sri Lanka", iso: "LK" },
  { code: "+46", country: "Sweden", iso: "SE" },
  { code: "+41", country: "Switzerland", iso: "CH" },
  { code: "+886", country: "Taiwan", iso: "TW" },
  { code: "+255", country: "Tanzania", iso: "TZ" },
  { code: "+66", country: "Thailand", iso: "TH" },
  { code: "+216", country: "Tunisia", iso: "TN" },
  { code: "+90", country: "Türkiye", iso: "TR" },
  { code: "+256", country: "Uganda", iso: "UG" },
  { code: "+380", country: "Ukraine", iso: "UA" },
  { code: "+971", country: "United Arab Emirates", iso: "AE" },
  { code: "+598", country: "Uruguay", iso: "UY" },
  { code: "+58", country: "Venezuela", iso: "VE" },
  { code: "+84", country: "Vietnam", iso: "VN" },
  { code: "+260", country: "Zambia", iso: "ZM" },
  { code: "+263", country: "Zimbabwe", iso: "ZW" },
];

export const DEFAULT_DIAL_CODE = "+44";

/** Picker label, e.g. "🇬🇧 United Kingdom (+44)". */
export const dialCodeLabel = (d: DialCode) => `${flagEmoji(d.iso)} ${d.country} (${d.code})`;

/**
 * The picker allows two entries to share a dial code (US/Canada both "+1"), so
 * options are keyed by ISO and the stored value carries both: "GB|+44". Older
 * records stored just "+44" — `parseDialValue` accepts either shape.
 */
export const dialValue = (d: DialCode) => `${d.iso}|${d.code}`;

/** Extract the "+44" part from either a stored "GB|+44" or a bare "+44". */
export function dialCodeOf(stored: string | undefined): string {
  const s = (stored ?? "").trim();
  if (!s) return "";
  const code = s.includes("|") ? s.split("|")[1] : s;
  return code.startsWith("+") ? code : `+${code}`;
}

/** The three numbers a host can publish, each with its own optional dial code. */
export type PhoneKind = "whatsapp" | "phone" | "sms";

export const PHONE_KINDS: { kind: PhoneKind; label: string }[] = [
  { kind: "whatsapp", label: "WhatsApp" },
  { kind: "phone", label: "Call" },
  { kind: "sms", label: "Text" },
];

/**
 * The dial code for one of a host's numbers: its own override if set, else the
 * host-level default. Empty when neither exists (pre-migration records) — see
 * `fullPhone` for how that is handled.
 */
export function hostDialCode(
  host: { dialCode?: string; whatsappDialCode?: string; phoneDialCode?: string; smsDialCode?: string },
  kind: PhoneKind,
): string {
  const override = kind === "whatsapp" ? host.whatsappDialCode : kind === "phone" ? host.phoneDialCode : host.smsDialCode;
  return override ?? host.dialCode ?? "";
}

/** The `HostContact` key holding the dial-code override for one number. */
export const dialCodeField = (kind: PhoneKind) => `${kind}DialCode` as const;

/** Digits only — for wa.me, which wants a bare international number, no "+". */
export const phoneDigits = (v?: string) => (v ?? "").replace(/[^\d]/g, "");

/**
 * Combine a dial code and a local number into a full international number.
 * If the local part already starts with "+", it's treated as already-complete
 * (keeps older entries that stored the whole number working).
 *
 * With no dial code the number is returned untouched, trunk "0" and all. That
 * only dials from inside the same country, but it is a real number — inventing
 * a country code would silently connect the guest to the wrong one. Dropping
 * the "0" *and* prefixing nothing is what broke the guest "Call" link for hosts
 * saved before dial codes existed; migration 0019 backfills those records.
 */
export function fullPhone(dialCode: string | undefined, local: string | undefined): string {
  const l = (local ?? "").trim();
  if (!l) return "";
  if (l.startsWith("+")) return l;
  const code = dialCodeOf(dialCode);
  if (!code) return l;
  // Drop a leading trunk "0" — the dial code replaces it (e.g. UK 07… → +447…).
  return `${code}${l.replace(/^0+/, "")}`;
}
