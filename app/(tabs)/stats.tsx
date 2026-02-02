import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useHabits } from "../../hooks/useHabits";

export default function StatsScreen() {
  const { habits } = useHabits();

  const stats = useMemo(() => {
    const daysLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    
    let totalCompleted = 0;

    habits.forEach((habit) => {
      const completedDates = habit.completedDates || [];
      totalCompleted += completedDates.length;

      completedDates.forEach((dateStr) => {
        const date = new Date(dateStr);
        const dayIndex = date.getDay(); 
        
        weeklyData[dayIndex] += 1;
      });
    });

    const bestStreak = habits.length > 0 
      ? Math.max(...habits.map(h => h.streak || 0), 0) 
      : 0;

    const completionRate = habits.length > 0
      ? Math.round((totalCompleted / (habits.length * 7)) * 100)
      : 0;

    return {
      totalCompleted,
      bestStreak,
      completionRate,
      chartData: {
        labels: daysLabels,
        datasets: [{
          data: weeklyData,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2
        }]
      }
    };
  }, [habits]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Statistics</Text>
      
      {/* كروت الأرقام */}
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Goal</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${Math.min(stats.completionRate, 100)}%` }]} />
        </View>
        <Text style={styles.subText}>{stats.completionRate}% completion rate this week</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Map</Text>
        <LineChart
          data={stats.chartData}
          width={Dimensions.get("window").width - 60}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
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
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  propsForDots: { r: "5", strokeWidth: "2", stroke: "#4CAF50" }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  card: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 20, alignItems: 'center', elevation: 3 },
  cardLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  cardNumber: { fontSize: 26, fontWeight: 'bold' },
  unitText: { fontSize: 12, color: '#E53E3E', fontWeight: 'bold' },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 15 },
  progressBg: { height: 10, backgroundColor: '#EEE', borderRadius: 5, marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 5 },
  subText: { fontSize: 13, color: '#888' },
  chart: { marginVertical: 8, borderRadius: 16 }
});