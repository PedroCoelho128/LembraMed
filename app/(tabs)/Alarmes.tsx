import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';

const Alarmes = () => {
  const [medications, setMedications] = useState<any[]>([]);
  const router = useRouter();

  const loadMedications = async () => {
    const storedMedications = await AsyncStorage.getItem('medications');
    if (storedMedications) {
      setMedications(JSON.parse(storedMedications));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadMedications();
    }, [])
  );

  const handleEdit = (medication: any) => {
    router.push({
      pathname: '/addMedication',
      params: { medication: JSON.stringify(medication) },
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este alarme?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            const filtered = medications.filter((item) => item.id !== id);
            await AsyncStorage.setItem('medications', JSON.stringify(filtered));
            setMedications(filtered);
          },
        },
      ]
    );
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alarmes Salvos</Text>
      {medications.map((medication) => (
        <View key={medication.id} style={styles.medication}>
          <Text style={styles.medicationName}>{medication.name}</Text>
          <Text>Dosagem: {medication.dosage}</Text>
          <Text>Recorrência: {medication.recurrence}</Text>
          <Text>Horários:</Text>
          {/* Exibindo os horários lado a lado */}
          <View style={styles.timesContainer}>
            {medication.times?.map((time: string, index: number) => (
              <Text key={index} style={styles.timeText}>{formatTime(time)}</Text>
            ))}
          </View>
          <TouchableOpacity onPress={() => handleEdit(medication)} style={[styles.button, styles.editButton]}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(medication.id)} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  medication: {
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  medicationName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timesContainer: {
    flexDirection: 'row', // Exibir horários lado a lado
    flexWrap: 'wrap', // Quebrar linha se necessário
    marginVertical: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10, // Espaçamento entre os horários
  },
});

export default Alarmes;
