import { apiRequest } from "@/lib/api/client";
import type { EquipmentItem } from "@/lib/api/types";

class EquipmentService {
  async listEquipment(params?: { limit?: number; location?: string }): Promise<EquipmentItem[]> {
    const limit = params?.limit ?? 20;
    const location = params?.location?.trim();

    const qs = new URLSearchParams();
    qs.set("limit", String(limit));
    if (location) qs.set("location", location);

    const key = `equipment:list:${qs.toString()}`;
    return apiRequest<EquipmentItem[]>(`/api/equipment/equipment?${qs.toString()}`, {
      cacheKey: key,
      cacheTtlSeconds: 60 * 60 * 24, // 24 hours
    });
  }
}

export const equipmentService = new EquipmentService();
