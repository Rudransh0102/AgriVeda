// NativeWind v4 + Expo Router
// This enables Tailwind className styling on native via Metro.
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push("tflite");

module.exports = withNativeWind(config, {
  input: "./global.css",
});
