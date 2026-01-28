// Brand Colors (aligned to the provided UI)
export const Brand = {
  primary: "#0F766E", // Teal-700 (primary buttons)
  secondary: "#10B981", // Emerald-500 (secondary elements)
  accent: "#F97316", // Orange-500 (highlights)
  sun: "#FCD34D", // Yellow-300 (weather)
  lightGreen: "#DFF7F0", // Mint background
  darkGreen: "#064E3B", // Deep green text
};

// Semantic Colors
export const Semantic = {
  success: {
    main: "#10B981",
    light: "#D1FAE5",
    dark: "#065F46",
  },
  error: {
    main: "#EF4444",
    light: "#FEE2E2",
    dark: "#991B1B",
  },
  warning: {
    main: "#F59E0B",
    light: "#FEF3C7",
    dark: "#92400E",
  },
  info: {
    main: "#3B82F6",
    light: "#DBEAFE",
    dark: "#1E40AF",
  },
};

// Neutral Colors
export const Neutral = {
  white: "#FFFFFF",
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DB",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
  black: "#000000",
};

// Export all colors
export const Colors = {
  brand: Brand,
  semantic: Semantic,
  neutral: Neutral,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Animation Durations
export const Animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Shadows
export const Shadows = {
  light: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  dark: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
