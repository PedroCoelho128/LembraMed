import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define o tipo da medicação para tipagem TypeScript
interface Medication {
  id: string;
  name: string;
  dosage: string;
  recurrence: string;
  type: string;
  times: string[];
}

// Dicionário que converte a recorrência (ex: '8/8h') em número de horas
const recurrenceHours: Record<string, number> = {
  '8/8h': 8,
  '6/6h': 6,
  '12/12h': 12,
  '24/24h': 24,
};

const EditAlarmes = () => {
  // Recupera o parâmetro 'medication' da rota
  const { medication } = useLocalSearchParams<{ medication: string }>();

  // Converte a string JSON em objeto JavaScript
  const parsedMedication = medication ? JSON.parse(medication) : null;

  // Função para converter string "HH:mm" em Date
  const getDateFromTimeString = (timeStr: string): Date => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  };

  // Inicializa o estado startTime com a hora salva ou com a hora atual
  const initialStartTime = parsedMedication?.times && parsedMedication.times.length > 0
    ? getDateFromTimeString(parsedMedication.times[0])
    : new Date();

  // Estados locais com os valores iniciais preenchidos a partir do parâmetro
  const [medicationName, setMedicationName] = useState<string>(parsedMedication?.name || '');
  const [dosage, setDosage] = useState<string>(parsedMedication?.dosage || '');
  const [recurrence, setRecurrence] = useState<string>(parsedMedication?.recurrence || '');
  const [type, setType] = useState<string>(parsedMedication?.type || '');
  const [startTime, setStartTime] = useState<Date>(initialStartTime);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const router = useRouter(); // Navegação entre telas

  // Função para formatar o horário no formato HH:mm
  const formatTime = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  // Calcula os horários com base na recorrência e hora inicial
  const calculateTimes = (initialTime: Date, recurrence: string) => {
    const times = [];
    let incrementHours = recurrenceHours[recurrence];

    const quantity = 24 / incrementHours;

    for (let i = 0; i < quantity; i++) {
      const newTime = new Date(initialTime.getTime() + i * incrementHours * 60 * 60 * 1000);
      times.push(formatTime(newTime));
    }

    return times;
  };

  // Salva as alterações no AsyncStorage
  const handleSave = async () => {
    if (!medicationName || !dosage || !recurrence || !type) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Gera nova lista de horários
    const newTimes = calculateTimes(startTime, recurrence);

    // Atualiza objeto com os dados modificados
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

      // Substitui o item pelo novo
      const index = medications.findIndex((item) => item.id === updatedAlarm.id);
      if (index !== -1) {
        medications[index] = updatedAlarm;
        await AsyncStorage.setItem('medications', JSON.stringify(medications));
        router.push('/Alarmes'); // Volta para tela principal
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o alarme.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Alarme</Text>

      {/* Campo para o nome do medicamento (não editável) */}
      <TextInput
        style={[styles.input, { backgroundColor: '#f0f0f0' }]}
        value={medicationName}
        editable={false}
      />

      {/* Campo para a dosagem */}
      <TextInput
        style={styles.input}
        placeholder="Dosagem"
        value={dosage}
        onChangeText={setDosage}
      />

      {/* Botão para selecionar o horário inicial */}
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={styles.timePickerButton}
      >
        <Text style={styles.timePickerText}>
          Hora inicial: {formatTime(startTime)}
        </Text>
      </TouchableOpacity>

      {/* Picker de horário (modal nativo) */}
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

      {/* Seletor de recorrência */}
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

      {/* Seletor de tipo de medicamento */}
      <Text style={styles.label}>Tipo</Text>
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Comprimido" value="Comprimido" />
        <Picker.Item label="ML" value="ML" />
      </Picker>

      {/* Botão de salvar */}
      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos visuais da tela
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
