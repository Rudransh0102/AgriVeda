import { Toast } from "@/components/ui/Toast";
import { Brand, Neutral } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { yieldPredictionService } from "@/lib/services";
import { ChevronDown, Leaf, Loader } from "lucide-react-native";
import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";

const CROP_ITEMS = [
  { name: "Yams", index: 114 },
  { name: "Wheat", index: 113 },
  { name: "Sweet potato", index: 112 },
  { name: "Soybean", index: 111 },
  { name: "Sorghum", index: 110 },
  { name: "Rice", index: 109 },
  { name: "Potatoes", index: 108 },
  { name: "Plantains and others", index: 107 },
  { name: "Maize", index: 106 },
  { name: "Cassava", index: 105 },
];

export default function YieldPredictionScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [crop, setCrop] = React.useState(CROP_ITEMS[0]);
  const [rainfall, setRainfall] = React.useState("");
  const [temperature, setTemperature] = React.useState("");
  const [pesticide, setPesticide] = React.useState("");
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const predictMutation = useMutation({
    mutationFn: async () => {
      const r = Number(rainfall);
      const t = Number(temperature);
      const p = Number(pesticide);

      if (!Number.isFinite(r) || !Number.isFinite(t) || !Number.isFinite(p)) {
        throw new Error("Enter valid numbers");
      }

      return yieldPredictionService.predict({
        cropIndex: crop.index,
        rainfallMmPerYear: r,
        temperatureC: t,
        pesticideTons: p,
      });
    },
  });

  const onPredict = async () => {
    try {
      const res = await predictMutation.mutateAsync();
      Toast.success(`Predicted yield: ${res.predictedYield}`);
    } catch (e: any) {
      Toast.error(e?.message || "Prediction failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-screen dark:bg-screen-dark" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}>
        <Animated.View entering={FadeInDown.duration(500).springify()} className="p-6 pb-4">
          <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">
            Yield Prediction
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Quick estimate from rainfall & temperature
          </Text>
        </Animated.View>

        <View className="px-6 pt-2">
          <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">CROP</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setPickerOpen(true)}
              className="mt-2 flex-row items-center justify-between rounded-xl border border-border-default bg-white px-4 py-3 dark:border-border-default-dark dark:bg-gray-800"
            >
              <View className="flex-row items-center gap-2">
                <Leaf size={18} color={Brand.primary} />
                <Text className="text-sm font-black text-text-primary dark:text-text-primary-dark">{crop.name}</Text>
              </View>
              <ChevronDown size={18} color={isDark ? Neutral[400] : Neutral[500]} />
            </TouchableOpacity>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">RAINFALL (mm/year)</Text>
                <TextInput
                  value={rainfall}
                  onChangeText={setRainfall}
                  keyboardType="numeric"
                  placeholder="e.g. 1200"
                  placeholderTextColor="#9CA3AF"
                  className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-sm font-semibold text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">TEMP (°C)</Text>
                <TextInput
                  value={temperature}
                  onChangeText={setTemperature}
                  keyboardType="numeric"
                  placeholder="e.g. 26"
                  placeholderTextColor="#9CA3AF"
                  className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-sm font-semibold text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
                />
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">PESTICIDE (tons)</Text>
              <TextInput
                value={pesticide}
                onChangeText={setPesticide}
                keyboardType="numeric"
                placeholder="e.g. 16"
                placeholderTextColor="#9CA3AF"
                className="mt-2 rounded-xl border border-border-default bg-white px-4 py-3 text-sm font-semibold text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={predictMutation.isPending}
              onPress={onPredict}
              className={(predictMutation.isPending ? "opacity-70 " : "") + "mt-5 h-12 items-center justify-center rounded-2xl bg-brand-primary"}
            >
              <View className="flex-row items-center gap-2">
                {predictMutation.isPending && (
                  <Loader size={16} color="#fff" />
                )}
                <Text className="text-sm font-black text-white">{predictMutation.isPending ? "Predicting…" : "Predict Yield"}</Text>
              </View>
            </TouchableOpacity>

            {predictMutation.data?.predictedYield ? (
              <View className="mt-4 rounded-2xl border border-border-subtle bg-brand-primary/5 p-4 dark:border-border-subtle-dark">
                <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">RESULT</Text>
                <Text className="mt-2 text-2xl font-black text-text-primary dark:text-text-primary-dark">
                  {predictMutation.data.predictedYield}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
          <View className="flex-1 items-center justify-center bg-black/40 px-6">
            <View className="w-full max-w-[480px] rounded-3xl border border-border-subtle bg-card p-4 dark:border-border-subtle-dark dark:bg-card-dark">
              <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">Select crop</Text>
              <View className="mt-3 max-h-[380px]">
                <ScrollView showsVerticalScrollIndicator={false}>
                  {CROP_ITEMS.map((c) => (
                    <TouchableOpacity
                      key={c.index}
                      activeOpacity={0.85}
                      onPress={() => {
                        setCrop(c);
                        setPickerOpen(false);
                      }}
                      className={(c.index === crop.index ? "bg-brand-primary/10 " : "") + "rounded-2xl px-4 py-3"}
                    >
                      <Text className="text-sm font-extrabold text-text-primary dark:text-text-primary-dark">{c.name}</Text>
                      <Text className="mt-0.5 text-xs font-semibold text-text-tertiary dark:text-text-tertiary-dark">Index: {c.index}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPickerOpen(false)}
                className="mt-3 h-11 items-center justify-center rounded-2xl border border-border-default bg-white dark:border-border-default-dark dark:bg-gray-800"
              >
                <Text className="text-sm font-black text-text-primary dark:text-text-primary-dark">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
