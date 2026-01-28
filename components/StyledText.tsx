import React from "react";
import { Text, type TextProps } from "react-native";

export function MonoText({
  className,
  ...props
}: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={(className ? className + " " : "") + "font-mono"}
    />
  );
}
