import { View, Text, StyleSheet,ScrollView } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useHabits } from '@/hooks/useHabits';

export default function StatsScreen() {
    const {habits,categories}=useHabits();

    const totalHabits=habits.length;
    const completedToday=habits.filter(h=>h.completed).length;

  return (
    <ScrollView style={styles.container}>
        <Text style={styles.container}>
            <View style={styles.statsGrid}>
                <Text style={styles.statNumber}>{totalHabits}</Text>
                <Text style={styles.statLabel}>Total Habits</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{completedToday}</Text>
                <Text style={styles.statLabel}>Done Today</Text>
            </View>
        </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    width: '48%',
    alignItems: 'center',
    // إضافة ظل خفيف لشعور الـ Premium
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});