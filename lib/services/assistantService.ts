import { chatWithAgriBot } from "@/lib/ai/gemini";
import { getLocalTips } from "@/lib/services/tipsData";

export type AssistantMessage = { role: "user" | "assistant"; content: string };

export type AssistantChatResponse = {
  response: string;
};

function stripCodeFences(text: string): string {
  return text
    .replace(/```[a-z]*\n?/gi, "")
    .replace(/```/g, "")
    .trim();
}

function extractBullets(text: string): string[] {
  const cleaned = stripCodeFences(text);
  const lines = cleaned
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const bullets = lines
    .map((l) => l.replace(/^[-*•]\s+/, "").trim())
    .filter((l) => l.length > 0);

  // If the model answered in paragraphs, fall back to splitting by '.'
  if (bullets.length <= 2) {
    const parts = cleaned
      .split(/\.(\s+|$)/)
      .map((p) => p.trim())
      .filter((p) => p.length >= 10);
    return parts.slice(0, 10);
  }

  return bullets.slice(0, 12);
}

class AssistantService {
  async chat(message: string, history?: AssistantMessage[]): Promise<string> {
    const hist = (history || []).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
    const text = await chatWithAgriBot(message, hist as any);
    return stripCodeFences(text || "");
  }

  async getCultivationTips(params: {
    crop: string;
    category: string;
  }): Promise<string[]> {
    const crop = params.crop.trim();
    const category = params.category.trim();
    // Local fallback first to ensure UI always has data
    const local = getLocalTips(crop, category);

    try {
      const prompt =
        `You are an agronomy assistant. Provide practical cultivation tips for ${crop}. ` +
        `Category: ${category}. ` +
        `Return 8-12 short bullet points. Avoid long paragraphs.`;

      const text = await this.chat(prompt);
      const aiTips = extractBullets(text);
      // Merge AI tips with local, prefer local first, keep unique
      const seen = new Set<string>(local.map((t) => t.toLowerCase()));
      const merged = [...local];
      for (const tip of aiTips) {
        const k = tip.toLowerCase();
        if (!seen.has(k)) {
          merged.push(tip);
          seen.add(k);
        }
        if (merged.length >= 12) break;
      }
      return merged.length ? merged : local;
    } catch {
      return local.length ? local : [];
    }
  }

  async getDiseaseControlGuide(diseaseName: string): Promise<{
    introduction: string;
    symptoms: string[];
    immediateActions: string[];
    naturalControl: string[];
    chemicalControl: string[];
    prevention: string[];
  }> {
    const dn = diseaseName.trim();

    const prompt =
      `Create a concise farmer-friendly disease control guide for: ${dn}. ` +
      `Respond in JSON with keys: introduction (string), symptoms (string[]), immediateActions (string[]), ` +
      `naturalControl (string[]), chemicalControl (string[]), prevention (string[]). ` +
      `Keep arrays 4-8 items. Do not include markdown.`;

    const raw = await this.chat(prompt);

    try {
      const parsed = JSON.parse(raw);
      return {
        introduction: String(parsed.introduction || ""),
        symptoms: Array.isArray(parsed.symptoms)
          ? parsed.symptoms.map(String)
          : [],
        immediateActions: Array.isArray(parsed.immediateActions)
          ? parsed.immediateActions.map(String)
          : [],
        naturalControl: Array.isArray(parsed.naturalControl)
          ? parsed.naturalControl.map(String)
          : [],
        chemicalControl: Array.isArray(parsed.chemicalControl)
          ? parsed.chemicalControl.map(String)
          : [],
        prevention: Array.isArray(parsed.prevention)
          ? parsed.prevention.map(String)
          : [],
      };
    } catch {
      // Fallback: best-effort bullet extraction
      const bullets = extractBullets(raw);
      return {
        introduction: `Guide for ${dn}.`,
        symptoms: bullets.slice(0, 3),
        immediateActions: bullets.slice(3, 6),
        naturalControl: bullets.slice(6, 8),
        chemicalControl: [],
        prevention: [],
      };
    }
  }
}

export const assistantService = new AssistantService();
