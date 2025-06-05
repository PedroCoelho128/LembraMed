// Importa os módulos necessários do React e React Native
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Importa o componente de seleção de horário
import DateTimePicker from '@react-native-community/datetimepicker';

// Componente funcional chamado TimePicker
// Props:
// - time: o horário atual selecionado (Date)
// - setTime: função para atualizar o horário
const TimePicker = ({ time, setTime }: any) => {
  // Estado local para controlar a exibição do seletor de horário
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Função chamada quando o usuário seleciona um horário no seletor
  const onTimeChange = (_: any, selectedDate: Date | undefined) => {
    // Usa a data selecionada ou mantém a atual se indefinida
    const currentDate = selectedDate || time;
    // Fecha o seletor
    setShowTimePicker(false);
    // Atualiza o horário com o novo valor
    setTime(currentDate);
  };

  return (
    <View>
      {/* Botão que exibe o horário atual e abre o seletor ao ser pressionado */}
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text style={styles.timeText}>
          {`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
          {/* Exibe o horário no formato HH:MM com dois dígitos nos minutos */}
        </Text>
      </TouchableOpacity>

      {/* Exibe o seletor de horário se showTimePicker for verdadeiro */}
      {showTimePicker && (
        <DateTimePicker
          value={time}            // Valor atual
          mode="time"             // Modo apenas horário
          is24Hour                // Usa formato 24 horas
          display="default"       // Estilo do seletor
          onChange={onTimeChange} // Função chamada ao alterar o horário
        />
      )}
    </View>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  input: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ccc',
  },
  timeText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

// Exporta o componente para ser usado em outros lugares do app
export default TimePicker;
// O componente TimePicker permite ao usuário selecionar um horário usando um seletor de data/hora.
// Ele exibe o horário atual e permite que o usuário altere-o ao pressionar o botão.