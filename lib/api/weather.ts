import * as Location from "expo-location";

export type GeoCoords = Location.LocationObjectCoords;

export async function getUserGeoLocation(): Promise<GeoCoords | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return position.coords;
}

function formatAreaName(place: Location.LocationGeocodedAddress) {
  const cityLike =
    place.city || place.subregion || place.district || place.name;
  const stateLike = place.region; // e.g. Maharashtra
  const parts = [cityLike, stateLike].filter(Boolean);
  return parts.join(", ");
}

export async function getUserAreaName(): Promise<string | null> {
  const coords = await getUserGeoLocation();
  if (!coords) return null;

  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    const place = results?.[0];
    if (!place) return null;

    return formatAreaName(place) || null;
  } catch {
    // reverse geocode can fail offline
    return null;
  }
}

export async function getFarmWeather() {
  const fallback = {
    temp: "30°C",
    rain: "0 mm",
    soil: "0.18 m³/m³",
    rainChance: "20%",
    location: "Your Farm",
    coords: null as GeoCoords | null,
  };

  try {
    const coords = await getUserGeoLocation();

    const lat = coords?.latitude ?? 19.9;
    const lon = coords?.longitude ?? 72.9;

    const areaName = coords ? await getUserAreaName() : null;

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,rain,soil_moisture_0_to_1cm` +
      `&daily=precipitation_probability_max` +
      `&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API failed");
    const data = await res.json();

    const temp = data.current?.temperature_2m ?? 30;
    const rain = data.current?.rain ?? 0;
    const soil = data.current?.soil_moisture_0_to_1cm ?? 0.18;
    const rainChance = data.daily?.precipitation_probability_max?.[0] ?? 20;

    return {
      temp: `${Number(temp).toFixed(1)}°C`,
      rain: `${rain} mm`,
      soil: `${Number(soil).toFixed(2)} m³/m³`,
      rainChance: `${rainChance}%`,
      location: areaName || "Your Farm",
      coords: coords ?? null,
    };
  } catch (error) {
    console.error("Weather fetch error:", error);
    return fallback;
  }
}

export async function getCityWeather(city: string) {
  const trimmed = city.trim();
  if (!trimmed) throw new Error("City is required");

  // Geocode city to lat/lon using Open-Meteo geocoding
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) throw new Error("Geocoding failed");
  const geo = await geoRes.json();
  const first = geo?.results?.[0];
  if (!first) throw new Error("City not found");
  const lat = first.latitude;
  const lon = first.longitude;

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather API failed");
  const data = await res.json();

  const temp = data.current?.temperature_2m ?? null;
  const humidity = data.current?.relative_humidity_2m ?? null;

  const farming_recommendations = {
    summary:
      temp != null && humidity != null
        ? `Maintain irrigation as per need. Temp ${temp}°C, humidity ${humidity}%.`
        : "Maintain adequate irrigation and monitor local conditions.",
  };

  return {
    weather: {
      main: { temp, humidity },
    },
    farming_recommendations,
  };
}
