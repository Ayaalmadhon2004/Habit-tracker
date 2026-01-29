import React, { useMemo, useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  interpolateColor, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// استيراد الـ Hooks والمكونات الخاصة بك
import { useHabits } from "../../hooks/useHabits";
import { HabitItem } from "../../components/HabitItem";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { habits, toggleHabit, addHabit, deleteHabit, updateHabit } = useHabits();
  const [newHabit, setNewHabit] = useState('');

  // 1. حساب الإحصائيات (Logic)
  const stats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter(h => h.completedToday).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, percentage: Math.round(percentage) };
  }, [habits]);

  // 2. إعداد الأنيميشن (Animation Setup)
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(stats.percentage, {
      damping: 30,
      stiffness: 100
    });
  }, [stats.percentage]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 50, 100],
      ['#F56565', '#ED8936', '#48BB78'] // أحمر -> برتقالي -> أخضر
    );

    return {
      width: `${progress.value}%`,
      backgroundColor: backgroundColor,
    };
  });

  // 3. الدوال المساعدة (Helper Functions)
  const handleAddHabit = () => {
    if (newHabit.trim()) {
      addHabit(newHabit.trim());
      setNewHabit('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleToggle = (id: string) => {
    toggleHabit(id);
    Haptics.selectionAsync();
  };

  // احتفال عند اكتمال 100%
  useEffect(() => {
    if (stats.percentage === 100 && stats.total > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [stats.percentage]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.mainWrapper, { paddingTop: insets.top }]}
    >
      <View style={styles.container}>
        
        {/* الهيدر وشريط التقدم */}
        <View style={styles.headerSection}>
          <View style={styles.headerTextContainer}>
            <View>
              <Text style={styles.title}>Track Habits</Text>
              <Text style={styles.subtitle}>Stay sharp, stay consistent</Text>
            </View>
            <View style={styles.statsBadge}>
              <Text style={styles.statsText}>{stats.percentage}%</Text>
            </View>
          </View>

          {/* خلفية الشريط */}
          <View style={styles.progressBarBackground}>
            {/* الشريط المتحرك */}
            <Animated.View style={[styles.progressBarFill, animatedStyle]} />
          </View>
        </View>

        {/* صندوق الإدخال */}
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={newHabit}
            onChangeText={setNewHabit}
            placeholder="What's your next goal?"
            onSubmitEditing={handleAddHabit}
            returnKeyType="done"
            placeholderTextColor="#A0AEC0"
          />
          <Pressable style={styles.addBtn} onPress={handleAddHabit}>
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        {/* قائمة العادات */}
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <HabitItem
              habit={item}
              onToggle={() => handleToggle(item.id)}
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
  mainWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerSection: {
    marginBottom: 25,
  },
  headerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A202C',
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
  },
  statsBadge: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statsText: {
    color: '#3182CE',
    fontWeight: '800',
    fontSize: 16,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  inputBox: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    color: '#2D3748',
  },
  addBtn: {
    backgroundColor: '#3182CE',
    paddingHorizontal: 25,
    borderRadius: 15,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#3182CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
});