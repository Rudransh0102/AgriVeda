import { apiRequest } from "@/lib/api/client";
import marketPricesConnectionService from "@/lib/services/marketPricesConnectionService";

export interface MarketPrice {
  id: number;
  crop_name: string;
  category: string;
  current_price: number;
  previous_price?: number;
  price_change?: number;
  price_change_amount?: number;
  unit: string;
  market_location: string;
  market_type: string;
  quality_grade: string;
  trend?: string;
  status: string;
  source?: string;
  last_updated: string;
  min_price?: number;
  max_price?: number;
  avg_price?: number;
  demand_level?: string;
  supply_level?: string;
  market_insights?: string;
  is_verified: boolean;
}

export interface PriceTrend {
  crop_name: string;
  current_price: number;
  trend: string;
  change_percentage: number;
  location: string;
  last_updated: string;
}

export interface PriceAlert {
  id: number;
  crop_name: string;
  alert_type: string;
  target_price: number;
  current_price?: number;
  is_active: boolean;
  created_at: string;
  triggered_at?: string;
}

export interface MarketStats {
  total_crops: number;
  verified_prices: number;
  trends: {
    up: number;
    down: number;
    stable: number;
  };
  last_updated: string;
}

class MarketPricesService {
  async getPricesForCropName(cropName: string): Promise<MarketPrice[]> {
    const q = cropName.trim();
    if (!q) return [];
    const key = `marketPrices:crop:${encodeURIComponent(q.toLowerCase())}`;
    return apiRequest<MarketPrice[]>(`/api/market-prices/prices/${encodeURIComponent(q)}`,
      {
        cacheKey: key,
        cacheTtlSeconds: 60 * 15, // 15 minutes
      },
    );
  }

  async getPrices(params?: { category?: string; location?: string; limit?: number; verified_only?: boolean }): Promise<MarketPrice[]> {
    try {
      return await marketPricesConnectionService.fetchMarketPrices(params);
    } catch {
      return this.getFallbackMarketPrices();
    }
  }

  async getTrends(params?: { crop_name?: string; days?: number }): Promise<PriceTrend[]> {
    return marketPricesConnectionService.fetchPriceTrends(params);
  }

  async getStats(): Promise<MarketStats> {
    return marketPricesConnectionService.fetchMarketStats();
  }

  async getPriceAlerts(): Promise<PriceAlert[]> {
    return apiRequest<PriceAlert[]>("/api/market-prices/alerts", { auth: true });
  }

  async createPriceAlert(alert: Omit<PriceAlert, "id" | "created_at" | "triggered_at" | "current_price">): Promise<PriceAlert> {
    return apiRequest<PriceAlert>("/api/market-prices/alerts", {
      method: "POST",
      auth: true,
      body: JSON.stringify(alert),
    });
  }

  private getFallbackMarketPrices(): MarketPrice[] {
    return [
      {
        id: 1,
        crop_name: "Tomato",
        category: "vegetables",
        current_price: 45,
        previous_price: 42,
        price_change: 7.1,
        price_change_amount: 3,
        unit: "kg",
        market_location: "Mumbai",
        market_type: "wholesale",
        quality_grade: "A",
        trend: "up",
        status: "active",
        source: "fallback",
        last_updated: new Date().toISOString(),
        is_verified: false,
      },
      {
        id: 2,
        crop_name: "Onion",
        category: "vegetables",
        current_price: 25,
        previous_price: 28,
        price_change: -10.7,
        price_change_amount: -3,
        unit: "kg",
        market_location: "Delhi",
        market_type: "wholesale",
        quality_grade: "A",
        trend: "down",
        status: "active",
        source: "fallback",
        last_updated: new Date().toISOString(),
        is_verified: false,
      },
    ];
  }
}

export const marketPricesService = new MarketPricesService();
