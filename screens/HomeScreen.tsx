import { View } from "react-native";
import HabitItem from "../components/HabitItem";
import { useHabits } from "../hooks/useHabits";

export default function HomeScreen() {
  const { habits, toggleHabit } = useHabits();

  return (
    <View>
      {habits.map(habit => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggle={() => toggleHabit(habit.id)}
        />
      ))}
    </View>
  );
}
