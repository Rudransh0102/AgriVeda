import { useRouter } from "expo-router";
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
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async () => {
    if (!username.trim() || !password) {
      Toast.error("Enter username and password");
      return;
    }

    try {
      setSubmitting(true);
      await login({ username: username.trim(), password });
      router.back();
    } catch (e: any) {
      Toast.error(e?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

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
            Login
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Connect to your account
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
              USERNAME
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. atharva"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />

            <Text className="mt-4 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
              PASSWORD
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={submitting || isLoading}
              onPress={onSubmit}
              className={
                (submitting ? "opacity-70 " : "") +
                "mt-5 h-12 items-center justify-center rounded-2xl bg-brand-primary"
              }
            >
              <Text className="text-sm font-black text-white">
                {submitting ? "Signing in…" : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/auth/register" as any)}
              className="mt-4 items-center"
            >
              <Text className="text-sm font-bold text-brand-primary">
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
