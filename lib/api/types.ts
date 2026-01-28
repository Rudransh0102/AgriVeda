export type TokenResponse = {
  access_token: string;
  token_type: "bearer" | string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  location?: string | null;
  farm_size?: string | null;
  is_active?: boolean;
  created_at?: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  location?: string;
  farm_size?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type WeatherResponse = {
  weather: any;
  farming_recommendations: any;
};

export type DiseasePredictResponse = {
  disease_name: string;
  confidence_score: number;
  severity: "low" | "medium" | "high" | string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  description?: string;
};

export type DiseaseHistoryItem = {
  id: number;
  crop_type: string;
  disease_name?: string | null;
  confidence_score?: number | null;
  severity?: string | null;
  symptoms?: string[] | null;
  treatment?: string[] | null;
  prevention?: string[] | null;
  description?: string | null;
  is_verified: boolean;
  expert_comment?: string | null;
  created_at: string;
};

export type MarketplaceProduct = {
  id: number;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  unit?: string | null;
  stock_quantity: number;
  location?: string | null;
  is_organic?: boolean;
  created_at?: string;
};

export type EquipmentItem = {
  id: number;
  name: string;
  description?: string | null;
  type: string;
  price_per_day: number;
  location?: string | null;
  is_available: boolean;
  created_at?: string;
};

export type GovernmentScheme = {
  id: number;
  name: string;
  description?: string;
  eligibility_criteria?: string;
  benefits?: string;
  subsidy_percentage?: number | null;
  category?: string;
  sector?: string;
  applicable_states?: string[];
  applicable_crops?: string[];
  website_url?: string | null;
  official_apply_url?: string | null;
  is_new?: boolean;
  expiry_date?: string | null;
};

export type CropRecommendationRequest = {
  location: string;
  soil_type?: string;
  farm_size?: number;
  budget?: number;
  season?: string;
  previous_crop?: string;
};

export type CropRecommendationResponse = {
  id: number;
  location: string;
  soil_type?: string | null;
  farm_size?: number | null;
  budget?: number | null;
  season?: string | null;
  previous_crop?: string | null;
  recommended_crops: any;
  weather_data: any;
  created_at?: string;
};

export type MarketPrice = {
  id: number;
  crop_name: string;
  category: string;
  current_price: number;
  unit: string;
  market_location: string;
  trend?: string | null;
  last_updated?: string;
  min_price?: number | null;
  max_price?: number | null;
  avg_price?: number | null;
  market_insights?: string | null;
  is_verified?: boolean;
};
