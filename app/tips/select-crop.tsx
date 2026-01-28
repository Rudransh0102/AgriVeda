import { Brand, Neutral } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { Leaf, Sprout } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const CROPS = [
  { key: "tomato", name: "Tomato" },
  { key: "wheat", name: "Wheat" },
  { key: "rice", name: "Rice" },
  { key: "maize", name: "Maize" },
  { key: "potato", name: "Potato" },
  { key: "cotton", name: "Cotton" },
  { key: "soybean", name: "Soybean" },
  { key: "sugarcane", name: "Sugarcane" },
  { key: "chilli", name: "Chilli" },
  { key: "onion", name: "Onion" },
];

export default function TipsSelectCropScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-screen dark:bg-screen-dark" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500).springify()} className="p-6 pb-4">
          <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">
            Select Crop
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Pick a crop to get stage-wise tips
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="flex-row flex-wrap justify-between">
            {CROPS.map((c, idx) => (
              <Animated.View
                key={c.key}
                entering={FadeInDown.duration(450).delay(60 * idx).springify()}
                className="mb-4 w-[48%]"
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: "/tips/categories", params: { crop: c.name } } as any)}
                  className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                      <Leaf size={18} color={Brand.primary} />
                    </View>
                    <Sprout size={18} color={isDark ? Neutral[400] : Neutral[500]} />
                  </View>
                  <Text className="mt-4 text-base font-black text-text-primary dark:text-text-primary-dark">
                    {c.name}
                  </Text>
                  <Text className="mt-1 text-xs font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                    Open →
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
