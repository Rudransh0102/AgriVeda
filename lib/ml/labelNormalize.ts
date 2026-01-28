function splitTrailingParenGroup(input: string): { left: string; inside: string } | null {
  const s = (input || "").trim();
  if (!s.endsWith(")")) return null;

  let depth = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const ch = s[i];
    if (ch === ")") depth += 1;
    else if (ch === "(") {
      depth -= 1;
      if (depth === 0) {
        const left = s.slice(0, i).trim();
        const inside = s.slice(i + 1, s.length - 1).trim();
        if (!inside) return null;
        return { left, inside };
      }
    }
  }

  return null;
}

function toModelToken(s: string): string {
  return (s || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Converts labels like `Apple scab (Apple)` into a backend-friendly lookup key
 * like `Apple___Apple_scab`.
 *
 * If the label already contains `___`, it is returned as-is.
 */
export function canonicalizeLabelForLookup(label: string): string {
  const raw = (label || "").trim();
  if (!raw) return raw;
  if (raw.includes("___")) return raw;

  const split = splitTrailingParenGroup(raw);
  if (!split) return raw;

  const disease = split.left;
  const crop = split.inside;

  const cropTok = toModelToken(crop);
  const diseaseTok = toModelToken(disease);

  if (!cropTok || !diseaseTok) return raw;
  return `${cropTok}___${diseaseTok}`;
}
