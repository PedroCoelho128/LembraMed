//app/_layout.tsx
// Importa o componente Stack do expo-router para gerenciar a navegação em pilha
import { Stack } from 'expo-router';

// Componente principal responsável pela configuração das rotas do app
export default function RootLayout() {
  // Retorna o Stack Navigator com a opção de esconder o cabeçalho padrão (headerShown: false)
  return <Stack screenOptions={{ headerShown: false }} />;
}
// O Stack Navigator é uma forma de navegar entre diferentes telas do aplicativo, permitindo empilhar telas e voltar para telas anteriores.
// O RootLayout é o ponto de entrada para a navegação do aplicativo, onde todas as rotas são definidas.
// O Stack é um componente que permite criar uma navegação em pilha, onde cada nova tela é empilhada sobre a anterior.