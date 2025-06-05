//(tabs)/_layout.tsx
// Importa os ícones da biblioteca Ionicons (estilo iOS) do pacote Expo
import { Ionicons } from '@expo/vector-icons';

// Importa o componente Tabs da biblioteca expo-router para navegação por abas
import { Tabs } from 'expo-router';

// Função que define a estrutura de navegação por abas do aplicativo
export default function TabLayout() {
  return (
    <Tabs
      // Define as opções de configuração da aba para cada rota
      screenOptions={({ route }) => ({
        // Esconde o cabeçalho padrão da navegação
        headerShown: false,

        // Define o ícone da aba com base no nome da rota
        tabBarIcon: ({ color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          // Escolhe o ícone baseado no nome da rota
          if (route.name === 'Medicamentos') iconName = 'medkit';
          else if (route.name === 'Alarmes') iconName = 'alarm';
          else iconName = 'ellipse'; // Ícone padrão caso a rota não seja reconhecida

          // Retorna o componente de ícone com o nome e cor definidos
          return <Ionicons name={iconName} size={24} color={color} />;
        },

        // Estilo do texto das labels das abas
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },

        // Cor das abas ativas e inativas
        tabBarActiveTintColor: '#3498db',   // azul
        tabBarInactiveTintColor: '#666',    // cinza escuro

        // Estilização da barra de abas
        tabBarStyle: {
          height: 60,         // altura da barra
          paddingBottom: 5,   // espaço inferior
        },
      })}
    />
  );
}
// O código acima define a estrutura de navegação por abas do aplicativo usando o expo-router.