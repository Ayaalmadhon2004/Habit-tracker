import { useCallback, useEffect, useRef, useState } from "react";
import { Habit } from "../types/habit";
import { updateStreak } from "@/utils/habitUtils";
import { storage } from "@/utils/storage";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isInitialMount = useRef(true);

  useEffect(() => {
    storage.load().then((data) => {
      if (data && Array.isArray(data)) {
        const migratedData = data.map((habit: any) => ({
          ...habit,
          streak: habit.streak ?? 0,
          completedDates: habit.completedDates ?? [],
          completedToday: habit.completedToday ?? false,
        }));
        setHabits(migratedData);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isLoading) {
      storage.save(habits);
    }
  }, [habits, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    setHabits(prevHabits => prevHabits.map(habit => {
      const isActuallyDoneToday = habit.completedDates?.includes(today);
      if (habit.completedToday !== isActuallyDoneToday) {
        return { ...habit, completedToday: isActuallyDoneToday };
      }
      return habit;
    }));
  }, [isLoading]);

  const toggleHabit = (id: string) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id === id) {
        const isCurrentlyCompleted = habit.completedToday;
        const alreadyDoneToday = habit.completedDates?.includes(today);

        let newStreak = habit.streak || 0;
        let newCompletedDates = [...(habit.completedDates || [])];

        if (!isCurrentlyCompleted) {
          if (!alreadyDoneToday) {
            const lastDate = newCompletedDates.length > 0
              ? newCompletedDates[newCompletedDates.length - 1]
              : undefined;

            newStreak = updateStreak(newStreak, lastDate);
            newCompletedDates.push(today);
          }
        } else {
          if (alreadyDoneToday) {
            newStreak = Math.max(0, newStreak - 1);
            newCompletedDates = newCompletedDates.filter(date => date !== today);
          }
        }

        return {
          ...habit,
          completedToday: !isCurrentlyCompleted,
          streak: newStreak,
          completedDates: newCompletedDates,
        };
      }
      return habit;
    }));
  };

  const addHabit = useCallback((title: string) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      title,
      completedToday: false,
      streak: 0,
      completedDates: []
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  }, []);

  const updateHabit = useCallback((id: string, newTitle: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, title: newTitle } : h));
  }, []);

  const clearAll = useCallback(async () => {
    await storage.clear();
    setHabits([]);
  }, []);

  return { 
    habits, 
    toggleHabit, 
    addHabit, 
    isLoading, 
    clearHabits: clearAll, 
    deleteHabit, 
    updateHabit 
  };
}