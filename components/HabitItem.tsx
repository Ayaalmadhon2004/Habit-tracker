import React, { memo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput,Animated } from 'react-native';
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
  const isHot = (habit.streak || 0) >= 3;
  const[scaleValue]=useState(new Animated.Value(1));

  const animatePress=()=>{
    Animated.sequence([
      Animated.timing(scaleValue,{
        toValue:0.8,
        duration:100,
        useNativeDriver:true,
      }),
      Animated.spring(scaleValue,{
        toValue:1,
        friction:3,
        useNativeDriver:true,
      }),
    ]).start();
    onToggle(habit.id);
  }
  const handleUpdate = () => {
    onUpdate(habit.id, tempTitle);
    setIsEditing(false);
  };

  const getLast7Days = () => {
    const daysLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        date: d.toISOString().split('T')[0],
        label: daysLabels[d.getDay()]
      };
    }).reverse();
  };

  const last7Days = getLast7Days();
  const todayStr = new Date().toISOString().split('T')[0];
  const isDoneToday = habit.completedDates?.includes(todayStr);
  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable 
          onPress={animatePress} 
          style={styles.checkArea}
        >
          <Text style={styles.iconText}>
            {isDoneToday ? "✅" : "⭕"}
          </Text>
          
        </Pressable>
        </Animated.View>

        <View style={styles.contentContainer}>
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

          {/* عداد الـ Streak الاحترافي بدون إيموجي */}
          {(habit.streak || 0) > 0 && (
            <View style={styles.streakBadge}>
              <View style={[styles.streakDot, isHot ? styles.hotDot : styles.coldDot]} />
              <Text style={[styles.streakText, isHot && styles.hotText]}>
                {habit.streak} {habit.streak === 1 ? 'DAY' : 'DAYS'} STREAK
              </Text>
            </View>
          )}
        </View>

        <Pressable onPress={() => onDelete(habit.id)} style={styles.deleteButton}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </Pressable>
      </View>

      {/* الجزء السفلي: شريط الأيام السبعة */}
      <View style={styles.historyContainer}>
        {last7Days.map((item) => {
          const isDone = habit.completedDates?.includes(item.date);
          const isToday = item.date === todayStr;

          return (
            <View key={item.date} style={styles.dayColumn}>
              <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
                {item.label}
              </Text>
              <View 
                style={[
                  styles.dayDot, 
                  isDone ? styles.dayDone : styles.dayMissed,
                  isToday && styles.todayDotBorder 
                ]} 
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const HabitItem = memo(HabitItemComponent);
HabitItem.displayName = "HabitItem";

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // إضافة ظل خفيف جداً
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkArea: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  editInput: {
    fontSize: 16,
    color: '#2D3748',
    borderBottomWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 0,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  streakDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  coldDot: { backgroundColor: '#CBD5E0' },
  hotDot: { backgroundColor: '#FF9500' },
  streakText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#718096',
    letterSpacing: 0.5,
  },
  hotText: { color: '#FF9500' },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: { fontSize: 18, opacity: 0.6 },
  historyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F7FAFC',
  },
  dayColumn: {
    alignItems: 'center',
    width: 35,
  },
  dayLabel: {
    fontSize: 10,
    color: '#A0AEC0',
    fontWeight: '700',
    marginBottom: 6,
  },
  todayLabel: {
    color: '#007AFF',
  },
  dayDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dayDone: { backgroundColor: '#38A169' },
  dayMissed: { backgroundColor: '#EDF2F7' },
  todayDotBorder: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  iconText: { fontSize: 24 },
});