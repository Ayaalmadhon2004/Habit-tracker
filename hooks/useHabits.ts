import { useState } from "react";
import { Habit } from "../types/habit";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", title: "صلاة الفجر", completedToday: false },
    { id: "2", title: "قراءة قرآن", completedToday: false },
  ]);

  const toggleHabit = (id: string) => {
    setHabits(habits =>
      habits.map(h =>
        h.id === id
          ? { ...h, completedToday: !h.completedToday }
          : h
      )
    );
  };

  return { habits, toggleHabit };
}
