import { useCallback, useEffect, useState, useRef } from "react";
import { Category, Habit } from "../types/habit";
import { updateStreak } from "@/utils/habitUtils";
import { storage } from "@/utils/storage"; 
import * as Haptics from 'expo-haptics';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', color: '#007AFF', icon: 'list' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);

  // 1. تحميل البيانات عند التشغيل
  useEffect(() => {
    const init = async () => {
      try {
        const [h, c] = await Promise.all([storage.loadHabits(), storage.loadCategories()]);
        
        // معالجة البيانات المحملة لضمان توافقها
        const migratedHabits = h.map((habit: any) => ({
          ...habit,
          streak: habit.streak ?? 0,
          completedDates: habit.completedDates ?? [],
          completedToday: habit.completedDates?.includes(new Date().toISOString().split('T')[0]) ?? false,
        }));

        setHabits(migratedHabits);
        if (c && c.length > 0) {
          setCategories(prev => [...prev, ...c.filter(cat => cat.id !== 'all')]);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // 2. حفظ البيانات تلقائياً عند أي تغيير
  useEffect(() => {
    if (!isLoading) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      storage.saveHabits(habits);
      storage.saveCategories(categories);
    }
  }, [habits, categories, isLoading]);

  // 3. إضافة عادة جديدة مرتبطة بصنف
  const addHabit = useCallback((title: string, categoryId: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      categoryId,
      completedToday: false,
      streak: 0,
      completedDates: []
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  // 4. تفعيل/تعطيل العادة وحساب الـ Streak
  const toggleHabit = useCallback((id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      
      const today = new Date().toISOString().split('T')[0];
      const isCurrentlyCompleted = h.completedToday;
      const alreadyDone = h.completedDates?.includes(today);
      
      let newStreak = h.streak || 0;
      let newDates = [...(h.completedDates || [])];

      if (!isCurrentlyCompleted) {
        if (!alreadyDone) {
          newStreak = updateStreak(newStreak, newDates[newDates.length - 1]);
          newDates.push(today);
        }
      } else {
        if (alreadyDone) {
          newStreak = Math.max(0, newStreak - 1);
          newDates = newDates.filter(d => d !== today);
        }
      }

      return { 
        ...h, 
        completedToday: !isCurrentlyCompleted, 
        streak: newStreak, 
        completedDates: newDates 
      };
    }));
  }, []);

  const addCategory = useCallback((newCat: Category) => {
    setCategories(prev => [...prev, newCat]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const updateHabit = useCallback((id: string, t: string) => {
    setHabits(prev => prev.map(h => h.id === id ? {...h, title: t} : h));
  }, []);

  return { 
    habits, 
    categories, 
    isLoading, 
    addHabit, 
    toggleHabit, 
    addCategory, 
    deleteHabit, 
    updateHabit 
  };
}