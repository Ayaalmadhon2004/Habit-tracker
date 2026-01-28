import { ScrollView , TextInput , Pressable, Text,View} from "react-native";
import {HabitItem} from "../../components/HabitItem";
import { useHabits } from "../../hooks/useHabits";
import { useState } from "react";

export default function HomeScreen() {
  const { habits, toggleHabit , addHabit} = useHabits();
  const [newHabit,setNewHabit]=useState<string>('');

  const handleAddHabit=()=>{
    if(newHabit.trim()==="") return ;
    addHabit(newHabit.trim());
    setNewHabit('');
  }
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
  <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
    Welcome in Habit Tracker ! 
  </Text>

  <TextInput
    value={newHabit}
    onChangeText={setNewHabit}
    placeholder="add a new habit..."
    style={{
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    }}
  />

  <Pressable
    onPress={handleAddHabit}
    style={({ pressed }) => [
      {
        padding: 12,
        backgroundColor: pressed ? "#0056b3" : "#007bff",
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
      },
    ]}
  >
    <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
      Add Habit
    </Text>
  </Pressable>

  <ScrollView style={{ marginTop: 10 }}>
    {habits.map((habit) => (
      <HabitItem
        key={habit.id}
        habit={habit}
        onToggle={() => toggleHabit(habit.id)}
      />
    ))}
  </ScrollView>
</View>

  );
}
