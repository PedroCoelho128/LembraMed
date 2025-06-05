import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Alert } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

const recurrenceHours: Record<string, number> = {
  '8/8h': 8,
  '6/6h': 6,
  '12/12h': 12,
  '24/24h': 24,
};

interface Medication {
  id: string;
  name: string;
  dosage: string;
  recurrence: string;
  type: string;
  times: string[];
  notificationIds?: string[];
}

interface AlarmInfo {
  nome: string;
  horario: string;
}

export default function AlarmNotification() {
  const [alarmInfo, setAlarmInfo] = useState<AlarmInfo | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadAlarmData = async () => {
      const json = await AsyncStorage.getItem('latestAlarm');
      if (json) setAlarmInfo(JSON.parse(json));
    };

    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('../assets/alarm.mp3'));
      setSound(sound);
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
      Vibration.vibrate([500, 1000], true);
    };

    loadAlarmData();
    playSound();

    return () => {
      sound?.stopAsync();
      Vibration.cancel();
    };
  }, []);

  const handleStopAlarm = async () => {
    if (sound) await sound.stopAsync();
    Vibration.cancel();

    if (alarmInfo?.nome) {
      const stored = await AsyncStorage.getItem('medications');
      const medications = stored ? JSON.parse(stored) as Medication[] : [];
      const currentMedication = medications.find(med => med.name === alarmInfo.nome);

      if (currentMedication) {
        const incrementHours = recurrenceHours[currentMedication.recurrence];
        const now = new Date();
        const nextAlarmTime = new Date(now.getTime() + incrementHours * 60 * 60 * 1000);

        const trigger: Notifications.NotificationTriggerInput = {
          type: 'calendar',
          hour: nextAlarmTime.getHours(),
          minute: nextAlarmTime.getMinutes(),
          repeats: true,
        };

        try {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: `Hora do remédio: ${currentMedication.name}`,
              body: `Dosagem: ${currentMedication.dosage}`,
              sound: true, // Som padrão do Android
              priority: Notifications.AndroidNotificationPriority.HIGH,
              data: { medicationId: currentMedication.id },
            },
            trigger,
          });
          console.log(`Próximo alarme para ${currentMedication.name} agendado para ${nextAlarmTime.toLocaleTimeString()}. ID: ${id}`);
        } catch (error) {
          console.error('Erro ao reagendar notificação:', error);
          Alert.alert('Erro', 'Não foi possível reagendar o próximo alarme.');
        }
      }
    }

    router.push('/(tabs)/Alarmes');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hora do remédio!</Text>
      <Text style={styles.subtitle}>{alarmInfo?.nome}</Text>
      <Text style={styles.time}>{alarmInfo?.horario}</Text>

      <TouchableOpacity style={styles.button} onPress={handleStopAlarm}>
        <Text style={styles.buttonText}>Tomei meu remédio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d1f5d3', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 24, fontWeight: '600' },
  time: { fontSize: 20, marginBottom: 40 },
  button: { backgroundColor: '#2ecc71', padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
