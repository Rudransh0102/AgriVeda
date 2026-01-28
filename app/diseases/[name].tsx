import { ExternalLink } from "@/components/ExternalLink";
import { Toast } from "@/components/ui/Toast";
import { diseaseLibraryService } from "@/lib/services";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

function Section(props: { title: string; items: string[]; intro?: string }) {
  const { t } = useTranslation("common");
  return (
    <View className="mt-4 rounded-2xl border border-border-subtle bg-card p-5 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
      <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
        {props.title}
      </Text>
      {!!props.intro && (
        <Text className="mt-2 text-sm font-semibold leading-5 text-text-primary dark:text-text-primary-dark">
          {props.intro}
        </Text>
      )}
      <View className="mt-3 gap-2">
        {props.items.length === 0 ? (
          <Text className="text-sm font-semibold text-text-tertiary dark:text-text-tertiary-dark">
            {t("comingSoon", "Coming soon.")}
          </Text>
        ) : (
          props.items.map((t, idx) => (
            <View key={idx} className="flex-row gap-3">
              <Text className="text-base font-black text-brand-primary">•</Text>
              <Text className="flex-1 text-sm font-semibold leading-5 text-text-primary dark:text-text-primary-dark">
                {t}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

export default function DiseaseGuideScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    name?: string;
    confidence?: string;
    health?: string;
  }>();
  const diseaseName = decodeURIComponent((params.name || "").toString());
  const confidence = params.confidence ? Number(params.confidence) : null;
  const health = params.health ? String(params.health) : null;
  const { t } = useTranslation("common");

  const guideQuery = useQuery({
    queryKey: ["disease-guide", diseaseName],
    queryFn: () => diseaseLibraryService.getDisease(diseaseName),
    enabled: !!diseaseName,
  });

  React.useEffect(() => {
    if (guideQuery.isError)
      Toast.error(
        t("diseases.failedLoadGuide", "Failed to load disease guide"),
      );
  }, [guideQuery.isError]);

  const guide = guideQuery.data;

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
            {diseaseName || t("diseases.titleFallback", "Disease")}
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            {t("diseases.detailSubtitle", "Control methods and prevention")}
          </Text>

          {(health || typeof confidence === "number") && (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {!!health && (
                <View className="rounded-full bg-brand-primary/10 px-3 py-1">
                  <Text className="text-xs font-black text-brand-primary">
                    {health}
                  </Text>
                </View>
              )}
              {typeof confidence === "number" && !Number.isNaN(confidence) && (
                <View className="rounded-full bg-brand-primary/10 px-3 py-1">
                  <Text className="text-xs font-black text-brand-primary">
                    {Math.round(confidence * 100)}%
                  </Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>

        <View className="px-6 pt-2">
          {guideQuery.isLoading ? (
            <View className="rounded-2xl border border-border-subtle bg-card p-5 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              <Text className="text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
                {t("diseases.loading", "Loading…")}
              </Text>
            </View>
          ) : guideQuery.isError || !guide ? (
            <View className="rounded-2xl border border-border-subtle bg-card p-5 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
              <Text className="text-sm font-semibold text-red-600">
                {t("diseases.unavailable", "Guide unavailable right now.")}
              </Text>
            </View>
          ) : (
            <>
              <Section
                title={t("diseases.introduction", "INTRODUCTION")}
                items={[]}
                intro={guide.introduction || ""}
              />
              <Section
                title={t("diseases.symptoms", "SYMPTOMS")}
                items={guide.symptoms || []}
              />
              <Section
                title={t("diseases.immediateActions", "IMMEDIATE ACTIONS")}
                items={guide.immediateActions || []}
              />
              <Section
                title={t("diseases.naturalControl", "NATURAL CONTROL")}
                items={guide.naturalControl || []}
              />
              <Section
                title={t("diseases.chemicalControl", "CHEMICAL CONTROL")}
                items={guide.chemicalControl || []}
              />
              <Section
                title={t("diseases.prevention", "PREVENTION")}
                items={guide.prevention || []}
              />

              {(guide.supplements || []).length > 0 && (
                <View className="mt-4 rounded-2xl border border-border-subtle bg-card p-5 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
                  <Text className="text-xs font-bold tracking-widest text-text-secondary dark:text-text-secondary-dark">
                    {t("diseases.recommendedProducts", "RECOMMENDED PRODUCTS")}
                  </Text>
                  <View className="mt-3 gap-2">
                    {guide.supplements.map((s, idx) => (
                      <View
                        key={idx}
                        className="rounded-2xl border border-border-subtle bg-white p-4 dark:border-border-subtle-dark dark:bg-gray-800"
                      >
                        <Text className="text-sm font-black text-text-primary dark:text-text-primary-dark">
                          {s.name}
                        </Text>
                        {!!s.buyLink && (
                          <ExternalLink href={s.buyLink} className="mt-2">
                            <Text className="text-sm font-extrabold text-brand-primary">
                              {t("diseases.buyLink", "Buy link →")}
                            </Text>
                          </ExternalLink>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
