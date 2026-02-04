import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useHabits } from "../hooks/useHabits";
import { HabitItem } from "../components/HabitItem";
import { ProgressHeader } from "../components/ProgressHeader";
import { AddCategoryModal } from "../components/AddCategoryModal";
import { COLORS } from "../constants/theme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { habits, categories, toggleHabit, addHabit, deleteHabit, updateHabit, addCategory } = useHabits();
  
  const [newHabit, setNewHabit] = useState('');
  const [isCatModalVisible, setIsCatModalVisible] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState('all');

  const filteredHabits = useMemo(() => 
    selectedCatId === 'all' ? habits : habits.filter(h => h.categoryId === selectedCatId)
  , [habits, selectedCatId]);

  const stats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter(h => h.completedToday).length;
    return { total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [habits]);

  const progress = useSharedValue(0);
  useEffect(() => { progress.value = withSpring(stats.percentage); }, [stats.percentage]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    backgroundColor: interpolateColor(progress.value, [0, 50, 100], [COLORS.error, COLORS.warning, COLORS.success]),
  }));

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      addHabit(newHabit.trim(), selectedCatId);
      setNewHabit('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.mainWrapper, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <ProgressHeader total={stats.total} completed={habits.filter(h => h.completedToday).length} animatedStyle={animatedStyle} />

        <View style={styles.categoryBar}>
          <FlatList
            horizontal showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable 
                onPress={() => { setSelectedCatId(item.id); Haptics.selectionAsync(); }}
                style={[styles.categoryChip, selectedCatId === item.id && { backgroundColor: item.color, borderColor: item.color }]}
              >
                <Text style={[styles.categoryText, selectedCatId === item.id && { color: '#fff' }]}>{item.name}</Text>
              </Pressable>
            )}
          />
          <Pressable style={styles.addCatBtn} onPress={() => setIsCatModalVisible(true)}><Text style={{fontSize: 20}}>+</Text></Pressable>
        </View>

        <View style={styles.inputBox}>
          <TextInput style={styles.input} value={newHabit} onChangeText={setNewHabit} placeholder="Add a habit..." onSubmitEditing={handleAddHabit} />
          <Pressable style={styles.addBtn} onPress={handleAddHabit}><Text style={{color: '#fff', fontWeight: 'bold'}}>Add</Text></Pressable>
        </View>

        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitItem habit={item} onToggle={() => toggleHabit(item.id)} onDelete={() => deleteHabit(item.id)} onUpdate={(t) => updateHabit(item.id, t)} />
          )}
        />
      </View>

      <Modal visible={isCatModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <AddCategoryModal onAdd={(c) => { addCategory(c); setIsCatModalVisible(false); }} onClose={() => setIsCatModalVisible(false)} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 20 },
  categoryBar: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#eee' },
  categoryText: { fontWeight: 'bold', color: '#888' },
  addCatBtn: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  inputBox: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  input: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 12 },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }
});