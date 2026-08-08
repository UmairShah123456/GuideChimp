import { redirect } from "next/navigation";

/**
 * Billing moved onto the account page. Kept as a redirect so existing links and
 * bookmarks land somewhere useful instead of 404ing.
 */
export default function BillingPage() {
  redirect("/account#billing");
}
