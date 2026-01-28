import { apiRequest } from "@/lib/api/client";
import type { MarketPrice, MarketStats, PriceTrend } from "@/lib/services/marketPricesService";

export enum ConnectionState {
  CONNECTED = "connected",
  CONNECTING = "connecting",
  DISCONNECTED = "disconnected",
  ERROR = "error",
  DEGRADED = "degraded",
}

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeCacheKey(prefix: string, params?: Record<string, unknown>) {
  return `${prefix}:${JSON.stringify(params || {})}`;
}

class MarketPricesConnectionService {
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private cache = new Map<string, CacheEntry<any>>();

  private cacheTtlMs = 5 * 60 * 1000; // 5 minutes

  getState() {
    return this.connectionState;
  }

  private setState(next: ConnectionState) {
    this.connectionState = next;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl = this.cacheTtlMs) {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  private async fetchWithRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        this.setState(ConnectionState.CONNECTING);
        const res = await fn();
        this.setState(ConnectionState.CONNECTED);
        return res;
      } catch (e) {
        lastError = e;
        this.setState(ConnectionState.DEGRADED);
        if (attempt < retries) {
          await sleep(500 * Math.pow(2, attempt));
          continue;
        }
      }
    }

    this.setState(ConnectionState.ERROR);
    throw lastError as Error;
  }

  async fetchMarketPrices(params?: {
    category?: string;
    location?: string;
    limit?: number;
    verified_only?: boolean;
  }): Promise<MarketPrice[]> {
    const key = makeCacheKey("market_prices", params);
    const cached = this.getFromCache<MarketPrice[]>(key);
    if (cached) return cached;

    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append("category", params.category);
    if (params?.location) searchParams.append("location", params.location);
    if (params?.limit != null) searchParams.append("limit", String(params.limit));
    if (params?.verified_only != null) searchParams.append("verified_only", String(params.verified_only));

    const qs = searchParams.toString();
    const path = qs ? `/api/market-prices/prices?${qs}` : "/api/market-prices/prices";

    const result = await this.fetchWithRetry(() => apiRequest<MarketPrice[]>(path));
    this.setCache(key, result);
    return result;
  }

  async fetchPriceTrends(params?: { crop_name?: string; days?: number }): Promise<PriceTrend[]> {
    const key = makeCacheKey("price_trends", params);
    const cached = this.getFromCache<PriceTrend[]>(key);
    if (cached) return cached;

    const searchParams = new URLSearchParams();
    if (params?.crop_name) searchParams.append("crop_name", params.crop_name);
    if (params?.days != null) searchParams.append("days", String(params.days));

    const qs = searchParams.toString();
    const path = qs ? `/api/market-prices/trends?${qs}` : "/api/market-prices/trends";

    const result = await this.fetchWithRetry(() => apiRequest<PriceTrend[]>(path));
    this.setCache(key, result);
    return result;
  }

  async fetchMarketStats(): Promise<MarketStats> {
    const key = "market_stats";
    const cached = this.getFromCache<MarketStats>(key);
    if (cached) return cached;

    const result = await this.fetchWithRetry(() => apiRequest<MarketStats>("/api/market-prices/prices/stats/summary"));
    this.setCache(key, result);
    return result;
  }

  async searchCrops(searchTerm: string, params?: { category?: string; location?: string; limit?: number }): Promise<MarketPrice[]> {
    const key = makeCacheKey("search", { searchTerm, ...(params || {}) });
    const cached = this.getFromCache<MarketPrice[]>(key);
    if (cached) return cached;

    const searchParams = new URLSearchParams();
    searchParams.append("q", searchTerm);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.location) searchParams.append("location", params.location);
    if (params?.limit != null) searchParams.append("limit", String(params.limit));

    const path = `/api/market-prices/search?${searchParams.toString()}`;
    const result = await this.fetchWithRetry(() => apiRequest<MarketPrice[]>(path));
    this.setCache(key, result);
    return result;
  }
}

const marketPricesConnectionService = new MarketPricesConnectionService();
export default marketPricesConnectionService;
