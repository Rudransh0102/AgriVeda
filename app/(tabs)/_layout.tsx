import { getThemeColors } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs } from "expo-router";
import { Home, Scan, Stethoscope, User, Video } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tab.active,
        tabBarInactiveTintColor: colors.tab.inactive,
        tabBarStyle: {
          backgroundColor: colors.tab.background,
          borderTopColor: colors.border.subtle,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guidance"
        options={{
          title: "Guidance",
          tabBarIcon: ({ color, size }) => (
            <Stethoscope size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="detect"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => (
            <Scan size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, size }) => (
            <Video size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <User size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
