import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit, Category } from "../types/habit";

const HABITS_KEY = "@habits_data";
const CATS_KEY = "@categories_data";

export const storage = {
  async saveHabits(habits: Habit[]) {
    try {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (e) { 
      console.error("Error saving habits", e); 
    }
  },

  async loadHabits(): Promise<Habit[]> {
    try {
      const data = await AsyncStorage.getItem(HABITS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error loading habits", e);
      return [];
    }
  },

  async saveCategories(categories: Category[]) {
    try {
      const toSave = categories.filter(c => c.id !== 'all');
      await AsyncStorage.setItem(CATS_KEY, JSON.stringify(toSave));
    } catch (e) { 
      console.error("Error saving categories", e); 
    }
  },

  async loadCategories(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(CATS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error loading categories", e);
      return [];
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([HABITS_KEY, CATS_KEY]);
    } catch (e) {
      console.error("Error clearing storage", e);
    }
  }
};