import * as Notifications from 'expo-notifications';

// Configura a categoria para o botão "Tomei meu remédio"
export async function configurarCategoriaNotificacao() {
  await Notifications.setNotificationCategoryAsync('remedio', [
    {
      identifier: 'tomado',
      buttonTitle: 'Tomei meu remédio',
      options: {
        isDestructive: false,
        opensAppToForeground: true,
      },
    },
  ]);
}

// Função para calcular horários da recorrência (exemplo para 24h)
function calcularHorariosRecorrencia(inicio: Date, intervaloHoras: number): Date[] {
  const horarios: Date[] = [];
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

  for (let i = 0; i < 24; i += intervaloHoras) {
    const proximoHorario = new Date(hoje);
    proximoHorario.setHours(inicio.getHours() + i, inicio.getMinutes(), 0, 0);
    if (proximoHorario > agora) {
      horarios.push(proximoHorario);
    }
  }
  return horarios;
}

// Função principal para agendar notificações considerando horários já tomados
export async function agendarNotificacoes(
  alarmId: string,
  nome: string,
  horaInicial: Date,
  intervaloHoras: number,
  takenTimes: string[] = []
) {
  await configurarCategoriaNotificacao();

  // Cancela todas notificações antigas para evitar duplicatas
  await Notifications.cancelAllScheduledNotificationsAsync();

  const notificacoes = calcularHorariosRecorrencia(horaInicial, intervaloHoras);

  for (const dataNotificacao of notificacoes) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora do remédio 💊',
        body: `Está na hora de tomar: ${nome}`,
        sound: true,
        categoryIdentifier: 'remedio',
        data: { medicationName: nome },
      },
      trigger: {
        type: 'calendar',
        hour: dataNotificacao.getHours(),
        minute: dataNotificacao.getMinutes(),
        second: 0,
        repeats: true,
      },
    });
  }
}
