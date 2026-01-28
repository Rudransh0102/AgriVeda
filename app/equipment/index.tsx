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

import { getEquipment } from "@/lib/data/equipmentLocal";

export default function EquipmentScreen() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = React.useState("");

  const equipmentQuery = useQuery({
    queryKey: ["equipment", "list", location],
    queryFn: async () => getEquipment(location),
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
            Equipment Rental
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Browse available tools near you
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
            LOCATION
          </Text>
          <View className="mt-2 flex-row gap-3">
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Location (optional)"
              placeholderTextColor="#9CA3AF"
              className="flex-1 rounded-2xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => equipmentQuery.refetch()}
              className="h-12 items-center justify-center rounded-2xl bg-brand-primary px-4"
            >
              <Text className="text-sm font-black text-white">Apply</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 gap-3">
            {equipmentQuery.isLoading ? (
              <Text className="text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                Loading…
              </Text>
            ) : equipmentQuery.isError ? (
              <Text className="text-sm font-semibold text-red-600">
                Failed to load equipment
              </Text>
            ) : (equipmentQuery.data || []).length === 0 ? (
              <View className="rounded-2xl border border-border-subtle bg-card p-6 dark:border-border-subtle-dark dark:bg-card-dark">
                <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                  No equipment found
                </Text>
                <Text className="mt-1 text-sm font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                  Backend might not have seed data yet.
                </Text>
              </View>
            ) : (
              (equipmentQuery.data || []).map((e) => (
                <View
                  key={e.id}
                  className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                >
                  <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                    {e.name}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                    ₹{e.price_per_day}/day • {e.type}
                  </Text>
                  {!!e.location && (
                    <Text className="mt-1 text-xs font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                      {e.location}
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
