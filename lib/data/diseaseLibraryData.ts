import catalog from "@/lib/locales/en/disease_catalog.json";

export type DiseaseListItem = {
  id: string;
  name: string;
  crop?: string | null;
  type: "healthy" | "disease" | "other" | string;
  pathogenType?: string | null;
  imageUrl?: string | null;
};

export type DiseaseSupplement = {
  name: string;
  imageUrl?: string | null;
  buyLink?: string | null;
};

export type DiseaseDetail = {
  id: string;
  name: string;
  crop?: string | null;
  type: "healthy" | "disease" | "other" | string;
  pathogenType?: string | null;
  introduction?: string;
  symptoms: string[];
  immediateActions: string[];
  naturalControl: string[];
  chemicalControl: string[];
  prevention: string[];
  imageUrl?: string | null;
  aliases?: string[];
  supplements: DiseaseSupplement[];
};

type CatalogShape = {
  version?: number;
  generatedAt?: string | null;
  diseases?: any[];
};

function toDetail(raw: any): DiseaseDetail {
  const supplements: DiseaseSupplement[] = Array.isArray(raw?.supplements)
    ? raw.supplements.map((s: any) => ({
        name: (s?.name ?? String(s ?? "").trim()) || "Product",
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

const RAW: any[] = ((catalog as CatalogShape)?.diseases ?? []).filter(
  (d) => d && (d.name || d.id),
);

export const DISEASES: DiseaseDetail[] = RAW.map(toDetail);

export const DISEASE_LIST: DiseaseListItem[] = DISEASES.map((d) => ({
  id: d.id,
  name: d.name,
  crop: d.crop ?? null,
  type: d.type,
  pathogenType: d.pathogenType ?? null,
  imageUrl: d.imageUrl ?? null,
}));
