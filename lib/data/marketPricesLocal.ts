import type { MarketPrice } from "@/lib/api/types";

const base: Array<Pick<MarketPrice, "crop_name" | "current_price" | "trend">> =
  [
    { crop_name: "Tomato", current_price: 45, trend: "up" },
    { crop_name: "Onion", current_price: 25, trend: "down" },
    { crop_name: "Potato", current_price: 20, trend: "up" },
    { crop_name: "Carrot", current_price: 30, trend: "up" },
    { crop_name: "Cabbage", current_price: 18, trend: "down" },
    { crop_name: "Cauliflower", current_price: 22, trend: "up" },
    { crop_name: "Brinjal", current_price: 28, trend: "stable" as any },
    { crop_name: "Okra", current_price: 35, trend: "up" },
    { crop_name: "Spinach", current_price: 15, trend: "down" },
    { crop_name: "Capsicum", current_price: 40, trend: "up" },
    { crop_name: "Cucumber", current_price: 25, trend: "stable" as any },
    { crop_name: "Radish", current_price: 20, trend: "up" },
    { crop_name: "Beetroot", current_price: 35, trend: "down" },
    { crop_name: "Mango", current_price: 80, trend: "up" },
    { crop_name: "Banana", current_price: 35, trend: "up" },
    { crop_name: "Apple", current_price: 120, trend: "down" },
    { crop_name: "Orange", current_price: 45, trend: "stable" as any },
    { crop_name: "Grapes", current_price: 60, trend: "up" },
    { crop_name: "Pomegranate", current_price: 90, trend: "down" },
    { crop_name: "Papaya", current_price: 25, trend: "up" },
    { crop_name: "Cotton", current_price: 6500, trend: "up" },
  ];

export function getMarketPrices(
  filterCrop?: string,
  limit = 30,
): MarketPrice[] {
  const q = (filterCrop || "").trim().toLowerCase();
  const list = base
    .filter((p) => (!q ? true : p.crop_name.toLowerCase().includes(q)))
    .slice(0, limit)
    .map((p, idx) => ({
      id: idx + 1,
      crop_name: p.crop_name,
      category: "vegetables",
      current_price: p.current_price,
      unit: "kg",
      market_location: "India",
      trend: p.trend as any,
      last_updated: new Date().toISOString(),
      min_price: null,
      max_price: null,
      avg_price: null,
      market_insights: null,
      is_verified: true,
    }));
  return list;
}
