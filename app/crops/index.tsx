import { useMutation } from "@tanstack/react-query";
import React from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import {
    getCropRecommendation as aiGetCrops,
    isGeminiConfigured,
} from "@/lib/ai/gemini";
import type {
    CropRecommendationRequest,
    CropRecommendationResponse,
} from "@/lib/api/types";

export default function CropsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [location, setLocation] = React.useState(user?.location || "");
  const [soilType, setSoilType] = React.useState("loam");
  const [season, setSeason] = React.useState("kharif");

  const recommendMutation = useMutation({
    mutationFn: async (payload: CropRecommendationRequest) => {
      const recs = await aiGetCrops(
        payload.location,
        payload.season || "",
        payload.soil_type || "",
      );
      const mapped = Array.isArray(recs)
        ? recs.map((r: any) => ({
            crop: r.name || r.crop || "",
            duration: r.duration || "",
            profitability: r.profit || r.profitability || "",
            reason: r.reason || "",
          }))
        : [];
      const resp: CropRecommendationResponse = {
        id: Date.now(),
        location: payload.location,
        recommended_crops: mapped,
        weather_data: null,
        soil_type: payload.soil_type || null,
        farm_size: payload.farm_size || null,
        budget: payload.budget || null,
        season: payload.season || null,
        previous_crop: payload.previous_crop || null,
        created_at: new Date().toISOString(),
      } as any;
      return resp;
    },
  });

  const onRecommend = async () => {
    if (!location.trim()) {
      Toast.error("Enter location");
      return;
    }

    if (!isGeminiConfigured()) {
      Toast.error("Gemini API key missing. Set EXPO_PUBLIC_GEMINI_API_KEY.");
      return;
    }

    try {
      await recommendMutation.mutateAsync({
        location: location.trim(),
        soil_type: soilType.trim() || undefined,
        season: season.trim() || undefined,
      } as any);
      Toast.success("Recommendations ready");
    } catch (e: any) {
      Toast.error(e?.message || "Failed to get recommendations");
    }
  };

  const rec = recommendMutation.data;
  const crops = Array.isArray(rec?.recommended_crops)
    ? rec?.recommended_crops
    : [];

  return (
    <SafeAreaView
      className="flex-1 bg-screen dark:bg-screen-dark"
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}>
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="p-6 pb-4"
        >
          <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">
            Crop Recommendations
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            AI suggestions based on your location
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
              LOCATION
            </Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="City / District"
              placeholderTextColor="#9CA3AF"
              className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
                  SOIL
                </Text>
                <TextInput
                  value={soilType}
                  onChangeText={setSoilType}
                  placeholder="loam"
                  placeholderTextColor="#9CA3AF"
                  className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
                  SEASON
                </Text>
                <TextInput
                  value={season}
                  onChangeText={setSeason}
                  placeholder="kharif"
                  placeholderTextColor="#9CA3AF"
                  className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onRecommend}
              disabled={recommendMutation.isPending}
              className={
                (recommendMutation.isPending ? "opacity-70 " : "") +
                "mt-5 h-12 items-center justify-center rounded-2xl bg-brand-primary"
              }
            >
              <Text className="text-sm font-black text-white">
                {recommendMutation.isPending
                  ? "Thinking…"
                  : "Get Recommendations"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 gap-3">
            {recommendMutation.isPending ? null : crops.length === 0 ? (
              <View className="rounded-2xl border border-border-subtle bg-card p-6 dark:border-border-subtle-dark dark:bg-card-dark">
                <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                  No results yet
                </Text>
                <Text className="mt-1 text-sm font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                  Submit the form to see recommended crops.
                </Text>
              </View>
            ) : (
              crops.map((c: any, idx: number) => (
                <View
                  key={idx}
                  className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                >
                  <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                    {c.crop}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                    Profitability: {c.profitability}
                  </Text>
                  {!!c.duration && (
                    <Text className="mt-1 text-xs font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                      Duration: {c.duration}
                    </Text>
                  )}
                  {!!c.reason && (
                    <Text className="mt-2 text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
                      Why: {c.reason}
                    </Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
