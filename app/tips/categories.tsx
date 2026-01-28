import { Brand, Neutral } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronRight, Sprout } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const CATEGORIES: Array<{ key: string; title: string; subtitle: string }> = [
  { key: "crop selection", title: "Crop Selection", subtitle: "Variety & seed choices" },
  { key: "soil preparation", title: "Soil Preparation", subtitle: "Land prep and pH" },
  { key: "irrigation", title: "Irrigation", subtitle: "Scheduling and water stress" },
  { key: "fertilizers", title: "Fertilizers", subtitle: "NPK, micronutrients" },
  { key: "weed management", title: "Weed Management", subtitle: "Prevent yield losses" },
  { key: "harvesting", title: "Harvesting", subtitle: "Timing & storage" },
];

export default function TipsCategoriesScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ crop?: string }>();
  const crop = (params.crop || "").toString();

  return (
    <SafeAreaView className="flex-1 bg-screen dark:bg-screen-dark" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}>
        <Animated.View entering={FadeInDown.duration(500).springify()} className="p-6 pb-4">
          <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">
            {crop || "Cultivation"}
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Choose a category
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="gap-3">
            {CATEGORIES.map((cat, idx) => (
              <Animated.View
                key={cat.key}
                entering={FadeInDown.duration(450).delay(70 * idx).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({ pathname: "/tips/view", params: { crop, category: cat.key, title: cat.title } } as any)
                  }
                  className="flex-row items-center gap-3 rounded-2xl border border-border-subtle bg-card px-4 py-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                    <Sprout size={18} color={Brand.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-black text-text-primary dark:text-text-primary-dark">
                      {cat.title}
                    </Text>
                    <Text className="mt-0.5 text-xs font-semibold text-text-secondary dark:text-text-secondary-dark">
                      {cat.subtitle}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={isDark ? Neutral[400] : Neutral[500]} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
