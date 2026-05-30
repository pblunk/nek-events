import AsyncStorage from '@react-native-async-storage/async-storage';

const savedEventsKey = 'nek-events:saved-event-ids';

export async function getSavedEventIds() {
  const value = await AsyncStorage.getItem(savedEventsKey);
  return value ? JSON.parse(value) as string[] : [];
}

export async function saveEventIds(eventIds: string[]) {
  await AsyncStorage.setItem(savedEventsKey, JSON.stringify(eventIds));
}
