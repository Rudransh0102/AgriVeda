import { apiRequest } from "@/lib/api/client";
import type { MarketplaceProduct } from "@/lib/api/types";

class MarketplaceService {
  async listProducts(params?: { limit?: number; location?: string }): Promise<MarketplaceProduct[]> {
    const limit = params?.limit ?? 20;
    const location = params?.location?.trim();

    const qs = new URLSearchParams();
    qs.set("limit", String(limit));
    if (location) qs.set("location", location);

    const key = `marketplace:products:${qs.toString()}`;
    return apiRequest<MarketplaceProduct[]>(`/api/marketplace/products?${qs.toString()}`, {
      cacheKey: key,
      cacheTtlSeconds: 60 * 30, // 30 minutes
    });
  }
}

export const marketplaceService = new MarketplaceService();
