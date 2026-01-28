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

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async () => {
    if (!username.trim() || !email.trim() || !password) {
      Toast.error("Username, email and password required");
      return;
    }

    try {
      setSubmitting(true);
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        full_name: fullName.trim() || undefined,
        location: location.trim() || undefined,
      });
      router.replace("/auth/login" as any);
    } catch (e: any) {
      Toast.error(e?.message || "Registration failed");
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
            Create Account
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Register to sync history and alerts
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
              placeholder="Choose a username"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />

            <Text className="mt-4 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
              EMAIL
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />

            <Text className="mt-4 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
              PASSWORD
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />

            <Text className="mt-4 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
              FULL NAME (OPTIONAL)
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your name"
              placeholderTextColor="#9CA3AF"
              className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />

            <Text className="mt-4 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
              LOCATION (OPTIONAL)
            </Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="City / District"
              placeholderTextColor="#9CA3AF"
              className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-base text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={submitting}
              onPress={onSubmit}
              className={
                (submitting ? "opacity-70 " : "") +
                "mt-5 h-12 items-center justify-center rounded-2xl bg-brand-primary"
              }
            >
              <Text className="text-sm font-black text-white">
                {submitting ? "Creating…" : "Create Account"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              className="mt-4 items-center"
            >
              <Text className="text-sm font-bold text-brand-primary">
                Back to login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
