import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimePicker from '../../components/TimePicker';
import { useRouter } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';

const AddMedication = () => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [unit, setUnit] = useState('comprimidos');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Comprimidos', value: 'Comprimidos' },
    { label: 'ml', value: 'ml' },
  ]);
  const router = useRouter();

  const handleSave = async () => {
    const newMedication = {
      id: Date.now().toString(),
      name,
      dosage: `${dosage} ${unit}`,
      time: time.toString(),
    };
    const storedMedications = await AsyncStorage.getItem('medications');
    const medications = storedMedications ? JSON.parse(storedMedications) : [];
    medications.push(newMedication);
    await AsyncStorage.setItem('medications', JSON.stringify(medications));
    router.push('/Alarmes');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Alarme</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Medicação"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.dosageInput]}
          placeholder="Dosagem"
          value={dosage}
          onChangeText={setDosage}
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <DropDownPicker
          open={open}
          value={unit}
          items={items}
          setOpen={setOpen}
          setValue={setUnit}
          setItems={setItems}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          containerStyle={{ flex: 1 }}
          dropDownDirection="TOP"
        />
      </View>

      <Text style={styles.label}>
        Hora selecionada: {`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
      </Text>

      <TimePicker time={time} setTime={setTime} />

      <View style={styles.button}>
        <Button title="Salvar" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 20,
    marginBottom: 16,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 22, // Tamanho da fonte aumentado para a Hora Selecionada
    textAlign: 'center',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dosageInput: {
    width: 120, // Largura ajustada para diminuir a área
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default AddMedication;
