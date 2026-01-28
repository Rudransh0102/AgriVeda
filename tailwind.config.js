/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["SpaceMono"],
      },
      colors: {
        // App tokens (mirrors constants/Colors.ts + constants/theme.ts)
        brand: {
          primary: "#0F766E",
          secondary: "#10B981",
          accent: "#F97316",
          sun: "#FCD34D",
          lightGreen: "#DFF7F0",
          darkGreen: "#064E3B",
        },
        screen: "#DFF7F0",
        "screen-dark": "#111827",
        card: "#FFFFFF",
        "card-dark": "#1F2937",
        "card-alt": "#F9FAFB",
        "card-alt-dark": "#374151",
        "text-primary": "#111827",
        "text-primary-dark": "#F9FAFB",
        "text-secondary": "#4B5563",
        "text-secondary-dark": "#D1D5DB",
        "text-tertiary": "#6B7280",
        "text-tertiary-dark": "#9CA3AF",
        "border-subtle": "#E5E7EB",
        "border-subtle-dark": "#374151",
        "border-default": "#D1D5DB",
        "border-default-dark": "#4B5563",
      },
    },
  },
  plugins: [],
};
