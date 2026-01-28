import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAuth } from "@/contexts/AuthContext";

export default function AuthHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

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
            Authentication
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            {user
              ? `Signed in as ${user.username}`
              : "Sign in to access protected features"}
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/auth/login" as any)}
              className="h-12 items-center justify-center rounded-2xl bg-brand-primary"
            >
              <Text className="text-sm font-black text-white">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/auth/register" as any)}
              className="mt-3 h-12 items-center justify-center rounded-2xl border border-border-default bg-white dark:border-border-default-dark dark:bg-gray-800"
            >
              <Text className="text-sm font-black text-text-primary dark:text-text-primary-dark">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
