import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import "@/lib/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeRoot>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeRoot>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ThemeRoot({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();

  return (
    <GestureHandlerRootView className="flex-1">
      <View className={(isDark ? "dark " : "") + "flex-1"}>{children}</View>
    </GestureHandlerRootView>
  );
}
