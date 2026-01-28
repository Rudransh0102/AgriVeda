import * as SQLite from "expo-sqlite";

const DB_NAME = "agriveda.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

export async function initOfflineDb() {
  const db = await getDb();

  // Schema (idempotent)
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS api_cache (
      key TEXT PRIMARY KEY NOT NULL,
      json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      ttl_seconds INTEGER
    );

    CREATE TABLE IF NOT EXISTS scan_history (
      id TEXT PRIMARY KEY NOT NULL,
      user_id INTEGER,
      created_at INTEGER NOT NULL,
      image_uri TEXT,
      crop_type TEXT,
      disease_name TEXT,
      confidence_score REAL,
      severity TEXT,
      health TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON scan_history(created_at);
    CREATE INDEX IF NOT EXISTS idx_scan_history_synced ON scan_history(synced);
  `);
}

export type ApiCacheEntry = {
  key: string;
  json: string;
  updatedAt: number;
  ttlSeconds: number | null;
};

export async function getApiCache(key: string): Promise<ApiCacheEntry | null> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    "SELECT key, json, updated_at, ttl_seconds FROM api_cache WHERE key = ? LIMIT 1",
    [key],
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    key: r.key,
    json: r.json,
    updatedAt: Number(r.updated_at),
    ttlSeconds: r.ttl_seconds == null ? null : Number(r.ttl_seconds),
  };
}

export async function setApiCache(params: {
  key: string;
  json: string;
  ttlSeconds?: number | null;
  updatedAt?: number;
}) {
  const db = await getDb();
  const updatedAt = params.updatedAt ?? Date.now();
  const ttlSeconds = params.ttlSeconds ?? null;

  await db.runAsync(
    "INSERT INTO api_cache(key, json, updated_at, ttl_seconds) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at, ttl_seconds=excluded.ttl_seconds",
    [params.key, params.json, updatedAt, ttlSeconds],
  );
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

export async function insertLocalScan(item: Omit<LocalScanHistoryItem, "synced"> & { synced?: boolean }) {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO scan_history(
      id, user_id, created_at, image_uri, crop_type, disease_name, confidence_score, severity, health, synced
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ,
    [
      item.id,
      item.userId,
      item.createdAt,
      item.imageUri,
      item.cropType,
      item.diseaseName,
      item.confidenceScore,
      item.severity,
      item.health,
      item.synced ? 1 : 0,
    ],
  );
}

export async function listLocalScans(limit: number = 50): Promise<LocalScanHistoryItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    "SELECT id, user_id, created_at, image_uri, crop_type, disease_name, confidence_score, severity, health, synced FROM scan_history ORDER BY created_at DESC LIMIT ?",
    [limit],
  );

  return rows.map((r) => ({
    id: String(r.id),
    userId: r.user_id == null ? null : Number(r.user_id),
    createdAt: Number(r.created_at),
    imageUri: r.image_uri == null ? null : String(r.image_uri),
    cropType: r.crop_type == null ? null : String(r.crop_type),
    diseaseName: r.disease_name == null ? null : String(r.disease_name),
    confidenceScore: r.confidence_score == null ? null : Number(r.confidence_score),
    severity: r.severity == null ? null : String(r.severity),
    health: r.health == null ? null : String(r.health),
    synced: Number(r.synced) === 1,
  }));
}

export async function listPendingLocalScans(userId: number): Promise<LocalScanHistoryItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    "SELECT id, user_id, created_at, image_uri, crop_type, disease_name, confidence_score, severity, health, synced FROM scan_history WHERE synced = 0 AND (user_id = ? OR user_id IS NULL) ORDER BY created_at ASC",
    [userId],
  );

  return rows.map((r) => ({
    id: String(r.id),
    userId: r.user_id == null ? null : Number(r.user_id),
    createdAt: Number(r.created_at),
    imageUri: r.image_uri == null ? null : String(r.image_uri),
    cropType: r.crop_type == null ? null : String(r.crop_type),
    diseaseName: r.disease_name == null ? null : String(r.disease_name),
    confidenceScore: r.confidence_score == null ? null : Number(r.confidence_score),
    severity: r.severity == null ? null : String(r.severity),
    health: r.health == null ? null : String(r.health),
    synced: Number(r.synced) === 1,
  }));
}

export async function claimAnonymousLocalScans(userId: number) {
  const db = await getDb();
  await db.runAsync(
    "UPDATE scan_history SET user_id = ? WHERE user_id IS NULL AND synced = 0",
    [userId],
  );
}

export async function markLocalScanSynced(id: string) {
  const db = await getDb();
  await db.runAsync("UPDATE scan_history SET synced = 1 WHERE id = ?", [id]);
}
