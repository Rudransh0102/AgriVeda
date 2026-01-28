import { Neutral } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import {
  assistantService,
  type AssistantMessage,
} from "@/lib/services/assistantService";
import { MessageCircle, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
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

export default function ChatsScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("common");

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: "assistant",
      content:
        "Namaste! I’m Farm IQ Assistance. Ask me anything about crops, diseases, weather advisories, irrigation, or market tips.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom whenever messages change
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: AssistantMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const response = await assistantService.chat(
        text,
        messages.concat(userMsg),
      );
      const assistantMsg: AssistantMessage = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      const assistantMsg: AssistantMessage = {
        role: "assistant",
        content:
          e?.message ||
          "Sorry, I’m having trouble connecting right now. Please try again.",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setSending(false);
    }
  };

  const Header = (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="p-6 pb-4"
    >
      <View className="flex-row items-center gap-3">
        <MessageCircle size={28} color={isDark ? Neutral[300] : Neutral[700]} />
        <View>
          <Text className="text-2xl font-black text-text-primary dark:text-text-primary-dark">
            {t("chats.title")}
          </Text>
          <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
            {t("chats.subtitle")}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const Bubble = ({ msg }: { msg: AssistantMessage }) => {
    const isUser = msg.role === "user";
    if (isUser) {
      return (
        <View className="mb-3">
          <View className="self-end max-w-[85%] rounded-2xl bg-brand-primary px-4 py-3">
            <Text className="text-white text-sm font-semibold">
              {msg.content}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View className="mb-3">
        <View
          className={
            "self-start max-w-[85%] rounded-2xl border px-4 py-3 " +
            (isDark
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-100 shadow-sm")
          }
        >
          <Text
            className={
              "text-sm font-semibold " +
              (isDark ? "text-gray-200" : "text-gray-800")
            }
          >
            {msg.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-screen dark:bg-screen-dark"
      edges={["top", "bottom"]}
    >
      {Header}

      {/* Messages */}
      <View className="flex-1 px-4">
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m, idx) => (
            <Bubble key={idx} msg={m} />
          ))}
          {sending && (
            <View
              className={
                "self-start max-w-[70%] rounded-2xl border px-4 py-2 " +
                (isDark
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-gray-100")
              }
            >
              <Text
                className={
                  "text-xs font-semibold " +
                  (isDark ? "text-gray-400" : "text-gray-500")
                }
              >
                {t("chats.thinking")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Input bar */}
      <View
        className={
          "px-4 pt-2 pb-2 border-t " +
          (isDark
            ? "bg-screen-dark border-gray-800"
            : "bg-white border-gray-200")
        }
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View
          className={
            "flex-row items-center rounded-2xl border px-3 " +
            (isDark
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200 shadow-sm")
          }
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            editable={!sending}
            placeholder="Type your question…"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            className={
              "flex-1 py-2 text-sm font-semibold " +
              (isDark ? "text-white" : "text-gray-900")
            }
            multiline
          />
          <TouchableOpacity
            onPress={onSend}
            disabled={sending || !input.trim()}
            activeOpacity={0.85}
            className={
              "ml-2 h-10 w-10 items-center justify-center rounded-full " +
              (sending || !input.trim()
                ? isDark
                  ? "bg-gray-800"
                  : "bg-gray-200"
                : "bg-brand-primary")
            }
          >
            <Send
              size={18}
              color={
                sending || !input.trim()
                  ? isDark
                    ? "#9CA3AF"
                    : "#6B7280"
                  : "#fff"
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
