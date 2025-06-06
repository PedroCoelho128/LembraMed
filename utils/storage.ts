import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARMS_KEY = '@lembramed_alarms';

export interface Alarm {
  id: string;
  name: string;
  dosage: string;
  recurrence: string; // número de horas em string, ex: "8"
  type: string;
  times: string[]; // ["08:00", "16:00"]
  takenTimes?: string[]; // horários marcados como tomados hoje ["08:00"]
}

export const getAlarmsFromStorage = async (): Promise<Alarm[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ALARMS_KEY);
    return jsonValue ? JSON.parse(jsonValue) as Alarm[] : [];
  } catch (error) {
    console.error('Erro ao ler alarmes do storage:', error);
    return [];
  }
};

export const saveAlarmsToStorage = async (alarms: Alarm[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(alarms);
    await AsyncStorage.setItem(ALARMS_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar alarmes no storage:', error);
  }
};

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

export const getAlarmById = async (id: string): Promise<Alarm | undefined> => {
  try {
    const alarms = await getAlarmsFromStorage();
    return alarms.find(alarm => alarm.id === id);
  } catch (error) {
    console.error('Erro ao buscar alarme por id:', error);
    return undefined;
  }
};

// Marca o horário como tomado para o alarme e salva
export const markTimeAsTaken = async (alarmId: string, time: string): Promise<void> => {
  try {
    const alarms = await getAlarmsFromStorage();
    const index = alarms.findIndex(a => a.id === alarmId);
    if (index !== -1) {
      const alarm = alarms[index];
      if (!alarm.takenTimes) {
        alarm.takenTimes = [];
      }
      if (!alarm.takenTimes.includes(time)) {
        alarm.takenTimes.push(time);
      }
      alarms[index] = alarm;
      await saveAlarmsToStorage(alarms);
    }
  } catch (error) {
    console.error('Erro ao marcar horário como tomado:', error);
  }
};

// Limpa os horários tomados do dia para recomeçar amanhã
export const clearTakenTimesForAll = async (): Promise<void> => {
  try {
    const alarms = await getAlarmsFromStorage();
    const updated = alarms.map(alarm => ({ ...alarm, takenTimes: [] }));
    await saveAlarmsToStorage(updated);
  } catch (error) {
    console.error('Erro ao limpar horários tomados:', error);
  }
};
