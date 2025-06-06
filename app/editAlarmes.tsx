import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  recurrence: string;
  type: string;
  times: string[];
}

const recurrenceHours: Record<string, number> = {
  '8/8h': 8,
  '6/6h': 6,
  '12/12h': 12,
  '24/24h': 24,
};

const EditAlarmes = () => {
  const { medication } = useLocalSearchParams<{ medication: string }>();
  const parsedMedication = medication ? JSON.parse(medication) : null;

  const getDateFromTimeString = (timeStr: string): Date => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  };

  const initialStartTime = parsedMedication?.times && parsedMedication.times.length > 0
    ? getDateFromTimeString(parsedMedication.times[0])
    : new Date();

  const [medicationName, setMedicationName] = useState<string>(parsedMedication?.name || '');
  const [dosage, setDosage] = useState<string>(parsedMedication?.dosage || '');
  const [recurrence, setRecurrence] = useState<string>(parsedMedication?.recurrence || '');
  const [type, setType] = useState<string>(parsedMedication?.type || '');
  const [startTime, setStartTime] = useState<Date>(initialStartTime);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const router = useRouter();

  const formatTime = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const calculateTimes = (initialTime: Date, recurrence: string) => {
    const times = [];
    const incrementHours = recurrenceHours[recurrence];

    const quantity = 24 / incrementHours;

    for (let i = 0; i < quantity; i++) {
      const newTime = new Date(initialTime.getTime() + i * incrementHours * 60 * 60 * 1000);
      times.push(formatTime(newTime));
    }

    return times;
  };

  // Validação de dosagem: apenas números e até 10 caracteres (ajuste se quiser)
  const validateDosage = (value: string) => {
    const maxLength = 10;
    const numericRegex = /^[0-9]*\.?[0-9]*$/; // aceita números decimais
    if (value.length > maxLength) return false;
    if (!numericRegex.test(value)) return false;
    return true;
  };

  const handleSave = async () => {
    // Validações
    if (!medicationName.trim()) {
      Alert.alert('Erro', 'Nome do medicamento não pode estar vazio.');
      return;
    }
    if (!dosage.trim()) {
      Alert.alert('Erro', 'Dosagem não pode estar vazia.');
      return;
    }
    if (!validateDosage(dosage.trim())) {
      Alert.alert('Erro', 'Dosagem deve ser um número válido com até 10 caracteres.');
      return;
    }
    if (!recurrence) {
      Alert.alert('Erro', 'Selecione uma recorrência.');
      return;
    }
    if (!type) {
      Alert.alert('Erro', 'Selecione o tipo de medicamento.');
      return;
    }

    const newTimes = calculateTimes(startTime, recurrence);

    const updatedAlarm = {
      ...parsedMedication,
      dosage,
      recurrence,
      type,
      times: newTimes,
    };

    try {
      const stored = await AsyncStorage.getItem('medications');
      const medications: Medication[] = stored ? JSON.parse(stored) : [];

      const index = medications.findIndex((item) => item.id === updatedAlarm.id);
      if (index !== -1) {
        medications[index] = updatedAlarm;
        await AsyncStorage.setItem('medications', JSON.stringify(medications));
        router.push('/Alarmes');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o alarme.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Alarme</Text>

      <TextInput
        style={[styles.input, { backgroundColor: '#f0f0f0' }]}
        value={medicationName}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Dosagem"
        value={dosage}
        keyboardType="numeric"
        onChangeText={(text) => {
          if (validateDosage(text)) setDosage(text);
        }}
        maxLength={10}
      />

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

export default EditAlarmes;
