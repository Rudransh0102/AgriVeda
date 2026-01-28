import { StatusBar } from "expo-status-bar";
import { Platform, Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-screen px-6 dark:bg-screen-dark">
      <View className="w-full max-w-md rounded-2xl border border-border-subtle bg-card p-6 shadow-sm dark:border-border-subtle-dark dark:bg-card-dark">
        <Text className="text-xl font-black text-text-primary dark:text-text-primary-dark">
          Modal
        </Text>
        <Text className="mt-2 text-sm font-semibold text-text-secondary dark:text-text-secondary-dark">
          Placeholder modal screen.
        </Text>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
