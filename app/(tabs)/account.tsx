import { Toast } from "@/components/ui/Toast";
import { Brand, Neutral } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import i18n from "@/lib/i18n";
import {
    getPreferredLanguage,
    setPreferredLanguage,
    supportedLanguages,
} from "@/lib/preferences";
import { useRouter } from "expo-router";
import { Bell, Clock, HelpCircle, Info, Moon, Sun } from "lucide-react-native";
import React from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function AccountScreen() {
  const { isDark, toggleColorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();

  type SettingItem = {
    icon: any;
    label: string;
    type: "toggle" | "link";
    value?: boolean;
    onPress: () => void;
  };

  type SettingsSection = {
    title: string;
    items: SettingItem[];
  };

  const settingsSections: SettingsSection[] = [
    {
      title: "Appearance",
      items: [
        {
          icon: isDark ? Moon : Sun,
          label: "Dark Mode",
          type: "toggle",
          value: isDark,
          onPress: toggleColorScheme,
        },
        {
          icon: Info,
          label: "Language",
          type: "link",
          onPress: async () => {
            try {
              const current = await getPreferredLanguage();
              const idx = supportedLanguages.indexOf(current);
              const next =
                supportedLanguages[(idx + 1) % supportedLanguages.length];
              await setPreferredLanguage(next);
              i18n.changeLanguage(next);
              Toast.success(`Language: ${next.toUpperCase()}`);
            } catch {
              Toast.error("Failed to update language");
            }
          },
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          type: "toggle",
          value: true,
          onPress: () =>
            Toast.info("Notification settings will be available soon"),
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          type: "link",
          onPress: () => Toast.info("Help section coming soon"),
        },
        {
          icon: Info,
          label: "About AgriVeda",
          type: "link",
          onPress: () => Toast.info("Version 1.0.0"),
        },
      ],
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
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="p-6 pb-4"
        >
          <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">
            Account
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            {user ? `Signed in as ${user.username}` : "Manage app settings"}
          </Text>
        </Animated.View>

        {/* Auth card */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(40).springify()}
          className="px-6 pt-2"
        >
          {!!user && (
            <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                {user.full_name || user.username}
              </Text>
              {!!user.email && (
                <Text className="mt-1 text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                  {user.email}
                </Text>
              )}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={logout}
                className="mt-4 h-12 items-center justify-center rounded-2xl border border-border-default bg-white dark:border-border-default-dark dark:bg-gray-800"
              >
                <Text className="text-sm font-black text-text-primary dark:text-text-primary-dark">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* History */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(80).springify()}
          className="px-6 pt-2"
        >
          <Text className="mb-3 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
            HISTORY
          </Text>
          <View className="overflow-hidden rounded-2xl border border-border-subtle bg-card shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/history")}
              className="flex-row items-center gap-3 p-4"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                <Clock size={20} color={Brand.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                  No History Yet
                </Text>
                <Text className="mt-1 text-xs font-semibold leading-4 text-text-tertiary dark:text-text-tertiary-dark">
                  Your scan history will appear here once you start scanning.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.duration(500)
              .delay(140 + 100 * sectionIndex)
              .springify()}
            className="px-6 pt-6"
          >
            <Text className="mb-3 text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
              {section.title}
            </Text>
            <View className="overflow-hidden rounded-2xl border border-border-subtle bg-card shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isLast = itemIndex === section.items.length - 1;

                return (
                  <View key={item.label}>
                    <TouchableOpacity
                      className="flex-row items-center justify-between p-4"
                      onPress={item.onPress}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                          <Icon size={20} color={Brand.primary} />
                        </View>
                        <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
                          {item.label}
                        </Text>
                      </View>
                      {item.type === "toggle" && item.value !== undefined && (
                        <Switch
                          value={item.value}
                          onValueChange={item.onPress}
                          trackColor={{
                            false: isDark ? Neutral[600] : Neutral[300],
                            true: Brand.primary,
                          }}
                          thumbColor={isDark ? Neutral[800] : Neutral.white}
                        />
                      )}
                    </TouchableOpacity>
                    {!isLast && (
                      <View className="ml-16 h-px bg-border-subtle dark:bg-border-subtle-dark" />
                    )}
                  </View>
                );
              })}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
