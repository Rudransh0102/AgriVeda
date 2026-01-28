import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { getSchemes } from "@/lib/data/schemesLocal";

export default function SchemesScreen() {
  const insets = useSafeAreaInsets();

  const schemesQuery = useQuery({
    queryKey: ["schemes", "list"],
    queryFn: async () => getSchemes(),
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
            Government Schemes
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Find subsidies and programs
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => schemesQuery.refetch()}
            className="h-12 items-center justify-center rounded-2xl bg-brand-primary"
          >
            <Text className="text-sm font-black text-white">Refresh</Text>
          </TouchableOpacity>

          <View className="mt-4 gap-3">
            {schemesQuery.isLoading ? (
              <Text className="text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                Loading…
              </Text>
            ) : schemesQuery.isError ? (
              <Text className="text-sm font-semibold text-red-600">
                Failed to load schemes
              </Text>
            ) : (schemesQuery.data || []).length === 0 ? (
              <View className="rounded-2xl border border-border-subtle bg-card p-6 dark:border-border-subtle-dark dark:bg-card-dark">
                <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                  No schemes returned
                </Text>
                <Text className="mt-1 text-sm font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                  Try running backend refresh or seed data.
                </Text>
              </View>
            ) : (
              (schemesQuery.data || []).slice(0, 20).map((s) => (
                <View
                  key={s.id}
                  className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                >
                  <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                    {s.name}
                  </Text>
                  {!!s.category && (
                    <Text className="mt-1 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
                      {s.category}
                    </Text>
                  )}
                  {!!s.description && (
                    <Text className="mt-2 text-sm font-semibold leading-5 text-text-tertiary dark:text-text-tertiary-dark">
                      {s.description}
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
