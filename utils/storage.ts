import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARMS_KEY = '@lembramed_alarms';

export interface Alarm {
  id: string;
  name: string;
  dosage: string;
  recurrence: string;
  type: string;
  times: string[];
}

// Pega todos os alarmes salvos
export const getAlarmsFromStorage = async (): Promise<Alarm[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ALARMS_KEY);
    return jsonValue ? JSON.parse(jsonValue) as Alarm[] : [];
  } catch (error) {
    console.error('Erro ao ler alarmes do storage:', error);
    return [];
  }
};

// Salva a lista completa de alarmes
export const saveAlarmsToStorage = async (alarms: Alarm[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(alarms);
    await AsyncStorage.setItem(ALARMS_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar alarmes no storage:', error);
  }
};

// Atualiza um alarme (substitui pelo mesmo id) ou adiciona se não existir
export const updateAlarmInStorage = async (updatedAlarm: Alarm): Promise<void> => {
  try {
    const alarms = await getAlarmsFromStorage();

    const index = alarms.findIndex(alarm => alarm.id === updatedAlarm.id);

    if (index !== -1) {
      alarms[index] = updatedAlarm;
    } else {
      alarms.push(updatedAlarm);
    }

    await saveAlarmsToStorage(alarms);
  } catch (error) {
    console.error('Erro ao atualizar alarme no storage:', error);
  }
};

// Busca um alarme pelo id
export const getAlarmById = async (id: string): Promise<Alarm | undefined> => {
  try {
    const alarms = await getAlarmsFromStorage();
    return alarms.find(alarm => alarm.id === id);
  } catch (error) {
    console.error('Erro ao buscar alarme por id:', error);
    return undefined;
  }
};
