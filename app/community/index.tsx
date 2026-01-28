import { Brand, Neutral } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { MessageCircle, Users } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const PRESET_ROOMS = [
  { id: "general", title: "General", subtitle: "Ask anything farming-related" },
  { id: "pest-control", title: "Pest Control", subtitle: "Share symptoms and solutions" },
  { id: "market", title: "Market", subtitle: "Prices, buyers, selling" },
];

export default function CommunityRoomsScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [customId, setCustomId] = React.useState("");

  const join = (id: string) => {
    const roomId = id.trim();
    if (!roomId) return;
    router.push({ pathname: "/community/" + encodeURIComponent(roomId) } as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-screen dark:bg-screen-dark" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}>
        <Animated.View entering={FadeInDown.duration(500).springify()} className="p-6 pb-4">
          <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">Community</Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">Live group chat (no posts yet)</Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">JOIN ROOM</Text>
            <View className="mt-2 flex-row gap-3">
              <TextInput
                value={customId}
                onChangeText={setCustomId}
                placeholder="Room id (e.g. pune)"
                placeholderTextColor="#9CA3AF"
                className="flex-1 rounded-2xl border border-border-default bg-white px-4 py-3 text-sm font-semibold text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
              />
              <TouchableOpacity activeOpacity={0.85} onPress={() => join(customId)} className="h-12 items-center justify-center rounded-2xl bg-brand-primary px-4">
                <Text className="text-sm font-black text-white">Join</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="mt-6 mb-3 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">POPULAR</Text>
          <View className="gap-3">
            {PRESET_ROOMS.map((r, idx) => (
              <Animated.View key={r.id} entering={FadeInDown.duration(450).delay(70 * idx).springify()}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => join(r.id)}
                  className="flex-row items-center gap-3 rounded-2xl border border-border-subtle bg-card px-4 py-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                    <Users size={18} color={Brand.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-black text-text-primary dark:text-text-primary-dark">{r.title}</Text>
                    <Text className="mt-0.5 text-xs font-semibold text-text-secondary dark:text-text-secondary-dark">{r.subtitle}</Text>
                  </View>
                  <MessageCircle size={18} color={isDark ? Neutral[400] : Neutral[500]} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
