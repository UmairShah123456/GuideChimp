import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Delete every uploaded file under one storage folder.
 *
 * Uses the service role deliberately. The `authenticated delete own media`
 * policy only lets someone delete objects they uploaded, so a teammate cleaning
 * up a property would silently leave behind anyone else's files. Callers must
 * therefore confirm the caller owns the folder BEFORE calling this — there is no
 * membership check in here.
 *
 * Returns the number of files removed, or an error message. Never throws: the
 * callers all delete database rows first, and a failure to sweep the files is
 * worth reporting but must not look like the delete itself failed.
 */
export async function deleteStorageFolder(
  bucket: string,
  folder: string,
): Promise<{ removed: number; error?: string }> {
  const supabase = createServiceClient();
  let removed = 0;

  // `list` is paginated and non-recursive. Media paths are flat within their
  // folder (`{prefix}/{uuid}.{ext}`), so one level is all there is to sweep.
  //
  // Always read from offset 0 rather than advancing a cursor: each pass deletes
  // what it just listed, so the next batch shifts down into the same window.
  // The pass count is capped so a `remove` that reports success without
  // actually deleting can't spin here forever.
  for (let pass = 0; pass < 100; pass++) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, { limit: 100 });
    if (error) return { removed, error: error.message };
    if (!data || data.length === 0) return { removed };

    const { error: rmError } = await supabase.storage
      .from(bucket)
      .remove(data.map((f) => `${folder}/${f.name}`));
    if (rmError) return { removed, error: rmError.message };
    removed += data.length;
  }

  return { removed, error: "Too many files to clear in one go — some remain." };
}
