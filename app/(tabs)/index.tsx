import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // استيراد الـ Hook
import { useHabits } from "../../hooks/useHabits";
import { HabitItem } from "../../components/HabitItem";

export default function HomeScreen() {
  const insets = useSafeAreaInsets(); 
  const { habits, toggleHabit, addHabit, deleteHabit, updateHabit } = useHabits();
  const [newHabit, setNewHabit] = useState('');

  const stats=useMemo(()=>{
    const total = habits.length;
    const completed=habits.filter(h=>h.completedToday).length;

    const percentage=total>0 ? (completed/total)*100 : 0;

    return {total , completed, percentage: Math.round(percentage)};
  },[habits]);

  const handleAddHabit = () => {
  if (newHabit.trim()) {
    addHabit(newHabit.trim()); 
    setNewHabit(''); 
  };}

  return (
    <View style={[styles.mainWrapper, { paddingTop: insets.top }]}>
      <View style={styles.container}>

        <View style={{ marginBottom: 30 }}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Track your Habits</Text>
              <Text style={styles.subtitle}>Stay sharp, stay consistent</Text>
            </View>

            <View style={{ 
              height: 12, 
              backgroundColor: '#E2E8F0', 
              borderRadius: 6, 
              overflow: 'hidden' 
              }}>
            <View style={{ 
                height: '100%', 
                backgroundColor: '#3182CE', 
                width: `${stats.percentage}%`, 
                borderRadius: 6 
                }} />
            </View>       
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', color: '#4A5568' }}>Daily Goal</Text>
          <Text style={{ fontWeight: 'bold', color: '#3182CE' }}>{stats.percentage}%</Text>
        </View>

        <View style={styles.inputBox}>
          <TextInput 
            style={styles.input}
            value={newHabit}
            onChangeText={setNewHabit}
            placeholder="New habit..."
            onSubmitEditing={handleAddHabit} 
            returnKeyType="done"
          />
          <Pressable style={styles.addBtn} onPress={() => {
            if(newHabit.trim()) { addHabit(newHabit); setNewHabit(''); }
          }}>
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitItem
              habit={item}
              onToggle={() => toggleHabit(item.id)}
              onDelete={() => deleteHabit(item.id)}
              onUpdate={(t) => updateHabit(item.id, t)}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10, // مساحة إضافية بسيطة بعد منطقة الأمان
  },
  headerContainer: { marginBottom: 20 },
  title: { fontSize: 38, fontWeight: '900', color: '#1A202C' },
  subtitle: { fontSize: 16, color: '#718096' },
  inputBox: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  input: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  addBtn: { backgroundColor: '#3182CE', paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center' },
  addBtnText: { color: '#FFF', fontWeight: '700' }
});