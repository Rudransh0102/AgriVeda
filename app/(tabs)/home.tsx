import { Brand } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getFarmWeather } from "@/lib/api/weather";
import { useRouter } from "expo-router";
import {
  Bug,
  CloudSun,
  Droplets,
  Scan,
  Search,
  Sprout,
  Wheat,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageBackground,
  RefreshControl,
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

export default function HomeScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push({ pathname: "/diseases", params: { q } } as any);
  };

  const [weather, setWeather] = useState({
    temp: "--",
    desc: "Loading...",
    soil: "--",
    icon: CloudSun,
    location: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async () => {
    const data = await getFarmWeather();
    const Icon = parseInt(data.rainChance) > 50 ? Droplets : CloudSun;
    setWeather({
      temp: data.temp.replace("°C", ""),
      desc: parseInt(data.rainChance) > 20 ? "Chance of Rain" : "Sunny Day",
      soil: data.soil,
      icon: Icon,
      location: data.location,
    });
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeather();
    setRefreshing(false);
  };

  const categories = [
    {
      key: "detect",
      label: "Scan Leaf",
      icon: Scan,
      href: "/(tabs)/detect",
      color: "#E8F5E9",
      iconColor: "#2E7D32",
    },
    {
      key: "crop",
      label: "MyCrops",
      icon: Wheat,
      href: "/crops",
      color: "#FFF3E0",
      iconColor: "#EF6C00",
    },
    {
      key: "tips",
      label: "Farming Tips",
      icon: Sprout,
      href: "/tips",
      color: "#E3F2FD",
      iconColor: "#1565C0",
    },
    {
      key: "disease",
      label: "Disease Lib",
      icon: Bug,
      href: "/diseases",
      color: "#FFEBEE",
      iconColor: "#C62828",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-screen-dark">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="px-6 pt-2"
        >
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {t("home.greeting")}
              </Text>
              <Text className="text-2xl font-black text-gray-900 dark:text-white">
                {(user?.full_name || user?.username || t("home.user")) + " "}👋
              </Text>
            </View>
            <TouchableOpacity className="h-12 w-12 bg-white dark:bg-gray-800 rounded-full items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                className="h-12 w-12 rounded-full"
              />
              <View className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="mb-4">
            <View className="flex-row items-center gap-3 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Search size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <View className="flex-1">
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={handleSearch}
                  placeholder="Search diseases, crops, or tips..."
                  placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
                  className="text-sm font-semibold text-gray-900 dark:text-white"
                  returnKeyType="search"
                />
              </View>
              <TouchableOpacity
                onPress={handleSearch}
                className="px-3 py-2 rounded-xl bg-brand-primary"
              >
                <Text className="text-white font-bold">Search</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {t("home.categories")}
            </Text>
            <Text className="text-sm font-bold text-brand-primary flex">
              {t("home.seeAll")}
            </Text>
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100).springify()}
          className="px-6 mb-8"
        >
          <View className="flex-row justify-between flex-wrap gap-y-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => router.push(cat.href as any)}
                  className="w-[23%] items-center gap-2"
                >
                  <View
                    style={{ backgroundColor: isDark ? "#1F2937" : cat.color }}
                    className="h-16 w-16 rounded-2xl items-center justify-center shadow-sm"
                  >
                    <Icon size={28} color={isDark ? "#fff" : cat.iconColor} />
                  </View>
                  <Text className="text-xs font-bold text-gray-600 dark:text-gray-300 text-center">
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Banner */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200).springify()}
          className="px-6 mb-8"
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/(tabs)/detect" as any)}
            className="h-44 rounded-3xl overflow-hidden"
          >
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1625246333195-58197bd47f26?auto=format&fit=crop&q=80&w=1000",
              }}
              resizeMode="cover"
              className="flex-1"
            >
              {/* Soft global overlay */}
              <View className="absolute inset-0 bg-black/20" />

              {/* Bottom fade scrim (this fixes the weird look) */}
              <View className="absolute bottom-0 left-0 right-0 h-28 bg-black/40" />

              {/* Content */}
              <View className="flex-1 justify-end px-5 pb-4">
                <View className="bg-white/15 self-start px-3 py-1 rounded-full mb-2 border border-white/20">
                  <Text className="text-white text-xs font-bold">
                    {t("home.bannerBadge")}
                  </Text>
                </View>

                <Text className="text-white text-xl font-black leading-tight">
                  {t("home.bannerTitle")}
                </Text>

                <Text className="text-gray-200 text-sm mt-1 max-w-[90%]">
                  {t("home.bannerSubtitle")}
                </Text>

                <View className="mt-3 bg-brand-primary self-start px-5 py-2 rounded-xl flex-row items-center gap-2">
                  <Scan size={16} color="white" />
                  <Text className="text-white font-bold">
                    {t("home.bannerCta")}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>

        {/* Weather */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(300).springify()}
          className="px-6"
        >
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t("home.farmConditions")}
          </Text>
          <View className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex-row justify-between items-center">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <weather.icon size={24} color={Brand.primary} />
                <Text className="text-base font-bold text-gray-500 dark:text-gray-400">
                  {weather.desc}
                </Text>
              </View>
              <View className="flex-row items-baseline">
                <Text className="text-5xl font-black text-gray-900 dark:text-white">
                  {weather.temp}°
                </Text>
                <Text className="text-xl text-gray-400 font-medium">C</Text>
              </View>
              <Text className="text-xs text-gray-400 mt-1">
                📍 {weather.location}
              </Text>
            </View>

            <View className="gap-3">
              <View className="bg-blue-50 dark:bg-gray-700 px-4 py-3 rounded-2xl items-center min-w-[100px]">
                <Text className="text-xs font-bold text-gray-400 uppercase">
                  {t("home.soilMoisture")}
                </Text>
                <Text className="text-lg font-black text-blue-600 dark:text-blue-400">
                  {weather.soil}
                </Text>
              </View>
              <View className="bg-orange-50 dark:bg-gray-700 px-4 py-3 rounded-2xl items-center min-w-[100px]">
                <Text className="text-xs font-bold text-gray-400 uppercase">
                  {t("home.humidity")}
                </Text>
                <Text className="text-lg font-black text-orange-600 dark:text-orange-400">
                  45%
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
