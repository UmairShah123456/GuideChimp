import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Keeps the Supabase project out of the free-tier "paused after 7 days of
 * inactivity" state by issuing a trivial query on a schedule (see the cron
 * entry in vercel.json). Deliberately cheap: a HEAD-only count, no rows read.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 10;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("house_rule_templates")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("[keepalive] Supabase ping failed", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
