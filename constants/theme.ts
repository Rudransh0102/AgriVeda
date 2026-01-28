import { Brand, Neutral, Semantic, Shadows } from "./Colors";

export type ColorScheme = "light" | "dark";

export const getThemeColors = (isDark: boolean) => ({
  background: {
    screen: isDark ? Neutral[900] : Brand.lightGreen,
    card: isDark ? Neutral[800] : Neutral.white,
    cardAlt: isDark ? Neutral[700] : Neutral[50],
    elevated: isDark ? Neutral[800] : Neutral.white,
  },
  text: {
    primary: isDark ? Neutral[50] : Neutral[900],
    secondary: isDark ? Neutral[300] : Neutral[600],
    tertiary: isDark ? Neutral[400] : Neutral[500],
    inverse: isDark ? Neutral[900] : Neutral[50],
  },
  border: {
    subtle: isDark ? Neutral[700] : Neutral[200],
    default: isDark ? Neutral[600] : Neutral[300],
    strong: isDark ? Neutral[500] : Neutral[400],
  },
  brand: {
    primary: Brand.primary,
    secondary: Brand.secondary,
    accent: Brand.accent,
  },
  semantic: {
    success: Semantic.success.main,
    successLight: Semantic.success.light,
    successDark: Semantic.success.dark,
    error: Semantic.error.main,
    errorLight: Semantic.error.light,
    errorDark: Semantic.error.dark,
    warning: Semantic.warning.main,
    warningLight: Semantic.warning.light,
    warningDark: Semantic.warning.dark,
    info: Semantic.info.main,
    infoLight: Semantic.info.light,
    infoDark: Semantic.info.dark,
  },
  button: {
    primary: Brand.primary,
    primaryText: Neutral.white,
    secondary: isDark ? Neutral[700] : Neutral[100],
    secondaryText: isDark ? Neutral[100] : Neutral[900],
    disabled: isDark ? Neutral[700] : Neutral[200],
    disabledText: isDark ? Neutral[500] : Neutral[400],
  },
  input: {
    background: isDark ? Neutral[800] : Neutral.white,
    border: isDark ? Neutral[600] : Neutral[300],
    placeholder: isDark ? Neutral[500] : Neutral[400],
    text: isDark ? Neutral[50] : Neutral[900],
  },
  tab: {
    active: Brand.primary,
    inactive: isDark ? Neutral[400] : Neutral[500],
    background: isDark ? Neutral[900] : Neutral.white,
  },
});

export const getCardShadow = (isDark: boolean) =>
  isDark ? Shadows.dark.md : Shadows.light.md;

export const getButtonShadow = (isDark: boolean) =>
  isDark ? Shadows.dark.sm : Shadows.light.sm;
