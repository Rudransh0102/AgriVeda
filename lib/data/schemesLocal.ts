import type { GovernmentScheme } from "@/lib/api/types";

export const schemesLocal: GovernmentScheme[] = [
  {
    id: 1,
    name: "Digital Agriculture Mission 2024",
    description:
      "Promoting digital technologies in agriculture for better productivity",
    eligibility_criteria: "Farmers with smartphone and internet access",
    benefits: "Up to ₹25,000 for digital tools and training",
    subsidy_percentage: 75,
    category: "Digital Agriculture",
    sector: "Government",
    applicable_states: ["All India"],
    applicable_crops: ["All Crops"],
    website_url: "https://digitalagriculture.gov.in",
    official_apply_url: "https://digitalagriculture.gov.in/apply",
    is_new: true,
  },
  {
    id: 2,
    name: "Climate Smart Agriculture Initiative",
    description:
      "Supporting farmers in adopting climate-resilient agricultural practices",
    eligibility_criteria: "Farmers in climate-vulnerable regions",
    benefits: "Up to ₹50,000 per hectare for climate adaptation measures",
    subsidy_percentage: 80,
    category: "Sustainable Agriculture",
    sector: "Government",
    applicable_states: ["Maharashtra", "Karnataka", "Tamil Nadu", "Rajasthan"],
    applicable_crops: ["Millets", "Pulses", "Oilseeds"],
    website_url: "https://climateagriculture.gov.in",
    official_apply_url: "https://climateagriculture.gov.in/apply",
    is_new: true,
  },
  {
    id: 3,
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description:
      "Subsidies for micro-irrigation systems like drip and sprinkler irrigation",
    eligibility_criteria: "Farmers with own land and water source",
    benefits: "Subsidy for drip/sprinkler systems",
    subsidy_percentage: 55,
    category: "Equipment",
    sector: "Government",
    applicable_states: ["All India"],
    applicable_crops: ["Horticulture Crops", "Sugarcane", "Cotton"],
    website_url: "https://pmksy.gov.in",
    official_apply_url: "https://pmksy.gov.in/",
  },
  {
    id: 4,
    name: "Mahindra Krish-e Rental",
    description:
      "Equipment rental services for advanced machinery at affordable rates",
    eligibility_criteria: "Any farmer requiring machinery",
    benefits: "Access to high-tech machinery without ownership cost",
    subsidy_percentage: null,
    category: "Equipment",
    sector: "Private",
    applicable_states: ["Maharashtra", "Gujarat", "Karnataka", "Telangana"],
    applicable_crops: ["All Crops"],
    website_url: "https://www.krishe.co.in/",
    official_apply_url: "https://www.krishe.co.in/rental",
  },
];

export function getSchemes(): GovernmentScheme[] {
  return schemesLocal;
}
