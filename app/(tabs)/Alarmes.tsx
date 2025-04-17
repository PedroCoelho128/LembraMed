// app/Alarmes.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Alarmes() {
  const [alarms, setAlarms] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadAlarms = async () => {
      // Carregar os alarmes corretamente usando a chave 'medications'
      const storedAlarms = await AsyncStorage.getItem('medications');
      if (storedAlarms) {
        setAlarms(JSON.parse(storedAlarms));
      }
    };

    loadAlarms();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/editMedication/${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LembraMed</Text>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.item}>
            <Text style={styles.medicationName}>{item.name}</Text>
            <Text style={styles.timeText}>
              {new Date(item.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f5f5f5', // Alterado para fundo mais suave
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    textAlign: 'center',
    color: '#333', // Cor mais suave para o título
  },
  item: { 
    padding: 16, 
    backgroundColor: '#fff', 
    marginBottom: 12, 
    borderRadius: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 2, // Adicionado efeito de sombra
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Melhor contraste para o nome do medicamento
  },
  timeText: {
    fontSize: 16,
    color: '#666', // Cor mais suave para o horário
    marginTop: 4, // Pequeno espaço entre o nome e o horário
  },
});
