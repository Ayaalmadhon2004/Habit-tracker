import { useCallback, useEffect, useState, useRef } from "react";
import { Category, Habit } from "../types/habit";
import { updateStreak } from "@/utils/habitUtils";
import { storage } from "@/utils/storage"; 
import * as Haptics from 'expo-haptics';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', color: '#007AFF' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const init = async () => {
      const [storedHabits, storedCats] = await Promise.all([
        storage.loadHabits(), 
        storage.loadCategories()
      ]);
      
      if (storedHabits.length > 0) setHabits(storedHabits);
      
      if (storedCats.length > 0) {
        setCategories(prev => {
          const combined = [...prev, ...storedCats];
          return combined.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          );
        });
      }
      setIsLoading(false);
    };
    init();
  }, []); 

  useEffect(() => {
    if (!isLoading && !isInitialMount.current) {
      storage.saveHabits(habits);
      storage.saveCategories(categories);
    }
    isInitialMount.current = false;
  }, [habits, categories, isLoading]);

  const deleteCategory = useCallback((id: string) => {
    if (id === 'all') return;
    setCategories(prev => prev.filter(c => c.id !== id));
    setHabits(prev => prev.map(h => h.categoryId === id ? { ...h, categoryId: 'all' } : h));
  }, []);

  const addHabit = useCallback((title: string, categoryId: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      categoryId: categoryId || 'all',
      completedToday: false,
      streak: 0,
      completedDates: []
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const toggleHabit = useCallback((id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const today = new Date().toISOString().split('T')[0];
      const isCurrentlyCompleted = h.completedToday;
      const alreadyDone = h.completedDates?.includes(today);
      let newStreak = h.streak || 0;
      let newDates = h.completedDates || [];

      if (!isCurrentlyCompleted) {
        if (!alreadyDone) {
          newStreak = updateStreak(newStreak, newDates[newDates.length - 1]);
          newDates = [...newDates, today];
        }
      } else {
        if (alreadyDone) {
          newStreak = Math.max(0, newStreak - 1);
          newDates = newDates.filter(d => d !== today);
        }
      }
      return { ...h, completedToday: !isCurrentlyCompleted, streak: newStreak, completedDates: newDates };
    }));
  }, []);

  const addCategory = useCallback((newCat: Category) => {
    setCategories(prev => [...prev, newCat]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return { habits, categories, isLoading, addHabit, toggleHabit, addCategory, deleteCategory,
      deleteHabit: (id: string) => setHabits(p => p.filter(h => h.id !== id)),
      updateHabit: (id: string, t: string) => setHabits(p => p.map(h => h.id === id ? {...h, title: t} : h))
  };
}