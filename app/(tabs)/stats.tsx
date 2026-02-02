import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
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

    const chartData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [totalCompleted > 5 ? 5 : 2, 4, 3, 5, 8, 4, 3], 
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, 
          strokeWidth: 2 
        }
      ],
    };

    return { totalCompleted, completionRate, bestStreak, chartData };
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

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Weekly Performance</Text>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${Math.min(stats.completionRate, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.percentageText}>{stats.completionRate}% of your goal</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Activity Map</Text>
        <LineChart
          data={stats.chartData}
          width={Dimensions.get("window").width - 60}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#4CAF50"
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  card: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardLabel: { fontSize: 13, color: '#666', marginBottom: 5, fontWeight: '600' },
  cardNumber: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  unitText: { fontSize: 11, color: '#E53E3E', fontWeight: 'bold' },
  sectionContainer: { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 25, 
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  progressBarBackground: { 
    height: 10, backgroundColor: '#EEE', borderRadius: 5, marginBottom: 10 
  },
  progressBarFill: { 
    height: '100%', backgroundColor: '#4CAF50', borderRadius: 5 
  },
  percentageText: { fontSize: 13, color: '#888' },
  chartStyle: { marginVertical: 8, borderRadius: 16 }
});