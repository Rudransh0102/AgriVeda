export interface CropDisease {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  symptoms: string[];
  treatment: string[];
  severity: "low" | "medium" | "high";
  affectedCrops: string[];
}

export interface ScanResult {
  id: string;
  imageUri: string;
  disease: CropDisease | null;
  confidence: number;
  timestamp: Date;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  farmSize?: number;
  crops?: string[];
}
