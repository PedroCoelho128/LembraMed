// app/editMedication/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimePicker from '../../components/TimePicker';

const EditMedication = ({ params }: any) => {
  const [alarm, setAlarm] = useState<any | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const loadAlarm = async () => {
      // Verifique se o parâmetro id está disponível
      if (!params.id) {
        console.error('ID não encontrado!');
        return;
      }

      const storedAlarms = await AsyncStorage.getItem('alarms');
      if (storedAlarms) {
        const alarms = JSON.parse(storedAlarms);
        const alarm = alarms.find((item: any) => item.id === params.id);
        if (alarm) {
          setAlarm(alarm);
          setTime(new Date(alarm.time)); // Definindo o tempo como o horário do alarme
        }
      }
    };

    loadAlarm();
  }, [params.id]);

  if (!alarm) return <Text>Carregando...</Text>;

  const saveAlarm = async () => {
    const storedAlarms = await AsyncStorage.getItem('alarms');
    const alarms = storedAlarms ? JSON.parse(storedAlarms) : [];
    const updatedAlarms = alarms.map((item: any) =>
      item.id === alarm.id ? { ...item, time } : item
    );
    await AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));
    alert('Alarme salvo!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Alarme</Text>
      <Text>Nome: {alarm.name}</Text>
      <Text>Hora selecionada: {`${time.getHours()}:${time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}`}</Text>
      <TimePicker time={time} setTime={setTime} />
      <Button title="Salvar" onPress={saveAlarm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
});

export default EditMedication;
