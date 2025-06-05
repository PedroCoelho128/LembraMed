import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Medicamentos') iconName = 'medkit';
          else if (route.name === 'Alarmes') iconName = 'alarm';
          else iconName = 'ellipse';

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
      })}
    />
  );
}
