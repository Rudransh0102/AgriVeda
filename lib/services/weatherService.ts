import { apiRequest } from "@/lib/api/client";
import type { WeatherResponse } from "@/lib/api/types";

type OpenMeteoGeocodingResponse = {
  results?: Array<{ name: string; latitude: number; longitude: number; country?: string; admin1?: string }>;
};

type OpenMeteoForecastResponse = {
  current?: {
    time: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
};

function buildFarmingSummary(tempC: number | null, humidityPct: number | null): string {
  const parts: string[] = [];

  if (tempC == null) {
    parts.push("Check local conditions before field work.");
  } else if (tempC >= 35) {
    parts.push("High heat: irrigate early/late and avoid midday spraying.");
  } else if (tempC <= 10) {
    parts.push("Cool weather: watch for slow growth and fungal risk.");
  } else {
    parts.push("Moderate temperature: good window for routine farm operations.");
  }

  if (humidityPct != null) {
    if (humidityPct >= 80) parts.push("High humidity: monitor for fungal diseases.");
    else if (humidityPct <= 30) parts.push("Low humidity: consider irrigation/mulching.");
  }

  return parts.join(" ");
}

class WeatherService {
  async getCurrent(city: string): Promise<WeatherResponse> {
    const q = city.trim();
    if (!q) throw new Error("City is required");

    // Prefer backend (it can add richer farming recommendations)
    try {
      const key = `weather:current:${encodeURIComponent(q.toLowerCase())}`;
      return await apiRequest<WeatherResponse>(`/api/weather/current/${encodeURIComponent(q)}`, {
        cacheKey: key,
        cacheTtlSeconds: 60 * 10, // 10 minutes
      });
    } catch {
      // Fallback to free Open-Meteo APIs (no key)
      return this.getCurrentViaOpenMeteo(q);
    }
  }

  private async getCurrentViaOpenMeteo(city: string): Promise<WeatherResponse> {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Failed to geocode city");
    const geo = (await geoRes.json()) as OpenMeteoGeocodingResponse;
    const hit = geo.results?.[0];
    if (!hit) throw new Error("City not found");

    const forecastUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${hit.latitude}` +
      `&longitude=${hit.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&timezone=auto`;

    const wxRes = await fetch(forecastUrl);
    if (!wxRes.ok) throw new Error("Failed to fetch weather");
    const wx = (await wxRes.json()) as OpenMeteoForecastResponse;

    const temp = typeof wx.current?.temperature_2m === "number" ? wx.current.temperature_2m : null;
    const humidity = typeof wx.current?.relative_humidity_2m === "number" ? wx.current.relative_humidity_2m : null;

    return {
      weather: {
        source: "open-meteo",
        name: [hit.name, hit.admin1, hit.country].filter(Boolean).join(", "),
        main: {
          temp,
          humidity,
        },
        wind: {
          speed: wx.current?.wind_speed_10m ?? null,
        },
        dt: wx.current?.time ?? null,
        weather_code: wx.current?.weather_code ?? null,
      },
      farming_recommendations: {
        summary: buildFarmingSummary(temp, humidity),
      },
    };
  }
}

export const weatherService = new WeatherService();
