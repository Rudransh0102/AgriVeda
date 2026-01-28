// Local-only implementation: removes server dependency
import { getDiseaseLocal, listDiseasesLocal } from "@/lib/local/diseaseLibrary";

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

export async function listDiseases(): Promise<DiseaseListItem[]> {
  return listDiseasesLocal();
}

export async function getDisease(
  nameOrSlugOrLabel: string,
): Promise<DiseaseDetail> {
  return getDiseaseLocal(nameOrSlugOrLabel);
}

export const diseaseLibraryService = {
  listDiseases,
  getDisease,
};
