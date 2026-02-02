import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useHabits } from "../../hooks/useHabits"; 

export default function StatsScreen() {
  const { habits } = useHabits();

  const stats = useMemo(() => {
    const totalCompleted = habits.reduce((acc, habit) => {
      return acc + (habit.completedDates?.length || 0);
    }, 0);

    const completionRate = habits.length > 0
      ? Math.round((totalCompleted / (habits.length * 7)) * 100)
      : 0;

    const bestStreak = habits.length > 0 
      ? Math.max(...habits.map(h => h.streak || 0), 0) 
      : 0;

    return { totalCompleted, completionRate, bestStreak };
  }, [habits]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Statistics</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Done</Text>
          <Text style={styles.cardNumber}>{stats.totalCompleted}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFF5F5' }]}>
          <Text style={[styles.cardLabel, { color: '#E53E3E' }]}>Best Streak 🔥</Text>
          <Text style={[styles.cardNumber, { color: '#E53E3E' }]}>{stats.bestStreak}</Text>
          <Text style={styles.unitText}>Days</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Performance</Text>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${Math.min(stats.completionRate, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.percentageText}>{stats.completionRate}% of Weekly Goal</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  card: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLabel: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  cardNumber: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  unitText: { fontSize: 12, color: '#E53E3E', fontWeight: '600' },
  chartContainer: { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 25, 
    marginBottom: 20 
  },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  progressBarBackground: { 
    height: 12, 
    backgroundColor: '#EEE', 
    borderRadius: 6, 
    overflow: 'hidden',
    marginBottom: 10 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#4CAF50', 
    borderRadius: 6 
  },
  percentageText: { fontSize: 14, color: '#666', fontWeight: '500' }
});