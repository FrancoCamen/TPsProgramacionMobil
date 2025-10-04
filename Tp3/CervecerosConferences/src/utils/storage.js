import AsyncStorage from '@react-native-async-storage/async-storage';
import { conferences } from '../data/conferences';

const CONFERENCES_KEY = '@conferences_data';

export const initDatabase = async () => {
  try {
    const existingData = await AsyncStorage.getItem(CONFERENCES_KEY);
    if (!existingData) {
      await AsyncStorage.setItem(CONFERENCES_KEY, JSON.stringify(conferences));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const getConferences = async () => {
  try {
    const data = await AsyncStorage.getItem(CONFERENCES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting conferences:', error);
    return [];
  }
};

export const saveConferences = async (conferencesData) => {
  try {
    await AsyncStorage.setItem(CONFERENCES_KEY, JSON.stringify(conferencesData));
  } catch (error) {
    console.error('Error saving conferences:', error);
  }
};

export const getConferenceById = async (id) => {
  try {
    const conferences = await getConferences();
    return conferences.find(conf => conf.id === id);
  } catch (error) {
    console.error('Error getting conference by id:', error);
    return null;
  }
};