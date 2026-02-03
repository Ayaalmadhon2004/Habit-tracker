import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "../types/habit";

const HABITS_STORAGE_KEY = "@habits";

export const storage = {
  async save(habits: Habit[]) {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      console.error("Failed to save habits", e);
    }
  },

  async load(): Promise<Habit[]> {
    try {
      const stored = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load habits", e);
      return [];
    }
  },

  async clear() {
    try {
      await AsyncStorage.removeItem(HABITS_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear habits", e);
    }
  }
};