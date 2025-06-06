// Alarmes.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

// Interface que define o formato dos dados de uma medicação
interface Medication {
  id: string;          // ID único da medicação
  name: string;        // Nome do medicamento
  dosage: string;      // Dosagem (ex: "500mg")
  recurrence: string;  // Frequência (ex: "8/8h")
  type: string;        // Tipo do medicamento (ex: "Comprimido")
  times: string[];     // Horários para tomar o medicamento (ex: ['08:00', '16:00'])
}

const Alarmes = () => {
  // Estado que armazena as medicações carregadas do AsyncStorage
  const [medications, setMedications] = useState<Medication[]>([]);

  // Hook para navegação entre telas
  const router = useRouter();

  // useFocusEffect executa a função sempre que a tela fica ativa/focada
  useFocusEffect(
    useCallback(() => {
      // Função assíncrona para carregar as medicações salvas localmente
      const loadMedications = async () => {
        try {
          // Pega o JSON salvo em AsyncStorage
          const stored = await AsyncStorage.getItem('medications');
          // Converte o JSON em objeto, ou array vazio caso não exista
          const parsed = stored ? JSON.parse(stored) : [];
          // Atualiza o estado com a lista carregada
          setMedications(parsed);
        } catch (error) {
          console.error('Erro ao carregar os alarmes:', error);
        }
      };

      loadMedications();
    }, []) // Executa somente quando a tela for focada
  );

  // Função para navegar até a tela de edição, passando a medicação como parâmetro (serializado)
  const handleEdit = (medication: Medication) => {
    router.push({
      pathname: '/editAlarmes',
      params: { medication: JSON.stringify(medication) },
    });
  };

  // Função para remover um alarme da lista, com confirmação de usuário
  const handleRemove = async (id: string) => {
    Alert.alert(
      'Remover Alarme',
      'Tem certeza que deseja remover este alarme?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              // Filtra a lista removendo o item com o ID fornecido
              const updated = medications.filter((med) => med.id !== id);
              // Atualiza o AsyncStorage com a lista atualizada
              await AsyncStorage.setItem('medications', JSON.stringify(updated));
              // Atualiza o estado local para refletir na UI
              setMedications(updated);
            } catch (error) {
              console.error('Erro ao remover alarme:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Título da tela */}
      <Text style={styles.title}>Meus Alarmes</Text>

      {/* Lista dos alarmes de medicações */}
      <FlatList
        data={medications}                  // Dados para renderizar
        keyExtractor={(item) => item.id}   // Chave única para cada item
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Nome do medicamento */}
            <Text style={styles.name}>{item.name}</Text>

            {/* Detalhes adicionais */}
            <Text>Tipo: {item.type}</Text>
            <Text>Dosagem: {item.dosage}</Text>
            <Text>Recorrência: {item.recurrence}</Text>

            {/* Horários em que deve ser tomado, exibidos lado a lado */}
            <View style={styles.timeContainer}>
              {item.times.map((time, index) => (
                <Text key={index} style={styles.timeItem}>
                  {time}
                </Text>
              ))}
            </View>

            {/* Botão para editar */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

            {/* Botão para remover */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.id)}
            >
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        // Mensagem caso a lista esteja vazia
        ListEmptyComponent={<Text>Nenhum alarme cadastrado.</Text>}
      />
    </View>
  );
};

// Estilos usados na tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Fundo branco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center', // Centralizado
  },
  card: {
    backgroundColor: '#f9f9f9', // Fundo cinza claro para cada item
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Sombra iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Elevação Android
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row', // Horários lado a lado
    flexWrap: 'wrap',     // Quebra linha se precisar
    marginTop: 8,
  },
  timeItem: {
    marginRight: 8,
    backgroundColor: '#e0e0e0', // Fundo cinza para horário
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  editButton: {
    marginTop: 12,
    backgroundColor: '#4CAF50', // Verde para editar
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff', // Texto branco
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 8,
    backgroundColor: '#FF5252', // Vermelho para remover
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff', // Texto branco
    fontWeight: 'bold',
  },
});

export default Alarmes;
