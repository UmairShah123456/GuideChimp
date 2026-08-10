import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getGuestGuide, type GuideResult } from "./queries";

/** Cache tag for a token's resolved guide, so host saves can invalidate it. */
export function guideTag(token: string): string {
  return `guide:${token}`;
}

/**
 * Signals a non-ok result (not_found/expired) so it is thrown out of — never
 * written to — the Data Cache. A transient miss must not be able to poison the
 * link for every guest for the whole revalidate window.
 */
class GuideMiss extends Error {
  constructor(readonly status: "expired" | "not_found") {
    super(status);
  }
}

/**
 * Guest guide resolver with two cache layers:
 *  - `unstable_cache`: cross-request Data Cache so repeated guest views and tab
 *    switches reuse the DB read. Keyed + tagged per token; host saves call
 *    {@link revalidateGuide} to invalidate it. **Only successful guides are
 *    cached** — a not_found/expired result throws so it is re-fetched on the
 *    next request rather than served stale.
 *  - React `cache()`: per-request memoisation across nested server components.
 */

/**
 * Bumped whenever the cached {@link GuestGuide} shape changes. Entries written
 * by an older deploy outlive it — the Data Cache is on disk and `revalidate`
 * keeps them for minutes — so without a new key the next deploy reads the old
 * shape back into new code and throws on every live link until they expire.
 *
 * v2: guides became a layer of their own (`guide` added, sections re-scoped).
 */
const CACHE_VERSION = "v2";

export const getGuide = cache(async (token: string): Promise<GuideResult> => {
  const load = unstable_cache(
    async () => {
      const res = await getGuestGuide(token);
      if (res.status !== "ok") throw new GuideMiss(res.status);
      return res;
    },
    [`guest-guide-${CACHE_VERSION}`, token],
    { tags: [guideTag(token)], revalidate: 300 },
  );
  try {
    return await load();
  } catch (err) {
    if (err instanceof GuideMiss) return { status: err.status };
    throw err;
  }
});
