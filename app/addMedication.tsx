// app/AddMedication.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import TimePicker from '../components/TimePicker'; // Assumindo que o TimePicker é um componente personalizado
import DropDownPicker from 'react-native-dropdown-picker';

// Importando o tipo correto para o trigger
const { SchedulableTriggerInputTypes } = Notifications;

const AddMedication = () => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [unit, setUnit] = useState('comprimidos');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'comprimidos', value: 'comprimidos' },
    { label: 'mL', value: 'mL' },
  ]);
  const router = useRouter();

  const handleSave = async () => {
    const newMedication = {
      id: Date.now().toString(),
      name,
      dosage: `${dosage} ${unit}`,
      time: time.toString(),
    };

    // Carregar as medicações já salvas
    const storedMedications = await AsyncStorage.getItem('medications');
    const medications = storedMedications ? JSON.parse(storedMedications) : [];
    
    // Adicionar o novo alarme
    medications.push(newMedication);
    await AsyncStorage.setItem('medications', JSON.stringify(medications));

    // Agendar a notificação para o novo alarme
    await scheduleNotification(newMedication);

    // Navegar para a tela de alarmes
    router.push('/Alarmes');
  };

  // Função para agendar a notificação
  const scheduleNotification = async (medication: any) => {
    const triggerDate = new Date(medication.time); // Definir o horário do alarme

    // Definindo trigger adequado com o tipo correto
    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL, // Usando o tipo correto para o trigger
      seconds: Math.floor((triggerDate.getTime() - new Date().getTime()) / 1000), // Diferença em segundos entre agora e o horário do alarme
      repeats: false, // Defina como true se você quiser que a notificação se repita
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora do Remédio!',
        body: `${medication.name} - ${medication.dosage}`,
        sound: 'default', // Som padrão
      },
      trigger, // Usando o trigger que calcula a diferença em segundos
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Alarme</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Medicação"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.dosageInput]}
          placeholder="Dosagem"
          value={dosage}
          onChangeText={setDosage}
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <DropDownPicker
          open={open}
          value={unit}
          items={items}
          setOpen={setOpen}
          setValue={setUnit}
          setItems={setItems}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          containerStyle={{ flex: 1 }}
          dropDownDirection="TOP"
        />
      </View>

      <Text style={styles.label}>
        Hora selecionada: {`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
      </Text>

      <TimePicker time={time} setTime={setTime} />

      <View style={styles.button}>
        <Button title="Salvar" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 20,
    marginBottom: 16,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dosageInput: {
    flex: 1,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default AddMedication;
