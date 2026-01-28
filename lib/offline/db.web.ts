// Web fallback: keep a minimal in-memory/localStorage cache.

export type ApiCacheEntry = {
  key: string;
  json: string;
  updatedAt: number;
  ttlSeconds: number | null;
};

const API_PREFIX = "agriveda.apiCache:";

export async function initOfflineDb() {
  // no-op on web
}

export async function getApiCache(key: string): Promise<ApiCacheEntry | null> {
  try {
    const raw = globalThis.localStorage?.getItem(API_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as ApiCacheEntry;
  } catch {
    return null;
  }
}

export async function setApiCache(params: {
  key: string;
  json: string;
  ttlSeconds?: number | null;
  updatedAt?: number;
}) {
  try {
    const entry: ApiCacheEntry = {
      key: params.key,
      json: params.json,
      updatedAt: params.updatedAt ?? Date.now(),
      ttlSeconds: params.ttlSeconds ?? null,
    };
    globalThis.localStorage?.setItem(API_PREFIX + params.key, JSON.stringify(entry));
  } catch {
    // ignore
  }
}

export function isCacheExpired(entry: ApiCacheEntry, nowMs: number = Date.now()): boolean {
  if (entry.ttlSeconds == null) return false;
  return nowMs - entry.updatedAt > entry.ttlSeconds * 1000;
}

export type LocalScanHistoryItem = {
  id: string;
  userId: number | null;
  createdAt: number;
  imageUri: string | null;
  cropType: string | null;
  diseaseName: string | null;
  confidenceScore: number | null;
  severity: string | null;
  health: string | null;
  synced: boolean;
};

// For hackathon scope: store scan history in memory only on web.
let scans: LocalScanHistoryItem[] = [];

export async function insertLocalScan(item: Omit<LocalScanHistoryItem, "synced"> & { synced?: boolean }) {
  scans = [
    {
      ...item,
      synced: Boolean(item.synced),
    },
    ...scans.filter((s) => s.id !== item.id),
  ];
}

export async function listLocalScans(limit: number = 50): Promise<LocalScanHistoryItem[]> {
  return scans.slice(0, limit);
}

export async function listPendingLocalScans(_userId: number): Promise<LocalScanHistoryItem[]> {
  return scans.filter((s) => !s.synced);
}

export async function markLocalScanSynced(id: string) {
  scans = scans.map((s) => (s.id === id ? { ...s, synced: true } : s));
}

export async function claimAnonymousLocalScans(_userId: number) {
  // no-op on web
}
