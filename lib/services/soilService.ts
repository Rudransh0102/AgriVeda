import { apiRequest } from "@/lib/api/client";

const DEFAULT_SOIL = "mixed";
const NOMINATIM_ENDPOINT =
  "https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&addressdetails=1";

export async function getSoilTypeForLocation(lat: number, lon: number): Promise<string> {
  const backendSoil = await getBackendSoil(lat, lon);
  if (backendSoil) return backendSoil;

  const districtSoil = await getDistrictSoil(lat, lon);
  if (districtSoil) return districtSoil;

  const fallbackSoil = await getNominatimSoilGuess(lat, lon);
  if (fallbackSoil) return fallbackSoil;

  return DEFAULT_SOIL;
}

async function getBackendSoil(lat: number, lon: number): Promise<string | null> {
  try {
    const js = await apiRequest<any>("/api/predict-soil", {
      method: "POST",
      body: JSON.stringify({ lat, lon }),
    });

    const soil = normalizeSoil(js?.soil_type || js?.soilType);
    if (soil) return soil;
  } catch {
    // ignore
  }
  return null;
}

async function getDistrictSoil(lat: number, lon: number): Promise<string | null> {
  try {
    const js = await apiRequest<any>(`/api/soil?lat=${lat}&lon=${lon}`);
    const soil = normalizeSoil(js?.soil_type || js?.soilType);
    if (soil) return soil;
  } catch {
    // ignore
  }
  return null;
}

async function getNominatimSoilGuess(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(`${NOMINATIM_ENDPOINT}&lat=${lat}&lon=${lon}`, {
      headers: {
        // Nominatim requests a UA string
        "User-Agent": "agriveda-soil-lookup",
      },
    });
    if (!res.ok) return null;
    const js = await res.json();

    const texture = searchForTextureString(js);
    if (texture) return mapTextureToOption(texture);
  } catch {
    // ignore
  }

  return null;
}

function searchForTextureString(obj: any): string | null {
  if (!obj) return null;

  const stack = [obj];
  while (stack.length) {
    const cur = stack.pop();

    if (typeof cur === "string") {
      if (looksLikeTexture(cur)) return cur;
      continue;
    }

    if (typeof cur === "object") {
      for (const key in cur) {
        const val = cur[key];
        if (typeof val === "string") {
          if (looksLikeTexture(val)) return val;
        } else if (typeof val === "object" && val) {
          stack.push(val);
        }
      }
    }
  }

  return null;
}

function looksLikeTexture(s: string) {
  const t = s.toLowerCase();
  return /sand|clay|loam|silt|peat|organic|black|red|alluvial/.test(t);
}

function mapTextureToOption(label: string) {
  const t = (label || "").toLowerCase();
  if (t.includes("loam")) return "loamy";
  if (t.includes("sand")) return "sandy";
  if (t.includes("clay")) return "clay";
  if (t.includes("silt")) return "silt";
  if (t.includes("black")) return "black";
  if (t.includes("red")) return "red";
  if (t.includes("alluvial")) return "alluvial";
  return DEFAULT_SOIL;
}

function normalizeSoil(raw: unknown): string | null {
  if (!raw || typeof raw !== "string") return null;
  const t = raw.toLowerCase().trim();

  const allowed = ["loamy", "sandy", "clay", "silt", "black", "red", "alluvial", "mixed"];
  if (allowed.includes(t)) return t;

  if (t.includes("loam")) return "loamy";
  if (t.includes("clay")) return "clay";
  if (t.includes("sand")) return "sandy";
  if (t.includes("silt")) return "silt";
  if (t.includes("alluvial")) return "alluvial";
  if (t.includes("black")) return "black";
  if (t.includes("red")) return "red";
  if (t.includes("laterite")) return "red";
  if (t.includes("peat") || t.includes("organic")) return "mixed";

  return DEFAULT_SOIL;
}

export interface SoilNutrients {
  nitrogen: "Low" | "Medium" | "High" | "Good";
  phosphorus: "Low" | "Medium" | "High" | "Good";
  potassium: "Low" | "Medium" | "High" | "Good";
}

export function getSoilNutrientsForLocation(lat: number, lon: number, soilType: string): SoilNutrients {
  const hash = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233) * 43758.5453);
  const val = hash - Math.floor(hash);

  const levels: Array<"Low" | "Medium" | "High" | "Good"> = ["Low", "Medium", "High", "Good"];

  let nIndex = 1;
  let pIndex = 1;
  let kIndex = 1;

  const st = soilType.toLowerCase();

  if (st.includes("black")) {
    nIndex = 1;
    pIndex = 0;
    kIndex = 2;
  } else if (st.includes("red")) {
    nIndex = 0;
    pIndex = 0;
    kIndex = 1;
  } else if (st.includes("alluvial") || st.includes("loam")) {
    nIndex = 2;
    pIndex = 2;
    kIndex = 2;
  } else if (st.includes("sandy")) {
    nIndex = 0;
    pIndex = 1;
    kIndex = 1;
  } else if (st.includes("clay")) {
    nIndex = 1;
    pIndex = 1;
    kIndex = 2;
  }

  const nVar = Math.floor((val * 100) % 3) - 1;
  const pVar = Math.floor((val * 1000) % 3) - 1;
  const kVar = Math.floor((val * 10000) % 3) - 1;

  nIndex = Math.max(0, Math.min(3, nIndex + nVar));
  pIndex = Math.max(0, Math.min(3, pIndex + pVar));
  kIndex = Math.max(0, Math.min(3, kIndex + kVar));

  return {
    nitrogen: levels[nIndex],
    phosphorus: levels[pIndex],
    potassium: levels[kIndex],
  };
}
