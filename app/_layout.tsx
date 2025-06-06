// app/_layout.tsx

// Importa o componente Stack do expo-router para gerenciar a navegação em pilha
import { Stack } from 'expo-router';

// Componente principal que configura o layout raiz da navegação do app
export default function RootLayout() {
  // Retorna o Stack Navigator com opção para esconder o cabeçalho padrão (header)
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Oculta o cabeçalho nativo das telas
      }}
    />
  );
}

/*
Explicação:
- O Stack Navigator permite empilhar telas, navegando entre elas com facilidade.
- O RootLayout é o componente de nível superior que engloba toda a navegação.
- Com headerShown: false, você pode criar cabeçalhos personalizados em cada tela, se desejar.
*/
