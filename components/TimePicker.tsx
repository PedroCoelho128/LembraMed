import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimePicker = ({ time, setTime }: any) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onTimeChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || time;
    setShowTimePicker(false);
    setTime(currentDate);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={styles.input}
      >
        <Text>{`Selecione o Horário: ${time.getHours()}:${time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}`}</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
});

export default TimePicker;
