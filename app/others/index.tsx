import {
  CloudSun,
  HandCoins,
  Landmark,
  LineChart,
  Tractor,
  Wheat,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Brand } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

export default function OthersScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const items = [
    {
      title: "Weather",
      subtitle: "Forecasts + farming tips",
      href: "/weather",
      Icon: CloudSun,
    },
    {
      title: "Marketplace",
      subtitle: "Buy & sell produce",
      href: "/marketplace",
      Icon: HandCoins,
    },
    {
      title: "Equipment",
      subtitle: "Rent tools",
      href: "/equipment",
      Icon: Tractor,
    },
    {
      title: "Schemes",
      subtitle: "Subsidies and programs",
      href: "/schemes",
      Icon: Landmark,
    },
    {
      title: "Crops",
      subtitle: "Recommendations",
      href: "/crops",
      Icon: Wheat,
    },
    {
      title: "Market Prices",
      subtitle: "Trends and rates",
      href: "/market-prices",
      Icon: LineChart,
    },
  ];

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
            Others
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            More tools and utilities
          </Text>
        </Animated.View>

        <View className="p-6 pt-2">
          <View className="gap-3">
            {items.map((it, idx) => (
              <Animated.View
                key={it.href}
                entering={FadeInDown.duration(500)
                  .delay(70 * idx)
                  .springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push(it.href as any)}
                  className="flex-row items-center gap-3 rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                    <it.Icon size={20} color={Brand.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                      {it.title}
                    </Text>
                    <Text className="mt-1 text-xs font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                      {it.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}

            <View className="mt-2 rounded-2xl border border-border-subtle bg-card p-4 dark:border-border-subtle-dark dark:bg-card-dark">
              <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
                BACKEND
              </Text>
              <Text className="mt-2 text-sm font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                Configure API base URL via EXPO_PUBLIC_API_URL.
              </Text>
              <Text className="mt-1 text-xs font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                Example: http://YOUR-LAN-IP:8000
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
