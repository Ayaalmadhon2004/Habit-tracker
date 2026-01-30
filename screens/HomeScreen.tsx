// src/screens/HomeScreen.tsx
import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useHabits } from "../hooks/useHabits";
import { HabitItem } from "../components/HabitItem";
import { ProgressHeader } from "../components/ProgressHeader";
import { COLORS, SPACING } from "../constants/theme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { habits, toggleHabit, addHabit, deleteHabit, updateHabit } = useHabits();
  const [newHabit, setNewHabit] = useState('');

  const stats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter(h => h.completedToday).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, percentage };
  }, [habits]);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(stats.percentage, { damping: 30, stiffness: 100 });
    
    if (stats.percentage === 100 && stats.total > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [stats.percentage]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    backgroundColor: interpolateColor(progress.value, [0, 50, 100], [COLORS.error, COLORS.warning, COLORS.success]),
  }));

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      addHabit(newHabit.trim());
      setNewHabit('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No habits yet. Add one to get started! </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.mainWrapper, { paddingTop: insets.top }]}
    >
      <View style={styles.container}>
        <ProgressHeader percentage={stats.percentage} animatedStyle={animatedStyle} />

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={newHabit}
            onChangeText={setNewHabit}
            placeholder="What's your next goal?"
            onSubmitEditing={handleAddHabit}
            placeholderTextColor={COLORS.gray400}
          />
          <Pressable style={styles.addBtn} onPress={handleAddHabit}>
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <HabitItem
              habit={item}
              onToggle={() => { toggleHabit(item.id); Haptics.selectionAsync(); }}
              onDelete={() => deleteHabit(item.id)}
              onUpdate={(t) => updateHabit(item.id, t)}
            />
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  inputBox: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  input: { flex: 1, backgroundColor: COLORS.white, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: COLORS.gray200, fontSize: 16 },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 25, borderRadius: 15, justifyContent: 'center' },
  addBtnText: { color: COLORS.white, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: COLORS.textSecondary, fontSize: 16 },
});