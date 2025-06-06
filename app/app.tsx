import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Stack } from 'expo-router';
import { markTimeAsTaken, getAlarmsFromStorage } from '../utils/storage';
import { agendarNotificacoes } from '../utils/notifications';

// Extrai horário da notificação para marcar como tomado
function extrairHorarioDaNotificacao(notification: Notifications.Notification): string | null {
  const trigger = notification.request.trigger;
  if (!trigger) return null;

  if ('hour' in trigger && 'minute' in trigger) {
    const h = String(trigger.hour).padStart(2, '0');
    const m = String(trigger.minute).padStart(2, '0');
    return `${h}:${m}`;
  }

  return null;
}

export default function App() {
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    checkAndRequestNotificationPermission();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
      const actionId = response.actionIdentifier;
      if (actionId === 'tomado') {
        const notification = response.notification;
        const medicationName = notification.request.content.data?.medicationName;
        const alarmId = notification.request.content.data?.alarmId;
        const time = extrairHorarioDaNotificacao(notification);

        if (medicationName && alarmId && time) {
          console.log(`Medicamento ${medicationName} tomado no horário ${time}`);

          // Marca o horário como tomado no AsyncStorage
          await markTimeAsTaken(String(alarmId), time);

          // Reagende as notificações atualizadas
          const alarms = await getAlarmsFromStorage();
          const alarm = alarms.find(a => a.id === alarmId);
          if (alarm) {
            const intervaloHoras = Number(alarm.recurrence);
            const horaInicial = new Date();
            await agendarNotificacoes(alarm.id, alarm.name, horaInicial, intervaloHoras, alarm.takenTimes || []);
          }
        }
      }
    });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function checkAndRequestNotificationPermission() {
    if (!Device.isDevice) {
      alert('Use um dispositivo físico para receber notificações.');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permissão para notificações negada! O app pode não funcionar corretamente.');
    }
  }

  return <Stack />;
}
