// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: COLORS.primary, headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}