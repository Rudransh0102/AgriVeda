import { Neutral, Semantic } from "@/constants/Colors";
import React from "react";
import { Animated, Text } from "react-native";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastConfig {
  message: string;
  type: ToastType;
  duration?: number;
}

class ToastManager {
  private callback: ((config: ToastConfig) => void) | null = null;

  setCallback(callback: (config: ToastConfig) => void) {
    this.callback = callback;
  }

  show(message: string, type: ToastType = "info", duration = 3000) {
    if (this.callback) {
      this.callback({ message, type, duration });
    }
  }

  success(message: string, duration?: number) {
    this.show(message, "success", duration);
  }

  error(message: string, duration?: number) {
    this.show(message, "error", duration);
  }

  info(message: string, duration?: number) {
    this.show(message, "info", duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, "warning", duration);
  }
}

export const Toast = new ToastManager();

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastConfig | null>(null);
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Toast.setCallback((config) => {
      setToast(config);

      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(config.duration || 3000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setToast(null));
    });
  }, []);

  const getToastColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return Semantic.success.main;
      case "error":
        return Semantic.error.main;
      case "warning":
        return Semantic.warning.main;
      case "info":
        return Semantic.info.main;
      default:
        return Semantic.info.main;
    }
  };

  return (
    <>
      {children}
      {toast && (
        <Animated.View
          className="absolute left-5 right-5 top-16 z-50 rounded-xl p-4 shadow-lg"
          style={{ opacity, backgroundColor: getToastColor(toast.type) }}
        >
          <Text
            className="text-center text-sm font-semibold"
            style={{ color: Neutral.white }}
          >
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </>
  );
}
