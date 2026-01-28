import { apiRequest } from "@/lib/api/client";
import type { DiseaseHistoryItem, DiseasePredictResponse } from "@/lib/api/types";

class DiseaseService {
  async predictTest(imageBase64: string): Promise<DiseasePredictResponse> {
    const payload = {
      method: "POST",
      body: JSON.stringify({ image_base64: imageBase64 }),
    };

    try {
      return await apiRequest<DiseasePredictResponse>("/api/disease-detection/predict-test", payload);
    } catch (e: any) {
      // Backward-compat for older backend prefix
      return apiRequest<DiseasePredictResponse>("/api/disease/predict-test", payload);
    }
  }

  async getHistory(limit: number): Promise<DiseaseHistoryItem[]> {
    const opts = {
      method: "GET",
      auth: true,
      cacheKey: `diseaseHistory:limit:${limit}`,
      cacheTtlSeconds: 60 * 60 * 24, // 24 hours
    } as const;

    try {
      return await apiRequest<DiseaseHistoryItem[]>(`/api/disease-detection/history?limit=${limit}`, opts);
    } catch (e: any) {
      return apiRequest<DiseaseHistoryItem[]>(`/api/disease/history?limit=${limit}`, opts);
    }
  }
}

export const diseaseService = new DiseaseService();
