import {
  DISEASES as DISEASES_EN,
  DISEASE_LIST as DISEASE_LIST_EN,
} from "@/lib/data/diseaseLibraryData";
import { getPreferredLanguage } from "@/lib/preferences";
import type {
  DiseaseDetail,
  DiseaseListItem,
} from "@/lib/services/diseaseLibraryService";

function normalize(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function modelLabelToDisplay(label: string): string {
  const raw = (label || "").trim();
  // Format 1: Catalog-style id e.g. "Apple___Black_rot"
  if (raw.includes("___")) {
    const [crop, diseasePart] = raw.split("___", 2);
    const disease = (diseasePart || "").replace(/_/g, " ").trim();
    const dn = normalize(disease);
    const cn = normalize(crop);
    let final = disease;
    if (dn.startsWith(cn + " ")) {
      final = disease.slice(crop.length).trim();
    }
    return crop ? `${crop} : ${final}` : final;
  }

  // Format 2: Model labels like "Black rot (Apple)" or "healthy (Tomato)"
  const m = raw.match(/^\s*(.*?)\s*\(([^)]+)\)\s*$/);
  if (m) {
    const disease = (m[1] || "").replace(/_/g, " ").trim();
    const crop = (m[2] || "").trim();
    return crop ? `${crop} : ${disease}` : disease;
  }

  // Format 3: plain text, return as-is
  return raw;
}

function toDetail(raw: any): DiseaseDetail {
  const supplements = Array.isArray(raw?.supplements)
    ? raw.supplements.map((s: any) => ({
        // Avoid mixing ?? with || without parentheses
        name: s?.name ?? (String(s ?? "") || "Product"),
        imageUrl: s?.imageUrl ?? null,
        buyLink: s?.buyLink ?? null,
      }))
    : [];

  return {
    id: String(raw?.id ?? raw?.name ?? Math.random().toString(36).slice(2)),
    name: String(raw?.name ?? "Unknown").trim(),
    crop: raw?.crop ?? null,
    type: raw?.type ?? "disease",
    pathogenType: raw?.pathogenType ?? null,
    introduction: raw?.introduction ?? "",
    symptoms: Array.isArray(raw?.symptoms) ? raw.symptoms : [],
    immediateActions: Array.isArray(raw?.immediateActions)
      ? raw.immediateActions
      : [],
    naturalControl: Array.isArray(raw?.naturalControl)
      ? raw.naturalControl
      : [],
    chemicalControl: Array.isArray(raw?.chemicalControl)
      ? raw.chemicalControl
      : [],
    prevention: Array.isArray(raw?.prevention) ? raw.prevention : [],
    imageUrl: raw?.imageUrl ?? null,
    aliases: Array.isArray(raw?.aliases) ? raw.aliases : [],
    supplements,
  };
}

async function loadLocalizedCatalog(): Promise<{
  list: DiseaseListItem[];
  details: DiseaseDetail[];
}> {
  const lang = await getPreferredLanguage();
  try {
    if (lang === "hi") {
      const hi = require("@/lib/locales/hi/diseases_catalog.json");
      const items = Array.isArray(hi?.diseases) ? hi.diseases : [];
      const details = items.map(toDetail);
      const list = details.map(
        (d: {
          id: any;
          name: any;
          crop: any;
          type: any;
          pathogenType: any;
          imageUrl: any;
        }) => ({
          id: d.id,
          name: d.name,
          crop: d.crop ?? null,
          type: d.type,
          pathogenType: d.pathogenType ?? null,
          imageUrl: d.imageUrl ?? null,
        }),
      );
      return { list, details };
    }
    if (lang === "ma") {
      const ma = require("@/lib/locales/ma/diseases_catalog.json");
      const items = Array.isArray(ma?.diseases) ? ma.diseases : [];
      const details = items.map(toDetail);
      const list = details.map(
        (d: {
          id: any;
          name: any;
          crop: any;
          type: any;
          pathogenType: any;
          imageUrl: any;
        }) => ({
          id: d.id,
          name: d.name,
          crop: d.crop ?? null,
          type: d.type,
          pathogenType: d.pathogenType ?? null,
          imageUrl: d.imageUrl ?? null,
        }),
      );
      return { list, details };
    }
  } catch {
    // fall back to English below
  }

  // English/default
  const details = DISEASES_EN;
  const list = DISEASE_LIST_EN;
  return { list, details };
}

export async function listDiseasesLocal(): Promise<DiseaseListItem[]> {
  const { list } = await loadLocalizedCatalog();
  return list;
}

export async function getDiseaseLocal(
  nameOrSlugOrLabel: string,
): Promise<DiseaseDetail> {
  const raw = (nameOrSlugOrLabel || "").trim();
  const display = modelLabelToDisplay(raw);
  const n = normalize(display || raw);

  const { details } = await loadLocalizedCatalog();

  // Try exact id match first (for labels like Apple___Black_rot)
  const byId = details.find((d: any) => String(d.id).trim() === raw);
  if (byId) return byId;

  const byName = details.find((d) => normalize(d.name) === n);
  if (byName) return byName;

  const partial = details.find((d) => normalize(d.name).includes(n));
  if (partial) return partial;

  // Additional matching: handle "Disease (Crop)" by splitting and matching crop + disease tokens
  const m = raw.match(/^\s*(.*?)\s*\(([^)]+)\)\s*$/);
  if (m) {
    const disease = normalize(m[1] || "");
    const crop = normalize(m[2] || "");
    const byCropAndName = details.find(
      (d) =>
        normalize(String(d.crop || "")) === crop &&
        normalize(d.name).includes(disease),
    );
    if (byCropAndName) return byCropAndName;
    const byCropAndId = details.find(
      (d) =>
        normalize(String(d.crop || "")) === crop &&
        normalize(String(d.id || "").replace(/___/g, " ")).includes(disease),
    );
    if (byCropAndId) return byCropAndId;
  }

  throw new Error("Disease not found");
}
