import { useQuery } from "@tanstack/react-query";
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

import { getMarketPrices } from "@/lib/data/marketPricesLocal";

export default function MarketPricesScreen() {
  const insets = useSafeAreaInsets();
  const [crop, setCrop] = React.useState("");

  const pricesQuery = useQuery({
    queryKey: ["market-prices", crop],
    queryFn: async () => getMarketPrices(crop, 30),
  });

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
            Market Prices
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Live crop pricing and trends
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="flex-row gap-3">
            <TextInput
              value={crop}
              onChangeText={setCrop}
              placeholder="Search crop (e.g. Tomato)"
              placeholderTextColor="#9CA3AF"
              className="flex-1 rounded-2xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => pricesQuery.refetch()}
              className="h-12 items-center justify-center rounded-2xl bg-brand-primary px-4"
            >
              <Text className="text-sm font-black text-white">Search</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 gap-3">
            {pricesQuery.isLoading ? (
              <Text className="text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                Loading…
              </Text>
            ) : pricesQuery.isError ? (
              <Text className="text-sm font-semibold text-red-600">
                Failed to load prices
              </Text>
            ) : (pricesQuery.data || []).length === 0 ? (
              <View className="rounded-2xl border border-border-subtle bg-card p-6 dark:border-border-subtle-dark dark:bg-card-dark">
                <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                  No price data
                </Text>
                <Text className="mt-1 text-sm font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                  Backend may need to refresh prices.
                </Text>
              </View>
            ) : (
              (pricesQuery.data || []).slice(0, 30).map((p) => (
                <View
                  key={p.id}
                  className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                >
                  <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                    {p.crop_name}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                    ₹{p.current_price}/{p.unit} • {p.market_location}
                  </Text>
                  {!!p.trend && (
                    <Text className="mt-1 text-xs font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                      Trend: {p.trend}
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
