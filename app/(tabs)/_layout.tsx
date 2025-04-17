// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Medicamentos') iconName = 'medkit';
          else if (route.name === 'Alarmes') iconName = 'alarm';
          else iconName = 'ellipse';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    />
  );
}
