import { Sprout } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Neutral } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

export default function TipsScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <SafeAreaView
      className="flex-1 bg-screen dark:bg-screen-dark"
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="p-6 pb-4"
        >
          <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">
            Cultivation Tips
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Best practices for healthier crops
          </Text>
        </Animated.View>

        <View className="p-6 pt-2">
          <View className="rounded-2xl border border-border-subtle bg-card p-5 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10">
                <Sprout size={20} color={isDark ? Neutral[200] : Neutral[700]} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">Get crop-specific tips</Text>
                <Text className="mt-0.5 text-xs font-semibold text-text-secondary dark:text-text-secondary-dark">Select crop → category → tips</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/tips/select-crop" as any)}
              className="mt-4 h-12 items-center justify-center rounded-2xl bg-brand-primary"
            >
              <Text className="text-sm font-black text-white">Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
