//(tabs)/_layout.tsx

// Importa os ícones Ionicons do pacote Expo Vector Icons
import { Ionicons } from '@expo/vector-icons';

// Importa o componente Tabs do expo-router para navegação por abas
import { Tabs } from 'expo-router';

// Importa hook para detectar o tema do sistema (claro ou escuro)
import { useColorScheme } from 'react-native';

// Componente que define a estrutura de navegação por abas do app
export default function TabLayout() {
  // Detecta se o usuário está no tema claro ou escuro
  const colorScheme = useColorScheme();

  return (
    <Tabs
      // Configura opções para cada aba dinamicamente, baseado na rota
      screenOptions={({ route }) => ({
        // Esconde o cabeçalho padrão da navegação (top bar)
        headerShown: false,

        // Define o ícone da aba, recebe cor e tamanho automaticamente
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          // Define ícone conforme nome da rota
          if (route.name === 'Medicamentos') iconName = 'medkit';
          else if (route.name === 'Alarmes') iconName = 'alarm';
          else iconName = 'ellipse'; // ícone padrão para outras abas

          // Retorna o componente de ícone com o nome e as propriedades
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // Estilo do texto das labels das abas (fonte e peso)
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },

        // Cor do texto da aba ativa
        tabBarActiveTintColor: '#3498db', // azul

        // Cor do texto da aba inativa
        tabBarInactiveTintColor: '#666',  // cinza escuro

        // Cor de fundo da aba ativa, muda conforme tema do sistema
        tabBarActiveBackgroundColor: colorScheme === 'dark' ? '#222' : '#e6f0ff',

        // Estilização geral da barra de abas
        tabBarStyle: {
          height: 60,                 // altura da barra
          paddingBottom: 5,           // espaço inferior
          backgroundColor:            // fundo da barra muda conforme tema
            colorScheme === 'dark' ? '#121212' : '#fff',
        },
      })}
    />
  );
}
