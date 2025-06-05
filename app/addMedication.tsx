import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddMedication = () => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [startTime, setStartTime] = useState('');
  const [recurrence, setRecurrence] = useState('8/8h');
  const router = useRouter();

  const handleSave = async () => {
    if (!medicationName || !dosage || !startTime) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    // Calculando os horários com base na recorrência
    const times = calculateTimes(startTime, recurrence);

    const newMedication = {
      id: new Date().toISOString(),  // Gerando um ID único
      name: medicationName,
      dosage,
      recurrence,
      times,
    };

    // Salvar no AsyncStorage
    const storedMedications = await AsyncStorage.getItem('medications');
    const medications = storedMedications ? JSON.parse(storedMedications) : [];
    medications.push(newMedication);
    await AsyncStorage.setItem('medications', JSON.stringify(medications));

    router.push('/Alarmes');
  };

  const calculateTimes = (startTime: string, recurrence: string) => {
    const times = [];
    const startDate = new Date(startTime);

    // Ajustar o incremento com base na recorrência
    let increment;
    switch (recurrence) {
      case '8/8h':
        increment = 8 * 60 * 60 * 1000;  // 8 horas em milissegundos
        break;
      case '6/6h':
        increment = 6 * 60 * 60 * 1000;  // 6 horas em milissegundos
        break;
      case '12/12h':
        increment = 12 * 60 * 60 * 1000; // 12 horas em milissegundos
        break;
      case '24/24h':
        increment = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
        break;
      default:
        increment = 24 * 60 * 60 * 1000; // Caso padrão, 24 horas
    }

    // Gerar os horários com base na recorrência
    for (let i = 0; i < 5; i++) {  // Gerar 5 horários para o alarme (exemplo)
      const newTime = new Date(startDate.getTime() + increment * i);
      times.push(newTime.toISOString());
    }

    return times;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Medicação</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do medicamento"
        value={medicationName}
        onChangeText={setMedicationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosagem"
        value={dosage}
        onChangeText={setDosage}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora inicial (ex: 08:00)"
        value={startTime}
        onChangeText={setStartTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Recorrência (ex: 8/8h)"
        value={recurrence}
        onChangeText={setRecurrence}
      />
      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddMedication;
