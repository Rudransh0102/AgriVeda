import { Brand, Neutral, Semantic } from "@/constants/Colors";
import { assistantService } from "@/lib/services/assistantService";
import { useRouter } from "expo-router";
import {
  Bookmark,
  BookmarkCheck,
  Bug,
  ChevronRight,
  Droplets,
  Leaf,
  MessageSquare,
} from "lucide-react-native";
import React from "react";
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

export default function VideosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [aiQuestion, setAiQuestion] = React.useState("");
  const [aiAnswer, setAiAnswer] = React.useState<string | null>(null);
  const [loadingAI, setLoadingAI] = React.useState(false);
  const [bookmarks, setBookmarks] = React.useState<string[]>([]);

  const toggleBookmark = React.useCallback((key: string) => {
    setBookmarks((prev) => {
      const has = prev.includes(key);
      const next = has ? prev.filter((k) => k !== key) : [...prev, key];
      return next;
    });
  }, []);

  const askAI = React.useCallback(async () => {
    const q = aiQuestion.trim();
    if (!q) return;
    setLoadingAI(true);
    try {
      const res = await assistantService.chat(q);
      setAiAnswer(res);
    } catch (e) {
      setAiAnswer("Sorry, I couldn't fetch guidance right now.");
    } finally {
      setLoadingAI(false);
    }
  }, [aiQuestion]);

  const lessons = [
    {
      key: "basics",
      title: "Leaf Spot: early signs",
      subtitle: "What to look for before it spreads",
      icon: Leaf,
      tint: Brand.primary,
      iconBgClass: "bg-brand-primary/10",
    },
    {
      key: "watering",
      title: "Smart watering schedule",
      subtitle: "Reduce stress and improve yield",
      icon: Droplets,
      tint: Semantic.info.main,
      iconBgClass: "bg-blue-500/10",
    },
    {
      key: "pests",
      title: "Common pests in crops",
      subtitle: "Identification and prevention",
      icon: Bug,
      tint: Brand.accent,
      iconBgClass: "bg-brand-accent/10",
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
            Learn
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            Quick guides for better decisions
          </Text>
        </Animated.View>

        {/* AI Quick Help */}
        <View className="px-6">
          <View className="rounded-2xl border border-border-subtle bg-card p-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
            <View className="flex-row items-center gap-2 mb-3">
              <MessageSquare size={18} color={Brand.primary} />
              <Text className="text-sm font-black text-text-primary dark:text-text-primary-dark">
                Ask AI for guidance
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <TextInput
                value={aiQuestion}
                onChangeText={setAiQuestion}
                onSubmitEditing={askAI}
                placeholder="Ask about pests, watering, or crop care..."
                placeholderTextColor={Neutral[400]}
                className="flex-1 rounded-xl border border-border-subtle bg-white p-3 text-sm font-semibold text-text-primary dark:border-border-subtle-dark dark:bg-gray-800 dark:text-text-primary-dark"
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={askAI}
                disabled={loadingAI}
                className="rounded-xl bg-brand-primary px-4 py-3"
              >
                <Text className="text-white font-bold">
                  {loadingAI ? "Thinking…" : "Ask"}
                </Text>
              </TouchableOpacity>
            </View>
            {!!aiAnswer && (
              <View className="mt-3 rounded-xl border border-border-subtle bg-white p-3 dark:border-border-subtle-dark dark:bg-gray-800">
                <Text className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                  {aiAnswer}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/chats" as any)}
                  className="mt-3 self-start rounded-lg border border-brand-primary px-3 py-2"
                >
                  <Text className="text-brand-primary font-bold">
                    Open full chat →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View className="p-6 pt-2">
          <View className="gap-3">
            {lessons.map((l, idx) => {
              const Icon = l.icon;
              return (
                <Animated.View
                  key={l.key}
                  entering={FadeInDown.duration(450)
                    .delay(70 * idx)
                    .springify()}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-row items-center gap-3 rounded-2xl border border-border-subtle bg-card px-4 py-4 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark"
                  >
                    <View
                      className={
                        "h-10 w-10 items-center justify-center rounded-full " +
                        l.iconBgClass
                      }
                    >
                      <Icon size={18} color={l.tint} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-sm font-black text-text-primary dark:text-text-primary-dark"
                        numberOfLines={1}
                      >
                        {l.title}
                      </Text>
                      <Text
                        className="mt-0.5 text-xs font-semibold text-text-secondary dark:text-text-secondary-dark"
                        numberOfLines={1}
                      >
                        {l.subtitle}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                      {bookmarks.includes(l.key) ? (
                        <BookmarkCheck size={18} color={Brand.primary} />
                      ) : (
                        <Bookmark size={18} color={Neutral[500]} />
                      )}
                      <ChevronRight size={18} color={Neutral[500]} />
                    </View>
                  </TouchableOpacity>
                  <View className="mt-2 flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => toggleBookmark(l.key)}
                      className="rounded-lg border border-border-subtle px-3 py-2 dark:border-border-subtle-dark"
                    >
                      <Text className="text-xs font-bold text-text-secondary dark:text-text-secondary-dark">
                        {bookmarks.includes(l.key) ? "Saved" : "Save"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push("/tips" as any)}
                      className="rounded-lg border border-brand-primary px-3 py-2"
                    >
                      <Text className="text-xs font-bold text-brand-primary">
                        Read tips →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
