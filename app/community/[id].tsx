import { Toast } from "@/components/ui/Toast";
import { Brand, Neutral } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getApiBaseUrl } from "@/lib/api/client";
import { useLocalSearchParams } from "expo-router";
import { Send } from "lucide-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type ChatMessage = {
  id: number;
  sender: string;
  text: string;
  time?: string;
};

function toWsUrl(baseHttpUrl: string): string {
  if (baseHttpUrl.startsWith("https://")) return baseHttpUrl.replace(/^https:\/\//, "wss://");
  return baseHttpUrl.replace(/^http:\/\//, "ws://");
}

export default function CommunityChatRoomScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const roomId = decodeURIComponent((params.id || "general").toString());

  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const wsRef = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    const baseUrl = getApiBaseUrl();
    const wsBase = toWsUrl(baseUrl);
    const url = `${wsBase}/api/community/ws/${encodeURIComponent(roomId)}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      Toast.success(`Joined #${roomId}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg: ChatMessage = {
          id: Number(data.id || Date.now()),
          sender: String(data.sender || "Someone"),
          text: String(data.text || ""),
          time: data.time ? String(data.time) : undefined,
        };
        setMessages((prev) => [...prev, msg].slice(-200));
      } catch {
        // ignore malformed
      }
    };

    ws.onerror = () => {
      Toast.error("Chat connection error");
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      try {
        ws.close();
      } catch {
        // ignore
      }
    };
  }, [roomId]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      Toast.error("Not connected");
      return;
    }

    const payload = {
      text,
      sender: user?.username || "Farmer",
    };

    ws.send(JSON.stringify(payload));
    setInput("");
  };

  return (
    <SafeAreaView className="flex-1 bg-screen dark:bg-screen-dark" edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(450).springify()} className="p-6 pb-4">
            <Text className="mb-1 text-2xl font-black text-text-primary dark:text-text-primary-dark">
              #{roomId}
            </Text>
            <Text className="text-base text-text-secondary dark:text-text-secondary-dark">
              Real-time messages
            </Text>
          </Animated.View>

          <View className="px-6">
            <View className="gap-3">
              {messages.length === 0 ? (
                <View className="rounded-2xl border border-border-subtle bg-card p-6 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
                  <Text className="text-sm font-semibold text-text-tertiary dark:text-text-tertiary-dark">
                    No messages yet. Say hi!
                  </Text>
                </View>
              ) : (
                messages.map((m) => {
                  const mine = (user?.username || "Farmer") === m.sender;
                  return (
                    <View
                      key={m.id}
                      className={(mine ? "items-end" : "items-start") + " w-full"}
                    >
                      <View
                        className={
                          (mine ? "bg-brand-primary" : "bg-card dark:bg-card-dark") +
                          " max-w-[85%] rounded-2xl border border-border-subtle px-4 py-3 shadow-sm dark:border-border-subtle-dark"
                        }
                      >
                        {!mine && (
                          <Text className={"text-xs font-black " + (mine ? "text-white/90" : "text-text-tertiary dark:text-text-tertiary-dark")}>
                            {m.sender}
                          </Text>
                        )}
                        <Text className={(mine ? "text-white" : "text-text-primary dark:text-text-primary-dark") + " text-sm font-semibold leading-5"}>
                          {m.text}
                        </Text>
                        {!!m.time && (
                          <Text className={(mine ? "text-white/80" : "text-text-tertiary dark:text-text-tertiary-dark") + " mt-1 text-[11px] font-semibold"}>
                            {m.time}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>

        <View
          className="absolute left-0 right-0 border-t border-border-subtle bg-screen/95 px-4 py-3 dark:border-border-subtle-dark dark:bg-screen-dark/95"
          style={{ bottom: insets.bottom }}
        >
          <View className="flex-row items-center gap-3">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Message"
              placeholderTextColor="#9CA3AF"
              className="flex-1 rounded-2xl border border-border-default bg-white px-4 py-3 text-sm font-semibold text-text-primary dark:border-border-default-dark dark:bg-gray-800 dark:text-text-primary-dark"
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={send}
              className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary"
            >
              <Send size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-[11px] font-semibold text-text-tertiary dark:text-text-tertiary-dark">
            Tip: ensure your phone can reach the backend on LAN.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
