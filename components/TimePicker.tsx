import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimePicker = ({ time, setTime }: any) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onTimeChange = (_: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || time;
    setShowTimePicker(false);
    setTime(currentDate);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text style={styles.timeText}>
          {`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" is24Hour display="default" onChange={onTimeChange} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: { padding: 14, borderWidth: 1, borderRadius: 8, marginBottom: 16, borderColor: '#ccc' },
  timeText: { fontSize: 20, textAlign: 'center' },
});

export default TimePicker;
