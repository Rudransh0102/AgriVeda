import React from "react";
import { Linking, Pressable, Text, View } from "react-native";

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View className="items-center px-6">
      <Text className="text-center text-base font-semibold text-text-secondary dark:text-text-secondary-dark">
        Open up the code for this screen:
      </Text>

      <View className="my-2 rounded bg-black/5 px-2 py-1 dark:bg-white/10">
        <Text className="font-mono text-sm text-text-primary dark:text-text-primary-dark">
          {path}
        </Text>
      </View>

      <Text className="text-center text-base font-semibold text-text-secondary dark:text-text-secondary-dark">
        Change any text, save the file, and the app will update.
      </Text>

      <Pressable
        className="mt-4 rounded-full bg-brand-primary px-5 py-3"
        onPress={() =>
          Linking.openURL("https://docs.expo.dev/get-started/expo-go/")
        }
      >
        <Text className="text-sm font-black text-white">
          Help: app not updating?
        </Text>
      </Pressable>
    </View>
  );
}
