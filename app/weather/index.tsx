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

import { Toast } from "@/components/ui/Toast";
import { getCityWeather } from "@/lib/api/weather";

export default function WeatherScreen() {
  const insets = useSafeAreaInsets();
  const [city, setCity] = React.useState("Pune");
  const [submittedCity, setSubmittedCity] = React.useState("Pune");

  const weatherQuery = useQuery({
    queryKey: ["weather", "current", submittedCity],
    queryFn: async () => getCityWeather(submittedCity),
    enabled: !!submittedCity,
  });

  const onSubmit = () => {
    const next = city.trim();
    if (!next) {
      Toast.error("Enter a city");
      return;
    }
    setSubmittedCity(next);
  };

  const data = weatherQuery.data;
  const main = data?.weather?.main;

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
            Weather
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Current conditions + farming guidance
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="flex-row gap-3">
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor="#9CA3AF"
              className="flex-1 rounded-2xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onSubmit}
              className="h-12 items-center justify-center rounded-2xl bg-brand-primary px-4"
            >
              <Text className="text-sm font-black text-white">Get</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            {weatherQuery.isLoading ? (
              <Text className="text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                Loading…
              </Text>
            ) : weatherQuery.isError ? (
              <Text className="text-sm font-semibold text-red-600">
                Failed to fetch weather
              </Text>
            ) : (
              <>
                <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                  {submittedCity}
                </Text>
                <Text className="mt-1 text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                  Temp: {main?.temp ?? "—"}°C • Humidity:{" "}
                  {main?.humidity ?? "—"}%
                </Text>
                <Text className="mt-3 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
                  RECOMMENDATIONS
                </Text>
                <Text className="mt-1 text-sm font-semibold leading-5 text-text-tertiary dark:text-text-tertiary-dark">
                  {data?.farming_recommendations?.summary ||
                    "No recommendation summary provided."}
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
