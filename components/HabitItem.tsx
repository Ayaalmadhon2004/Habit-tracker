import { Pressable , Text } from "react-native";
import { Habit } from "../types/habit";

export default function HomeScreen({
    habit,
    onToggle,
}:{
    habit:Habit;
    onToggle:()=>void;
}) {
    return(
        <Pressable onPress={onToggle}>
            <Text>
                {habit.completedToday ? "✅" : "⬜"}{habit.title}
            </Text>
        </Pressable>
    )
}