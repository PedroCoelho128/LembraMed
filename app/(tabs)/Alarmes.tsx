import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

// Define a interface para o formato do objeto Medicação
interface Medication {
  id: string;          // Identificador único da medicação
  name: string;        // Nome do medicamento
  dosage: string;      // Dosagem informada
  recurrence: string;  // Frequência da medicação (ex: 8/8h)
  type: string;        // Tipo do medicamento (ex: Comprimido, ML)
  times: string[];     // Horários em que deve ser tomada (ex: ['08:00', '16:00'])
}

const Alarmes = () => {
  // Estado para armazenar a lista de medicações carregadas do AsyncStorage
  const [medications, setMedications] = useState<Medication[]>([]);
  
  // Hook para navegar entre telas usando o expo-router
  const router = useRouter();

  // useFocusEffect é usado para executar uma função toda vez que a tela fica visível novamente
  // Aqui carregamos as medicações do AsyncStorage toda vez que o usuário volta para esta tela
  useFocusEffect(
    useCallback(() => {
      const loadMedications = async () => {
        try {
          // Recupera o JSON salvo localmente com todas as medicações
          const stored = await AsyncStorage.getItem('medications');
          // Se houver dados, converte para objeto, caso contrário lista vazia
          const parsed = stored ? JSON.parse(stored) : [];
          // Atualiza o estado local com a lista carregada
          setMedications(parsed);
        } catch (error) {
          console.error('Erro ao carregar os alarmes:', error);
        }
      };

      loadMedications();
    }, []) // O array vazio garante que este efeito seja executado só quando a tela estiver focada
  );

  // Função chamada quando o usuário pressiona o botão "Editar"
  // Redireciona para a tela de edição passando o medicamento serializado em JSON
  const handleEdit = (medication: Medication) => {
    router.push({
      pathname: '/editAlarmes',
      params: { medication: JSON.stringify(medication) },
    });
  };

  // Função para remover um alarme da lista
  const handleRemove = async (id: string) => {
    // Exibe uma confirmação para o usuário antes de remover
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
              // Filtra a lista para remover o item com o id fornecido
              const updated = medications.filter((med) => med.id !== id);
              // Atualiza o AsyncStorage com a nova lista sem o item removido
              await AsyncStorage.setItem('medications', JSON.stringify(updated));
              // Atualiza o estado local para refletir a remoção imediatamente na UI
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

      {/* FlatList para mostrar os alarmes da medicação */}
      <FlatList
        data={medications}               // Dados que serão renderizados na lista
        keyExtractor={(item) => item.id} // Chave única para cada item da lista
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Nome do medicamento em destaque */}
            <Text style={styles.name}>{item.name}</Text>

            {/* Detalhes do medicamento */}
            <Text>Tipo: {item.type}</Text>
            <Text>Dosagem: {item.dosage}</Text>
            <Text>Recorrência: {item.recurrence}</Text>

            {/* Mostra os horários em que o medicamento deve ser tomado, lado a lado */}
            <View style={styles.timeContainer}>
              {item.times.map((time, index) => (
                <Text key={index} style={styles.timeItem}>
                  {time}
                </Text>
              ))}
            </View>

            {/* Botão para editar o alarme */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

            {/* Botão para remover o alarme */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.id)}
            >
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        // Caso não haja alarmes cadastrados, mostra essa mensagem
        ListEmptyComponent={<Text>Nenhum alarme cadastrado.</Text>}
      />
    </View>
  );
};

// Estilos para a tela Alarmes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',  // Fundo branco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',      // Centraliza o texto
  },
  card: {
    backgroundColor: '#f9f9f9',  // Fundo cinza claro para cada item
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Elevação para Android
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',  // Organiza os horários em linha
    flexWrap: 'wrap',      // Permite quebrar para a próxima linha
    marginTop: 8,
  },
  timeItem: {
    marginRight: 8,
    backgroundColor: '#e0e0e0',  // Fundo cinza claro para cada horário
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  editButton: {
    marginTop: 12,
    backgroundColor: '#4CAF50',  // Verde para o botão de editar
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',           // Texto branco no botão
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 8,
    backgroundColor: '#FF5252',  // Vermelho para o botão de remover
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',           // Texto branco no botão
    fontWeight: 'bold',
  },
});

export default Alarmes;
// O código acima define a tela de Alarmes do aplicativo, onde o usuário pode visualizar, editar e remover alarmes de medicação.