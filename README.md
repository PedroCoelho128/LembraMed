
💊 LembraMed

LembraMed é um aplicativo mobile desenvolvido com React Native e Expo, criado para ajudar os usuários a lembrar de tomar seus medicamentos corretamente e nos horários certos. O app permite cadastrar medicamentos com horários recorrentes, enviar notificações locais e funciona mesmo com o celular bloqueado, garantindo que nenhuma dose seja esquecida.

# 🗂 Estrutura do Projeto
```shell
'
LembraMed/
├── app/                                # Diretório principal das telas e rotas
│   ├── (tabs)/                         # Navegação com abas principais
│   │   ├── _layout.tsx                 # Layout das abas
│   │   ├── Alarmes.tsx                 # Tela principal com lista de alarmes
│   │   ├── Medicamentos.tsx            # Tela de cadastro de medicamento
│   ├── AlarmNotification.tsx           # Tela exibida quando o alarme toca
│   ├── editAlarmes.tsx                 # Tela de edição de alarmes
│   ├── app.tsx                         # Inicialização do app
│   ├── index.tsx                       # Tela inicial (pode redirecionar)
│   └── _layout.tsx                     # Layout geral do roteamento
│
├── assets/
│   ├── fonts/                          # Fontes personalizadas (caso existam)
│   └── images/
│       └── alarm.mp3                   # Som de alarme personalizado
│
├── components/
│   └── TimePicker.tsx                  # Componente reutilizável de hora
│
├── utils/
│   ├── notifications.ts                # Lógica para agendar notificações
│   └── storage.ts                      # Funções de armazenamento local
│
├── node_modules/
├── package.json
├── app.json
├── README.md
```

# 📱 Funcionalidades

✅ Cadastro de medicamentos com:

-Nome do remédio

-Dosagem

-Tipo (Comprimido, ML, etc.)

-Horário inicial

-Recorrência configurável (6/6h, 8/8h, 12/12h, 24/24h)

✅ Cálculo automático dos horários com base na recorrência

✅ Visualização da lista de alarmes salvos

✅ Edição de alarmes existentes

✅ Exclusão de alarmes

✅ Alarmes funcionais com notificações locais

✅ Alarme aparece mesmo com o celular bloqueado

✅ Tela de alarme com botão:

-Tomei meu remédio

# 🧠 Tecnologias Utilizadas

-React Native

-Expo

-expo-router

-AsyncStorage

-@react-native-community/datetimepicker

-@react-native-picker/picker

-expo-notifications

----

# 🚀 Como Executar o Projeto

Pré-requisitos:

Node.js instalado
Expo CLI instalada globalmente: npm install -g expo-cli
Emulador Android/iOS ou dispositivo físico com o app Expo Go

Passos:

-Clone o repositório

git clone https://github.com/seu-usuario/lembramed.git
cd lembramed

-Instale as dependências

npm install

-Execute o projeto

npx expo start

- Abra o app escaneando o QR Code com o Expo Go ou use um emulador.

# 🔔 Permissões Necessárias

Para funcionar corretamente, o app solicita as seguintes permissões:

Permissão para notificações locais

Permissão para exibir alarmes mesmo com a tela bloqueada

# 📦 Armazenamento Local

Todos os dados são armazenados localmente utilizando AsyncStorage. Isso garante persistência mesmo com o app fechado, sem necessidade de conexão com internet.

# 🧪 Testes

Para testar os alarmes:

Cadastre um medicamento com uma recorrência curta (ex: 6/6h ou 8/8h).

Aguarde ou ajuste o horário inicial para alguns minutos à frente da hora atual.

Verifique se a notificação é disparada corretamente.

# 🧠 Futuras Melhorias

Sincronização com a nuvem (Firebase ou MongoDB)

Integração com smartwatch

Histórico de medicamentos tomados

Suporte a múltiplos usuários
