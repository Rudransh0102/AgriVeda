import { Clock } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Brand } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api/client";
import type { DiseaseHistoryItem } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const limit = 20;
  const historyQuery = useQuery({
    queryKey: ["diseaseHistory", user?.id, limit],
    enabled: !!user,
    queryFn: () =>
      apiRequest<DiseaseHistoryItem[]>(`/api/disease/history?limit=${limit}`, {
        method: "GET",
        auth: true,
      }),
  });

  const items = historyQuery.data ?? [];

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
            Scan History
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Your previous disease detections
          </Text>
        </Animated.View>

        <View className="p-6 pt-2">
          {isAuthLoading ? (
            <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              <Text className="text-sm font-extrabold text-text-secondary dark:text-text-secondary-dark">
                Loading…
              </Text>
            </View>
          ) : !user ? (
            <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                Login required
              </Text>
              <Text className="mt-1 text-xs font-semibold leading-4 text-text-tertiary dark:text-text-tertiary-dark">
                Sign in to see your detection history.
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push("/auth/login" as any)}
                className="mt-4 h-12 items-center justify-center rounded-2xl bg-brand-primary"
              >
                <Text className="text-sm font-black text-white">Login</Text>
              </TouchableOpacity>
            </View>
          ) : historyQuery.isLoading ? (
            <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              <Text className="text-sm font-extrabold text-text-secondary dark:text-text-secondary-dark">
                Loading history…
              </Text>
            </View>
          ) : historyQuery.isError ? (
            <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                Couldn’t load history
              </Text>
              <Text className="mt-1 text-xs font-semibold leading-4 text-text-tertiary dark:text-text-tertiary-dark">
                {String(
                  (historyQuery.error as any)?.message || "Please try again",
                )}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => historyQuery.refetch()}
                className="mt-4 h-12 items-center justify-center rounded-2xl border border-border-default bg-white dark:border-border-default-dark dark:bg-gray-800"
              >
                <Text className="text-sm font-black text-text-primary dark:text-text-primary-dark">
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : items.length === 0 ? (
            <View className="flex-row items-center gap-3 rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                <Clock size={20} color={Brand.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                  No History Yet
                </Text>
                <Text className="mt-1 text-xs font-semibold leading-4 text-text-tertiary dark:text-text-tertiary-dark">
                  Scans you run will appear here.
                </Text>
              </View>
            </View>
          ) : (
            <View className="gap-3">
              {items.map((item) => {
                const when = item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "";
                const title = item.disease_name || "Unknown disease";
                const confidencePct =
                  typeof item.confidence_score === "number"
                    ? `${Math.round(item.confidence_score * 100)}%`
                    : null;

                return (
                  <View
                    key={item.id}
                    className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                  >
                    <View className="flex-row items-start gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                        <Clock size={20} color={Brand.primary} />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between gap-2">
                          <Text className="flex-1 text-base font-black text-text-primary dark:text-text-primary-dark">
                            {title}
                          </Text>
                          {item.is_verified && (
                            <View className="rounded-full bg-green-500/15 px-2 py-1">
                              <Text className="text-[11px] font-black text-green-600">
                                Verified
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="mt-1 text-xs font-semibold leading-4 text-text-tertiary dark:text-text-tertiary-dark">
                          {item.crop_type}
                          {item.severity ? ` • ${item.severity}` : ""}
                          {confidencePct ? ` • ${confidencePct}` : ""}
                        </Text>
                        {!!when && (
                          <Text className="mt-2 text-xs font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                            {when}
                          </Text>
                        )}
                        {!!item.expert_comment && (
                          <Text className="mt-2 text-sm font-semibold leading-5 text-text-secondary dark:text-text-secondary-dark">
                            {item.expert_comment}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
