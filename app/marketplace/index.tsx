import { useTheme } from "@/contexts/ThemeContext";
import { DIGITAL_BUYERS, NEARBY_MARKETS } from "@/lib/mock/marketData";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  Navigation,
  Plus,
  Tag,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Segment = "mandis" | "sell";
type UserCoords = { latitude: number; longitude: number } | null;

function haversineMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function MarketScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [segment, setSegment] = useState<Segment>("mandis");

  // “Smart” distance (demo-safe):
  // - Seeds a realistic user location so distances look real without permissions.
  // - If you want real GPS: use expo-location + geolib (your note), then replace this effect.
  const [userLocation, setUserLocation] = useState<UserCoords>(null);

  useEffect(() => {
    // Demo: Nashik-ish coords
    setUserLocation({ latitude: 19.9975, longitude: 73.7898 });

    /**
     * Optional “judge wow” snippet (requires installing expo-location + geolib)
     *
     * import * as Location from 'expo-location';
     * import { getDistance } from 'geolib';
     *
     * useEffect(() => {
     *   (async () => {
     *     let { status } = await Location.requestForegroundPermissionsAsync();
     *     if (status !== 'granted') return;
     *     let location = await Location.getCurrentPositionAsync({});
     *     setUserLocation(location.coords);
     *   })();
     * }, []);
     */
  }, []);

  const calculateDistance = (
    marketLat?: number,
    marketLong?: number,
    fallback?: string,
  ) => {
    if (typeof marketLat !== "number" || typeof marketLong !== "number")
      return fallback ?? "--";
    if (!userLocation) return "Calculating...";
    const meters = haversineMeters(
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      { latitude: marketLat, longitude: marketLong },
    );
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const containerBg = isDark ? "bg-screen-dark" : "bg-gray-50";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";
  const border = isDark ? "border-gray-800" : "border-gray-100";
  const muted = isDark ? "text-gray-300" : "text-gray-600";
  const subtle = isDark ? "text-gray-400" : "text-gray-500";

  const header = useMemo(() => {
    return (
      <View className="px-6 pt-2 pb-3">
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Marketplace
          </Text>
        </View>

        <View
          className={`mt-4 ${cardBg} ${border} border rounded-2xl p-1 flex-row`}
        >
          <TouchableOpacity
            onPress={() => setSegment("mandis")}
            activeOpacity={0.9}
            className={`flex-1 py-2.5 rounded-xl items-center ${
              segment === "mandis" ? "bg-green-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`font-bold ${segment === "mandis" ? "text-white" : subtle}`}
            >
              Nearby Mandis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSegment("sell")}
            activeOpacity={0.9}
            className={`flex-1 py-2.5 rounded-xl items-center ${
              segment === "sell" ? "bg-green-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`font-bold ${segment === "sell" ? "text-white" : subtle}`}
            >
              Sell Online
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [segment, isDark]);

  const openNavigate = async (market: any) => {
    const hasCoords =
      typeof market.latitude === "number" &&
      typeof market.longitude === "number";

    const url =
      Platform.OS === "android"
        ? `google.navigation:q=${
            hasCoords
              ? `${market.latitude},${market.longitude}`
              : encodeURIComponent(market.location)
          }`
        : `https://www.google.com/maps/dir/?api=1&destination=${
            hasCoords
              ? `${market.latitude},${market.longitude}`
              : encodeURIComponent(market.location)
          }`;

    try {
      await Linking.openURL(url);
    } catch {
      // no-op for demo
    }
  };

  const renderMarketCard = ({ item }: { item: any }) => {
    const isOpen = !!item.isOpen;
    return (
      <View
        className={`mx-6 mb-4 ${cardBg} ${border} border rounded-3xl p-5 shadow-sm`}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text
              className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {item.name}
            </Text>

            <View className="flex-row items-center mt-2">
              <MapPin size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text className={`ml-2 text-sm font-semibold ${subtle}`}>
                {calculateDistance(
                  item.latitude,
                  item.longitude,
                  item.distance,
                )}{" "}
                • {item.location}
              </Text>
            </View>
          </View>

          <View
            className={`px-3 py-1.5 rounded-full ${
              isOpen ? "bg-green-100" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-xs font-black ${isOpen ? "text-green-700" : "text-gray-700"}`}
            >
              {isOpen ? "OPEN" : "CLOSED"}
            </Text>
          </View>
        </View>

        <View
          className={`mt-4 rounded-2xl ${isDark ? "bg-gray-800" : "bg-gray-50"} p-4`}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Tag size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text
                className={`ml-2 text-xs font-extrabold ${subtle} uppercase`}
              >
                Price Ticker
              </Text>
            </View>
            <Text className={`text-xs font-bold ${subtle}`}>Live (Mock)</Text>
          </View>

          <View className="gap-2">
            {item.commodities?.slice(0, 3).map((c: any) => {
              const trend = c.trend as "up" | "down" | "stable";
              const TrendIcon =
                trend === "up"
                  ? ArrowUpRight
                  : trend === "down"
                    ? ArrowDownRight
                    : null;
              const trendColor =
                trend === "up"
                  ? "#16A34A"
                  : trend === "down"
                    ? "#DC2626"
                    : isDark
                      ? "#9CA3AF"
                      : "#6B7280";

              return (
                <View
                  key={c.name}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    {TrendIcon ? (
                      <TrendIcon size={16} color={trendColor} />
                    ) : (
                      <View className="h-4 w-4 items-center justify-center">
                        <View className="h-1 w-1 rounded-full bg-gray-400" />
                      </View>
                    )}
                    <Text
                      className={`ml-2 text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {c.name}
                    </Text>
                  </View>
                  <Text
                    className={`text-sm font-black ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {c.price}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => openNavigate(item)}
          activeOpacity={0.9}
          className={`mt-4 rounded-2xl border ${isDark ? "border-gray-700" : "border-green-600"} px-4 py-3 flex-row items-center justify-center`}
        >
          <Navigation size={18} color={isDark ? "#E5E7EB" : "#16A34A"} />
          <Text
            className={`ml-2 font-black ${isDark ? "text-gray-100" : "text-green-700"}`}
          >
            Navigate
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const SellHeader = () => (
    <View className="px-6 pb-2">
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => {
          // TODO: route to create-listing screen/modal
        }}
        className="rounded-3xl overflow-hidden"
      >
        <View className="bg-green-700 p-5">
          <View className="absolute inset-0 bg-emerald-400/35" />
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-white text-xs font-extrabold uppercase opacity-90">
                Digital Marketplace
              </Text>
              <Text className="text-white text-2xl font-black mt-1">
                Sell My Crop
              </Text>
              <Text className="text-green-50 text-sm font-semibold mt-1 opacity-95">
                Create a listing and receive live bids.
              </Text>
            </View>
            <View className="h-12 w-12 rounded-2xl bg-white/20 items-center justify-center border border-white/30">
              <Plus size={22} color="white" />
            </View>
          </View>

          <View className="mt-4 bg-white/20 self-start px-4 py-2 rounded-2xl border border-white/25">
            <Text className="text-white font-black">Create Listing</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View className="mt-6 flex-row items-center justify-between">
        <Text
          className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Live Bids
        </Text>
        <Text className={`text-sm font-bold ${subtle}`}>Right now</Text>
      </View>
    </View>
  );

  const renderBuyerCard = ({ item }: { item: any }) => {
    return (
      <View
        className={`mx-6 mb-4 ${cardBg} ${border} border rounded-3xl p-5 shadow-sm`}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center">
              <Text
                className={`text-base font-black ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {item.buyerName}
              </Text>
              {item.verified ? (
                <View className="ml-2 flex-row items-center">
                  <BadgeCheck size={18} color="#2563EB" />
                  <Text className="ml-1 text-xs font-extrabold text-blue-600">
                    Verified
                  </Text>
                </View>
              ) : null}
            </View>

            <Text className={`mt-2 text-sm font-bold ${muted}`}>
              {item.crop}
            </Text>

            <View className="flex-row items-center mt-2">
              <Text className={`text-xs font-extrabold ${subtle} uppercase`}>
                Qty
              </Text>
              <Text
                className={`ml-2 text-sm font-black ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                {item.quantity}
              </Text>

              <Text
                className={`ml-4 text-xs font-extrabold ${subtle} uppercase`}
              >
                Time
              </Text>
              <Text className={`ml-2 text-sm font-bold ${subtle}`}>
                {item.time}
              </Text>
            </View>
          </View>

          <View
            className={`${isDark ? "bg-gray-800" : "bg-green-50"} px-4 py-3 rounded-2xl items-center`}
          >
            <Text className={`text-xs font-extrabold ${subtle} uppercase`}>
              Offer
            </Text>
            <Text className="text-lg font-black text-green-600">
              {item.priceOffer}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            // TODO: accept bid action
          }}
          className="mt-4 rounded-2xl bg-green-600 px-4 py-3 items-center"
        >
          <Text className="text-white font-black">Accept Bid</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${containerBg}`} edges={["top"]}>
      <View style={{ paddingTop: 0 }}>{header}</View>

      <Animated.View
        key={segment}
        entering={FadeIn.duration(160)}
        exiting={FadeOut.duration(160)}
        layout={Layout.springify()}
        style={{ flex: 1, paddingBottom: insets.bottom }}
      >
        {segment === "mandis" ? (
          <FlatList
            data={NEARBY_MARKETS}
            keyExtractor={(item: any) => item.id}
            renderItem={renderMarketCard}
            contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={DIGITAL_BUYERS}
            keyExtractor={(item: any) => item.id}
            renderItem={renderBuyerCard}
            ListHeaderComponent={SellHeader}
            contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
