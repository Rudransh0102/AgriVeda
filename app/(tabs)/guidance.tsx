import { Brand, Neutral, Semantic } from "@/constants/Colors";
import { useRouter } from "expo-router";
import {
  BarChart3,
  Ellipsis,
  MessageCircle,
  ShieldAlert,
  Pill,
  Sprout,
  Stethoscope,
  Users,
  CloudSun,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function GuidanceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const cards = [
    {
      key: "tips",
      title: "Cultivation Tips",
      icon: Sprout,
      tint: Semantic.success.main,
      iconBgClass: "bg-emerald-500/10",
      href: "/tips",
    },
    {
      key: "diseases",
      title: "Disease Library",
      icon: ShieldAlert,
      tint: Brand.primary,
      iconBgClass: "bg-brand-primary/10",
      href: "/diseases",
    },
    {
      key: "community",
      title: "Community",
      icon: Users,
      tint: Semantic.info.main,
      iconBgClass: "bg-blue-500/10",
      href: "/community",
    },
    {
      key: "yield",
      title: "Yield Prediction",
      icon: BarChart3,
      tint: Brand.accent,
      iconBgClass: "bg-brand-accent/10",
      href: "/yield",
    },
    {
      key: "weather",
      title: "Weather",
      icon: CloudSun,
      tint: Semantic.info.main,
      iconBgClass: "bg-blue-500/10",
      href: "/weather",
    },
    {
      key: "chat",
      title: "Chat",
      icon: MessageCircle,
      tint: Semantic.info.main,
      iconBgClass: "bg-blue-500/10",
      href: "/chats",
    },
    {
      key: "other",
      title: "Others",
      icon: Ellipsis,
      tint: Neutral[500],
      iconBgClass: "bg-gray-500/10",
      href: "/others",
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
            Guidance
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Choose what you need
          </Text>
        </Animated.View>

        <View className="p-6 pt-2">
          <View className="flex-row flex-wrap justify-between">
            {cards.map((c, idx) => {
              const Icon = c.icon;
              return (
                <Animated.View
                  key={c.key}
                  entering={FadeInDown.duration(500)
                    .delay(80 * idx)
                    .springify()}
                  className="mb-4 w-[48%]"
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => router.push(c.href as any)}
                    className="
                      h-36
                      rounded-2xl
                      border
                      border-border-subtle
                      bg-card
                      p-4
                      shadow-sm
                      dark:border-border-subtle-dark
                      dark:bg-card-dark
                    "
                  >
                    {/* Icon */}
                    <View
                      className={
                        "h-10 w-10 items-center justify-center rounded-full " +
                        c.iconBgClass
                      }
                    >
                      <Icon size={20} color={c.tint} />
                    </View>

                    {/* Title */}
                    <View className="flex-1 justify-center mt-3">
                      <Text
                        numberOfLines={2}
                        className="text-sm font-black leading-5 text-text-primary dark:text-text-primary-dark"
                      >
                        {c.title}
                      </Text>
                    </View>

                    {/* Action */}
                    <Text className="text-xs font-bold text-text-secondary dark:text-text-secondary-dark">
                      Open →
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
