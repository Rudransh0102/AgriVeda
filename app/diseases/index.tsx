import { Toast } from "@/components/ui/Toast";
import { Brand, Neutral } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { diseaseLibraryService } from "@/lib/services";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Search, ShieldAlert } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
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

export default function DiseaseLibraryScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const [q, setQ] = React.useState(String(params.q || ""));
  const { t } = useTranslation("common");

  const diseasesQuery = useQuery({
    queryKey: ["disease-library"],
    queryFn: () => diseaseLibraryService.listDiseases(),
  });

  React.useEffect(() => {
    if (diseasesQuery.isError) Toast.error("Failed to load disease list");
  }, [diseasesQuery.isError]);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = diseasesQuery.data || [];
    if (!s) return list;
    return list.filter((d) => (d.name || "").toLowerCase().includes(s));
  }, [q, diseasesQuery.data]);

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
            {t("diseases.title")}
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            {t("diseases.subtitle")}
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="flex-row items-center gap-2 rounded-2xl border border-border-subtle bg-card px-4 py-3 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <Search size={18} color={isDark ? Neutral[400] : Neutral[500]} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={t("diseases.searchPlaceholder")}
              placeholderTextColor="#9CA3AF"
              className="flex-1 p-0 text-sm font-semibold text-text-primary dark:text-text-primary-dark"
            />
          </View>

          {/* Grid Container */}
          <View className="mt-4 flex-row flex-wrap justify-between">
            {diseasesQuery.isLoading ? (
              <View className="w-full rounded-2xl border border-border-subtle bg-card p-5 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
                <Text className="text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                  {t("diseases.loading")}
                </Text>
              </View>
            ) : diseasesQuery.isError ? (
              <View className="w-full rounded-2xl border border-border-subtle bg-card p-5 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
                <Text className="text-sm font-semibold text-red-600">
                  {t("diseases.unavailable")}
                </Text>
              </View>
            ) : (
              filtered.map((d, idx) => (
                <Animated.View
                  key={d.id || d.name || String(idx)}
                  entering={FadeInDown.duration(450)
                    .delay(35 * idx)
                    .springify()}
                  className="w-[48%] mb-4" // Width set to 48% to allow two items per row with space
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: "/diseases/" + encodeURIComponent(d.name),
                      } as any)
                    }
                    className="h-32 flex-col items-center justify-center rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                  >
                    <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                      <ShieldAlert size={24} color={Brand.primary} />
                    </View>
                    <View className="items-center">
                      <Text
                        numberOfLines={2}
                        className="text-center text-sm font-black text-text-primary dark:text-text-primary-dark"
                      >
                        {d.name}
                      </Text>
                      <Text className="mt-1 text-center text-[10px] font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                        {t("diseases.viewGuide")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
