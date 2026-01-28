import { Toast } from "@/components/ui/Toast";
import { assistantService } from "@/lib/services";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

export default function TipsViewScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ crop?: string; category?: string; title?: string }>();
  const crop = (params.crop || "").toString();
  const category = (params.category || "").toString();
  const title = (params.title || "Tips").toString();

  const tipsQuery = useQuery({
    queryKey: ["tips", crop, category],
    queryFn: () => assistantService.getCultivationTips({ crop, category }),
    enabled: !!crop && !!category,
  });

  React.useEffect(() => {
    if (tipsQuery.isError) Toast.error("Failed to load tips");
  }, [tipsQuery.isError]);

  return (
    <SafeAreaView className="flex-1 bg-screen dark:bg-screen-dark" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}>
        <Animated.View entering={FadeInDown.duration(500).springify()} className="p-6 pb-4">
          <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">
            {title}
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            {crop ? `${crop} • ${category}` : ""}
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="rounded-2xl border border-border-subtle bg-card p-5 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            {tipsQuery.isLoading ? (
              <Text className="text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">Loading…</Text>
            ) : tipsQuery.isError ? (
              <Text className="text-sm font-semibold text-red-600">Could not fetch tips</Text>
            ) : (tipsQuery.data || []).length === 0 ? (
              <Text className="text-sm font-semibold text-text-tertiary dark:text-text-tertiary-dark">No tips available.</Text>
            ) : (
              <View className="gap-3">
                {(tipsQuery.data || []).map((t, idx) => (
                  <View key={idx} className="flex-row gap-3">
                    <Text className="text-base font-black text-brand-primary">•</Text>
                    <Text className="flex-1 text-sm font-semibold leading-5 text-text-primary dark:text-text-primary-dark">
                      {t}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
