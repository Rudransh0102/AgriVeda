import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, Loader } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Toast } from "@/components/ui/Toast";
import { Neutral } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import type { DiseasePredictResponse } from "@/lib/api/types";
import { predictDisease } from "@/lib/ml/diseaseClassifier";
import { diseaseLibraryService } from "@/lib/services";
import { useRouter } from "expo-router";

export default function DetectScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { t } = useTranslation("common");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<DiseasePredictResponse | null>(
    null,
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("permission_denied"),
        t("photo_library_permission_required"),
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect is CRITICAL for model accuracy
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      setPrediction(null);
      Toast.info("Ready to analyze.");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("permission_denied"), t("camera_permission_required"));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      setPrediction(null);
      Toast.info("Photo captured.");
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      // 1. Run Offline Prediction
      const result = await predictDisease(selectedImage);

      // 2. Fetch Data from Library
      try {
        const guide = await diseaseLibraryService.getDisease(
          result.disease_name,
        );

        setPrediction({
          disease_name: guide.name,
          confidence_score: result.confidence_score,
          severity: result.confidence_score > 0.7 ? "high" : "medium",
          symptoms: guide.symptoms || [],
          treatment: guide.chemicalControl?.length
            ? guide.chemicalControl
            : guide.naturalControl || [],
          prevention: guide.prevention || [],
          description: guide.introduction || "",
        });
      } catch {
        // Fallback
        setPrediction({
          disease_name: result.disease_name,
          confidence_score: result.confidence_score,
          severity: "medium",
          symptoms: ["Unknown symptoms"],
          treatment: ["Consult local expert"],
          prevention: [],
          description: "Detected by AI.",
        });
      }

      Toast.success("Analysis complete");
    } catch (e: any) {
      Toast.error("Analysis failed.");
      Alert.alert("Error", e.message || "Failed to run model.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-screen dark:bg-screen-dark"
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="p-6 pb-4"
        >
          <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">
            {t("detect.title")}
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            {t("detect.subtitle")}
          </Text>
        </Animated.View>

        {/* Image Preview */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100).springify()}
          className="px-6 pt-2"
        >
          <View className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-border-subtle bg-card shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center gap-3">
                <ImageIcon
                  size={54}
                  color={isDark ? Neutral[400] : Neutral[500]}
                />
                <Text className="text-sm font-extrabold text-text-tertiary dark:text-text-tertiary-dark">
                  {t("detect.addPhoto")}
                </Text>
              </View>
            )}

            <View pointerEvents="none" className="absolute inset-0 p-7">
              <View className="flex-1 rounded-2xl border border-border-default opacity-60 dark:border-border-default-dark" />
              <View className="absolute left-7 top-7 h-7 w-7 rounded-tl-md border-l-[3px] border-t-[3px] border-brand-primary" />
              <View className="absolute right-7 top-7 h-7 w-7 rounded-tr-md border-r-[3px] border-t-[3px] border-brand-primary" />
              <View className="absolute bottom-7 left-7 h-7 w-7 rounded-bl-md border-b-[3px] border-l-[3px] border-brand-primary" />
              <View className="absolute bottom-7 right-7 h-7 w-7 rounded-br-md border-b-[3px] border-r-[3px] border-brand-primary" />
            </View>

            {isAnalyzing && (
              <View className="absolute inset-0 items-center justify-center">
                <View className="flex-row items-center gap-2 rounded-full border border-border-subtle bg-card px-4 py-3 dark:border-border-subtle-dark dark:bg-card-dark">
                  <Loader
                    size={18}
                    color={isDark ? Neutral[50] : Neutral[900]}
                  />
                  <Text className="text-[13px] font-black text-text-primary dark:text-text-primary-dark">
                    {t("detect.analyzing")}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200).springify()}
          className="mt-2 flex-row items-center gap-3 px-6"
        >
          <TouchableOpacity
            onPress={pickImage}
            className="h-14 w-14 items-center justify-center rounded-2xl border border-border-default bg-gray-100 dark:border-border-default-dark dark:bg-gray-700"
          >
            <ImageIcon size={20} color={isDark ? Neutral[50] : Neutral[900]} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={analyzeImage}
            disabled={!selectedImage || isAnalyzing}
            className={
              "flex-1 h-14 items-center justify-center rounded-2xl " +
              (selectedImage
                ? "bg-brand-primary"
                : "bg-border-subtle dark:bg-border-subtle-dark")
            }
          >
            <Text className="text-sm font-black text-white">
              {t("detect.analyze")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePhoto}
            className="h-14 w-14 items-center justify-center rounded-2xl border border-border-default bg-gray-100 dark:border-border-default-dark dark:bg-gray-700"
          >
            <Camera size={20} color={isDark ? Neutral[50] : Neutral[900]} />
          </TouchableOpacity>
        </Animated.View>

        {/* Results */}
        {prediction && (
          <Animated.View
            entering={FadeInDown.duration(500).delay(260).springify()}
            className="px-6 pt-5"
          >
            <View className="mb-4 rounded-3xl border border-border-subtle bg-card p-5 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-black text-text-primary dark:text-text-primary-dark">
                    {prediction.disease_name}
                  </Text>
                  <Text className="mt-1 text-xs font-extrabold uppercase tracking-wide text-text-tertiary dark:text-text-tertiary-dark">
                    {String(prediction.severity || "unknown")} severity
                  </Text>
                </View>
                <View className="rounded-2xl bg-brand-primary/10 px-3 py-2">
                  <Text className="text-xs font-black text-brand-primary">
                    {Math.round((prediction.confidence_score || 0) * 100)}%
                  </Text>
                </View>
              </View>

              <Text className="mt-4 text-sm font-semibold leading-5 text-text-secondary dark:text-text-secondary-dark">
                {prediction.description || "Details unavailable."}
              </Text>

              <View className="mt-4 gap-3">
                <View>
                  <Text className="text-xs font-black uppercase tracking-wide text-text-tertiary dark:text-text-tertiary-dark">
                    {t("detect.symptoms")}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                    {(prediction.symptoms || []).slice(0, 3).join(" • ") || "—"}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs font-black uppercase tracking-wide text-text-tertiary dark:text-text-tertiary-dark">
                    {t("detect.treatment")}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                    {(prediction.treatment || []).slice(0, 3).join(" • ") ||
                      "—"}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
