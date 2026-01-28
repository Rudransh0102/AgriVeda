import { Pill } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Neutral } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

export default function MedicareScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

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
            Disease & Medicare
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Treatment info and precautions
          </Text>
        </Animated.View>

        <View className="p-6 pt-2">
          <View className="items-center gap-3 rounded-2xl border border-border-subtle bg-card p-10 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <Pill size={40} color={isDark ? Neutral[400] : Neutral[500]} />
            <Text className="mt-2 text-xl font-black text-text-primary dark:text-text-primary-dark">
              Coming Soon
            </Text>
            <Text className="text-center text-sm font-semibold leading-5 text-text-tertiary dark:text-text-tertiary-dark">
              We’ll add disease-specific guidance here.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
