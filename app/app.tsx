import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo categoria de notificação para ações (opcional)
Notifications.setNotificationCategoryAsync('ALARM_CATEGORY', [
  {
    identifier: 'TAKEN',
    buttonTitle: 'Tomei o remédio',
    options: { opensAppToForeground: true },
  },
]);

export default function App() {
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    requestNotificationPermission();

    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        // Salva dados da notificação para a tela de alarme
        if (notification.request.content && notification.request.content.title) {
          if (notification.request.content.title.startsWith('Hora do remédio:')) {
            const medicationName = notification.request.content.title.split(': ')[1];
            const horario = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            await AsyncStorage.setItem('latestAlarm', JSON.stringify({ nome: medicationName, horario }));
          }
        }
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      },
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
      const actionId = response.actionIdentifier;
      const medicationId = response.notification.request.content?.data?.medicationId;

      if (actionId === 'TAKEN') {
        if (medicationId) {
          console.log(`Medicamento ${medicationId} marcado como tomado.`);
          // Aqui você pode atualizar AsyncStorage ou estado global
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

  async function requestNotificationPermission() {
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para notificações negada! O app pode não funcionar corretamente.');
      }
    } else {
      alert('Use um dispositivo físico para receber notificações.');
    }
  }

  return <Stack />;
}
