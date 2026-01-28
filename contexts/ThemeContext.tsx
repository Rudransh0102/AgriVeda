import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

type ThemeContextType = {
  colorScheme: ColorScheme;
  isDark: boolean;
  toggleColorScheme: () => Promise<void>;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@agriveda_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    deviceColorScheme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        setColorSchemeState(savedTheme);
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    }
  };

  const setColorScheme = async (scheme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
      setColorSchemeState(scheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const toggleColorScheme = async () => {
    const newScheme = colorScheme === "light" ? "dark" : "light";
    await setColorScheme(newScheme);
  };

  const value: ThemeContextType = {
    colorScheme,
    isDark: colorScheme === "dark",
    toggleColorScheme,
    setColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
