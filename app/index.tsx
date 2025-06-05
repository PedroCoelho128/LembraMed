//app/index.tsx
// Importa o componente Redirect da biblioteca expo-router
// Esse componente é usado para redirecionar automaticamente o usuário para outra rota
import { Redirect } from 'expo-router';

// Exporta o componente padrão da tela Index
export default function Index() {
  // Redireciona automaticamente o usuário para a rota "/(tabs)/Alarmes"
  // Isso é útil quando você quer que a tela inicial do app abra diretamente uma aba específica
  return <Redirect href="/(tabs)/Alarmes" />;
}