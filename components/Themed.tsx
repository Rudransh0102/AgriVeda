import React from "react";
import { Text as RNText, View as RNView } from "react-native";

export type TextProps = RNText["props"] & { className?: string };
export type ViewProps = RNView["props"] & { className?: string };

// Minimal compatibility helper (kept because the Expo template exports it).
export function useThemeColor(
  props: { light?: string; dark?: string },
  _colorName: string,
): string {
  return props.light ?? props.dark ?? "#111827";
}

export function Text(props: TextProps) {
  return <RNText {...props} />;
}

export function View(props: ViewProps) {
  return <RNView {...props} />;
}
