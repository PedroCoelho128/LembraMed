import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AddMedication = () => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [recurrence, setRecurrence] = useState('8/8h');
  const [type, setType] = useState('Comprimido');
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!medicationName || !dosage) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const times = calculateTimes(startTime, recurrence);

    const newMedication = {
      id: new Date().toISOString(),
      name: medicationName,
      dosage,
      recurrence,
      type,
      times,
    };

    const stored = await AsyncStorage.getItem('medications');
    const meds = stored ? JSON.parse(stored) : [];
    meds.push(newMedication);
    await AsyncStorage.setItem('medications', JSON.stringify(meds));

    router.push('/Alarmes');
  };

  const calculateTimes = (initialTime: Date, recurrence: string) => {
    const times = [];
    let incrementHours = 0;

    switch (recurrence) {
      case '6/6h':
        incrementHours = 6;
        break;
      case '8/8h':
        incrementHours = 8;
        break;
      case '12/12h':
        incrementHours = 12;
        break;
      case '24/24h':
        incrementHours = 24;
        break;
    }

    const quantity = 24 / incrementHours;

    for (let i = 0; i < quantity; i++) {
      const newTime = new Date(initialTime.getTime() + i * incrementHours * 60 * 60 * 1000);
      times.push(newTime.toISOString());
    }

    return times;
  };

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
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

      {/* Hora inicial */}
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={styles.timePickerButton}
      >
        <Text style={styles.timePickerText}>
          Hora inicial: {formatTime(startTime)}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) setStartTime(selectedDate);
          }}
        />
      )}

      {/* Recorrência */}
      <Text style={styles.label}>Recorrência</Text>
      <Picker
        selectedValue={recurrence}
        style={styles.picker}
        onValueChange={(itemValue) => setRecurrence(itemValue)}
      >
        <Picker.Item label="8/8h" value="8/8h" />
        <Picker.Item label="6/6h" value="6/6h" />
        <Picker.Item label="12/12h" value="12/12h" />
        <Picker.Item label="24/24h" value="24/24h" />
      </Picker>

      {/* Tipo */}
      <Text style={styles.label}>Tipo</Text>
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Comprimido" value="Comprimido" />
        <Picker.Item label="ML" value="ML" />
      </Picker>

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  picker: {
    height: 50,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  timePickerButton: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 12,
  },
  timePickerText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddMedication;
