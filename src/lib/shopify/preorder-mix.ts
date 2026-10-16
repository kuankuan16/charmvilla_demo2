export type TeaMix = { variantId: string; quantity: number }[];

/** Stable variant IDs, never choice-array indexes. A set always contains exactly
 * its configured number of boxes; canonical order also merges identical mixes. */
export function parseTeaMix(raw: string | undefined, allowed: readonly string[], boxes: number): TeaMix {
  if (!raw || raw.length > 2048) throw new Error("Invalid tea mix");
  const entries: unknown = JSON.parse(raw);
  if (!Array.isArray(entries) || entries.length < 1 || entries.length > boxes) throw new Error("Invalid tea mix");
  const seen = new Set<string>();
  const mix = entries.map(entry => {
    if (!entry || typeof entry.variantId !== "string" || !allowed.includes(entry.variantId) || seen.has(entry.variantId)
      || !Number.isInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > boxes) throw new Error("Invalid tea mix");
    seen.add(entry.variantId);
    return { variantId: entry.variantId as string, quantity: entry.quantity as number };
  });
  if (mix.reduce((n, entry) => n + entry.quantity, 0) !== boxes) throw new Error("Invalid tea mix");
  return mix.sort((a, b) => a.variantId.localeCompare(b.variantId));
}
