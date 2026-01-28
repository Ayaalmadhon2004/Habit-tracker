import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Habit } from '../types/habit';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
}

// 1. المكون الداخلي (بدون log للمتغير غير المعرف)
const HabitItemComponent = ({ habit, onToggle }: HabitItemProps) => {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.habitCard,
        habit.completedToday ? styles.completedCard : styles.pendingCard,
        pressed && styles.pressedCard
      ]}
    >
      <View style={styles.row}>
         <Text style={styles.iconText}>
            {habit.completedToday ? "✅" : "⭕"}
         </Text>
         
         <Text 
           style={[
             styles.habitTitle, 
             habit.completedToday && styles.completedText
           ]}
         >
           {habit.title}
         </Text>
      </View>
    </Pressable>
  );
};

// 2. التعريف والتصدير (الترتيب هنا مهم جداً)
export const HabitItem = memo(HabitItemComponent);

HabitItem.displayName = "HabitItem";

const styles = StyleSheet.create({
  // ... الستايلات الخاصة بك صحيحة تماماً
  habitCard: { padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E1E8ED' },
  row: { flexDirection: 'row', alignItems: 'center' },
  pendingCard: { backgroundColor: '#FFFFFF' },
  completedCard: { backgroundColor: '#F0FFF4', borderColor: '#C6F6D5' },
  pressedCard: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  iconText: { fontSize: 20, marginRight: 12 },
  habitTitle: { fontSize: 16, fontWeight: '600', color: '#2D3748' },
  completedText: { textDecorationLine: 'line-through', color: '#A0AEC0' },
});