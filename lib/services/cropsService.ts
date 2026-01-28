import { apiRequest } from "@/lib/api/client";
import type { CropRecommendationRequest, CropRecommendationResponse } from "@/lib/api/types";

class CropsService {
  async recommend(payload: CropRecommendationRequest): Promise<CropRecommendationResponse> {
    return apiRequest<CropRecommendationResponse>("/api/crops/recommend", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  }
}

export const cropsService = new CropsService();
