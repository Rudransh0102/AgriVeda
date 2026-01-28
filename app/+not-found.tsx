import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-screen p-6 dark:bg-screen-dark">
        <Text className="text-xl font-black text-text-primary dark:text-text-primary-dark">
          This screen doesn't exist.
        </Text>
        <Link href="/(tabs)/home" asChild>
          <Pressable className="mt-5 rounded-full bg-brand-primary px-6 py-3">
            <Text className="text-sm font-black text-white">
              Go to home screen
            </Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
