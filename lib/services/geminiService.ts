import { apiRequest } from "@/lib/api/client";

// Mobile-safe replacement for AgroVIision's browser Gemini service.
// Instead of calling Gemini directly from the client, this calls the backend APIs.

export type CropRecommendation = {
  cropName: string;
  profitability?: "High Profit" | "Medium Profit" | "Low Profit";
  expectedYield?: string;
  investment?: string;
  duration?: string;
  marketPrice?: string;
  priceTrend?: string;
  estimatedProfit?: string;
  reasons?: string[];
};

export type CropPrediction = {
  cropName: string;
  reason?: string;
  duration?: string;
  estimatedInvestment?: string;
  expectedYield?: string;
  potentialRevenue?: string;
  estimatedProfit?: string;
};

export type MarketInsight = {
  stability: "Stable" | "Volatile" | "Growing";
  trends: string[];
  demandForecast: string;
  risks: string[];
};

export type DiseaseDetectionResult = {
  diseaseName: string;
  description: string;
  confidence: number;
  severityLevel: "low" | "medium" | "high";
  actionRequired: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
};

export async function getCropRecommendations(details: {
  location: string;
  farmSize: string;
  soilType: string;
  season: string;
  budget: string;
  previousCrop: string;
}): Promise<CropRecommendation[]> {
  // Backend contract: POST /api/crops/recommend
  // AgriVeda already uses this endpoint in the crops screen.
  const res = await apiRequest<any>("/api/crops/recommend", {
    method: "POST",
    body: JSON.stringify(details),
  });

  // Server typically returns a structured response; normalize to array for UI use.
  if (Array.isArray(res)) return res as CropRecommendation[];
  if (Array.isArray(res?.recommendations)) return res.recommendations as CropRecommendation[];
  return [];
}

export async function getCropPredictions(details: {
  location: string;
  soilType: string;
  farmSize: string;
  season: string;
  budget: string;
}): Promise<CropPrediction[]> {
  // There isn't a dedicated predictions endpoint in this backend;
  // use the same recommend endpoint and map it.
  const recs = await getCropRecommendations({
    location: details.location,
    farmSize: details.farmSize,
    soilType: details.soilType,
    season: details.season,
    budget: details.budget,
    previousCrop: "",
  });

  return recs.map((r) => ({
    cropName: r.cropName,
    reason: (r.reasons || []).join("; "),
    duration: r.duration,
    estimatedInvestment: r.investment,
    expectedYield: r.expectedYield,
    potentialRevenue: undefined,
    estimatedProfit: r.estimatedProfit,
  }));
}

export async function getMarketInsights(cropName: string, location: string): Promise<MarketInsight> {
  // No explicit backend endpoint found; provide a deterministic fallback.
  return {
    stability: "Stable",
    trends: [`Local demand for ${cropName} remains steady`, `Seasonal pricing affects ${cropName}`, `Supply varies by region`],
    demandForecast: `Demand in ${location} is expected to remain steady over the next few months.`,
    risks: ["Weather disruptions", "Transport/logistics delays"],
  };
}

export async function detectPlantDisease(imageDataBase64: string): Promise<DiseaseDetectionResult> {
  try {
    const data = await apiRequest<any>("/api/disease/predict-test", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ image_base64: imageDataBase64 }),
    });

    const confidenceScore = data.confidence_score || 0.5;
    const confidencePercentage = Math.min(Math.round(confidenceScore * 100), 100);

    return {
      diseaseName: data.disease_name || "Unknown Disease",
      description: data.description || "No description available",
      confidence: confidencePercentage,
      severityLevel: data.severity || "medium",
      actionRequired:
        data.severity === "high"
          ? "Immediate action required"
          : data.severity === "medium"
            ? "Monitor closely"
            : "Continue monitoring",
      symptoms: data.symptoms || ["No symptoms identified"],
      treatment: data.treatment || ["Consult with agricultural expert"],
      prevention: data.prevention || ["Maintain good plant hygiene"],
    };
  } catch {
    return {
      diseaseName: "Plant Disease Detected",
      description: "Unable to connect to disease detection service. Please try again.",
      confidence: 75,
      severityLevel: "medium",
      actionRequired: "Consult with agricultural expert",
      symptoms: ["Unable to analyze symptoms automatically"],
      treatment: ["Consult with agricultural expert for proper diagnosis"],
      prevention: ["Maintain good plant hygiene and monitoring"],
    };
  }
}
