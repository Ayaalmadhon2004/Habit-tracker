import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // استيراد جديد

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}