import * as Linking from "expo-linking";

import { apiRequest } from "@/lib/api/client";

// Mobile adaptation of AgroVIision's governmentSchemesService
// - Uses apiRequest() (AsyncStorage token support)
// - Uses Linking.openURL instead of window.open

export interface GovernmentScheme {
  id: number;
  name: string;
  description: string;
  eligibility_criteria: string;
  benefits: string;
  subsidy_percentage: string;
  category: string;
  sector: string;
  applicable_states: string[];
  applicable_crops: string[];
  application_process: string;
  required_documents: string[];
  contact_info: Record<string, string>;
  website_url: string;
  official_apply_url: string;
  is_active: boolean;
  is_new: boolean;
  expiry_date: string;
  created_at: string;
  last_refreshed: string;
}

export interface RefreshStatus {
  last_refresh: string | null;
  next_refresh: string | null;
  status: string;
  new_schemes?: number;
  updated_schemes?: number;
  error_message?: string;
}

export interface NewScheme {
  id: number;
  name: string;
  description: string;
  category: string;
  benefits: string;
  subsidy_percentage: string;
  official_apply_url: string;
  created_at: string;
}

class GovernmentSchemesService {
  private async makeRequest<T>(
    endpoint: string,
    options: (RequestInit & { auth?: boolean }) & { cacheKey?: string; cacheTtlSeconds?: number } = {},
  ): Promise<T> {
    try {
      return await apiRequest<T>(`/api/schemes${endpoint}`, options as any);
    } catch (error) {
      // Return fallback data for schemes if API fails
      if (endpoint === "/" || endpoint.startsWith("/schemes") || endpoint === "") {
        return this.getFallbackSchemes() as T;
      }
      throw error;
    }
  }

  private getFallbackSchemes(): GovernmentScheme[] {
    return [
      {
        id: 1,
        name: "PM-KISAN Samman Nidhi Yojana",
        description: "Direct income support to farmers providing ₹6000 per year in three installments",
        eligibility_criteria: "Small and marginal farmers with landholding up to 2 hectares",
        benefits: "₹6,000 per year",
        subsidy_percentage: "100%",
        category: "Direct Benefit Transfer",
        sector: "Government",
        applicable_states: ["All India"],
        applicable_crops: ["All Crops"],
        application_process: "Online application through PM-KISAN portal",
        required_documents: ["Aadhaar Card", "Land Documents", "Bank Account Details"],
        contact_info: { phone: "1800-180-1551", email: "pmkisan@gov.in" },
        website_url: "https://pmkisan.gov.in",
        official_apply_url: "https://pmkisan.gov.in/NewRegistration.aspx",
        is_active: true,
        is_new: false,
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        last_refreshed: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Pradhan Mantri Fasal Bima Yojana",
        description: "Crop insurance scheme providing financial support against crop loss",
        eligibility_criteria: "All farmers growing notified crops in notified areas",
        benefits: "Up to ₹2 lakh coverage",
        subsidy_percentage: "Premium subsidy up to 50%",
        category: "Insurance",
        sector: "Government",
        applicable_states: ["All India"],
        applicable_crops: ["Rice", "Wheat", "Cotton", "Sugarcane"],
        application_process: "Apply through insurance companies",
        required_documents: ["Aadhaar Card", "Land Documents", "Crop Details"],
        contact_info: { phone: "1800-180-1552", email: "fasalbima@gov.in" },
        website_url: "https://fasalbima.gov.in",
        official_apply_url: "https://fasalbima.gov.in/apply",
        is_active: true,
        is_new: false,
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        last_refreshed: new Date().toISOString(),
      },
    ];
  }

  async listSchemes(params?: {
    category?: string;
    state?: string;
    crop?: string;
    sector?: string;
    active_only?: boolean;
  }): Promise<GovernmentScheme[]> {
    const searchParams = new URLSearchParams();

    if (params?.category) searchParams.append("category", params.category);
    if (params?.state) searchParams.append("state", params.state);
    if (params?.crop) searchParams.append("crop", params.crop);
    if (params?.sector) searchParams.append("sector", params.sector);
    if (params?.active_only !== undefined) searchParams.append("active_only", params.active_only.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/?${queryString}` : "/";

    const key = `schemes:list:${queryString || 'all'}`;
    return this.makeRequest<GovernmentScheme[]>(endpoint, {
      cacheKey: key,
      cacheTtlSeconds: 60 * 60 * 24, // 24 hours
    });
  }

  async getSchemeById(schemeId: number): Promise<GovernmentScheme> {
    return this.makeRequest<GovernmentScheme>(`/schemes/${schemeId}`);
  }

  async applyToScheme(schemeId: number, payload: Record<string, unknown> = {}): Promise<{ status: string; message: string } | any> {
    return this.makeRequest(`/schemes/${schemeId}/apply`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  }

  async getCategories(): Promise<{ categories: Array<{ id: string; name: string }> }> {
    try {
      return await this.makeRequest<{ categories: Array<{ id: string; name: string }> }>("/categories");
    } catch {
      return {
        categories: [
          { id: "Direct Benefit Transfer", name: "Direct Benefit Transfer" },
          { id: "Insurance", name: "Insurance" },
          { id: "Credit/Loan", name: "Credit/Loan" },
          { id: "Equipment", name: "Equipment" },
          { id: "Soil Management", name: "Soil Management" },
          { id: "Sustainable Agriculture", name: "Sustainable Agriculture" },
          { id: "Digital Agriculture", name: "Digital Agriculture" },
        ],
      };
    }
  }

  async getStates(): Promise<{ states: string[] }> {
    try {
      return await this.makeRequest<{ states: string[] }>("/states");
    } catch {
      return {
        states: [
          "All India",
          "Andhra Pradesh",
          "Arunachal Pradesh",
          "Assam",
          "Bihar",
          "Chhattisgarh",
          "Goa",
          "Gujarat",
          "Haryana",
          "Himachal Pradesh",
          "Jharkhand",
          "Karnataka",
          "Kerala",
          "Madhya Pradesh",
          "Maharashtra",
          "Manipur",
          "Meghalaya",
          "Mizoram",
          "Nagaland",
          "Odisha",
          "Punjab",
          "Rajasthan",
          "Sikkim",
          "Tamil Nadu",
          "Telangana",
          "Tripura",
          "Uttar Pradesh",
          "Uttarakhand",
          "West Bengal",
        ],
      };
    }
  }

  async openUrl(url: string): Promise<void> {
    if (!url) return;
    await Linking.openURL(url);
  }

  openOfficialSite(url: string): Promise<void> {
    return this.openUrl(url);
  }

  openApplySite(url: string): Promise<void> {
    return this.openUrl(url);
  }
}

export const governmentSchemesService = new GovernmentSchemesService();
