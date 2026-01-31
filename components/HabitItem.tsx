import React, { memo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { Habit } from '../types/habit';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void; 
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => void;
}

export const HabitItemComponent = ({ habit, onToggle, onDelete, onUpdate }: HabitItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(habit.title);

  const handleUpdate = () => {
    onUpdate(habit.id, tempTitle);
    setIsEditing(false);
  };

  const getLast7Days =()=>{
    const daysLabels=['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return [...Array(7)].map((_,i)=>{
      const d=new Date();
      d.setDate(d.getDate()-i);
      return {
        date:d.toISOString().split('T')[0],
        label:daysLabels[d.getDay()]
      };
    }).reverse();
  };
  const last7Days=getLast7Days();

  return (
    <View style={styles.containerRow}>
      <View style={styles.historyContainer}>
        {last7Days.map((item) => {
          const isDone = habit.completedDates?.includes(item.date);
          const isToday = item.date === new Date().toISOString().split('T')[0];

          return (
            <View key={item.date} style={styles.dayColumn}>
              <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
                {item.label}
              </Text>
              <View 
                style={[
                  styles.dayDot, 
                  isDone ? styles.dayDone : styles.dayMissed,
                  isToday && styles.todayDot 
                ]} 
              />
            </View>
          );
        })}
      </View>
      <Pressable 
        testID="habit-item-touchable"
        onPress={() => onToggle(habit.id)} // هذا هو التعديل المطلوب!
        style={styles.checkArea}
      >
        <Text style={styles.iconText}>
          {habit.completedToday ? "✅" : "⭕"}
        </Text>
      </Pressable>

      <View style={{ flex: 1 }}>
        {isEditing ? (
          <TextInput
            value={tempTitle}
            onChangeText={setTempTitle}
            onBlur={handleUpdate}
            autoFocus
            style={styles.editInput}
          />
        ) : (
          <Pressable onPress={() => setIsEditing(true)}>
            <Text style={[styles.habitTitle, habit.completedToday && styles.completedText]}>
              {habit.title}
            </Text>
          </Pressable>
        )}
      </View>
        {(habit.streak || 0) > 0 && (
          <Text style={styles.streakText}>
            🔥 {habit.streak} يوم تتابع
          </Text>
        )}
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Text style={{ fontSize: 18 }}>🗑️</Text>
      </Pressable>

    </View>
  );
};

export const HabitItem = memo(HabitItemComponent);
HabitItem.displayName = "HabitItem";

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  checkArea: { marginRight: 12 },
  habitTitle: { fontSize: 16, fontWeight: '600', color: '#2D3748' },
  completedText: { textDecorationLine: 'line-through', color: '#A0AEC0' },
  editInput: { fontSize: 16, color: '#2D3748', borderBottomWidth: 1, borderColor: '#007bff' },
  deleteButton: { padding: 8, marginLeft: 10 },
  iconText: { fontSize: 20 },
  streakText: {
    fontSize: 12,
    color: '#FF8C00', // لون برتقالي يشبه النار
    fontWeight: 'bold',
    marginTop: 2,
  },
  historyContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9', // Light background for the bar
    paddingVertical: 8,
    borderRadius: 8,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 5,
  },
  dayLabel: {
    fontSize: 11,
    color: '#9e9e9e',
    fontWeight: '600',
  },
  todayLabel: {
    color: '#007AFF', // Standard iOS blue for "Today"
    fontWeight: '800',
  },
  dayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dayDone: {
    backgroundColor: '#34C759', // Success green
  },
  dayMissed: {
    backgroundColor: '#E5E5EA', // Light gray
  },
  todayDot: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
});