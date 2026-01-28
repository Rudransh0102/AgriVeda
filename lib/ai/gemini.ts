import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
export const isGeminiConfigured = () => !!API_KEY && API_KEY.length > 10;
const genAI = new GoogleGenerativeAI(API_KEY);

// Use '-latest' suffixed IDs; flash is fastest
const MODEL_ID = process.env.EXPO_PUBLIC_GEMINI_MODEL || "gemini-1.5-flash-latest";
const model = genAI.getGenerativeModel({ model: MODEL_ID });

/**
 * Feature 1: The Agri-Chatbot
 */
export async function chatWithAgriBot(message: string, history: any[] = []) {
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are 'Krishi Sakha', an expert Indian agricultural consultant. Answer in short, simple English mixed with Hindi terms (like 'Jugaad', 'Upaj'). Keep answers practical for rural farmers.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Ram Ram! I am ready to help you with your farming queries.",
            },
          ],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Chat Error:", error);
    return "Network issue. Please check internet connection.";
  }
}

/**
 * Feature 2: Smart Crop Recommendation
 * Returns structured JSON for your UI to render Cards.
 */
export async function getCropRecommendation(
  location: string,
  month: string,
  soil: string,
) {
  const prompt = `
    Suggest 3 best crops to grow in ${location} during ${month} with ${soil} soil.
    Return ONLY a JSON array with this structure (no markdown):
    [
      {
        "name": "Crop Name",
        "duration": "X months",
        "profit": "High/Medium",
        "reason": "Why it fits"
      }
    ]
  `;

  try {
    if (!isGeminiConfigured()) {
      throw new Error("Gemini API key missing");
    }
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean markdown if Gemini adds it
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Rec Error:", error);
    return []; // Return empty array on fail
  }
}

/**
 * Feature 3: Cultivation Tips (Enriching the Disease Library)
 */
export async function getCultivationTips(cropName: string) {
  const prompt = `Give me 3 short, bullet-point cultivation tips for ${cropName} to maximize yield in India.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
