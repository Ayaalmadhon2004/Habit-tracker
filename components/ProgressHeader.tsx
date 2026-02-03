// src/components/ProgressHeader.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { COLORS, SPACING } from "../constants/theme";
import { calculateProgress } from '../utils/habitUtils';

interface ProgressHeaderProps {
  total: number;      
  completed: number; 
  animatedStyle: any;
}

export const ProgressHeader = ({
  total,
  completed,
  animatedStyle,
}: ProgressHeaderProps) => {
  const percentage = calculateProgress(total, completed) || 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Track Habits</Text>
          <Text style={styles.subtitle}>Stay sharp, stay consistent</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{percentage}%</Text>
        </View>
      </View>
      <View style={styles.track}>
        <Animated.View 
           style={[
             styles.fill, 
             { backgroundColor: COLORS.primary }, 
             animatedStyle
           ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: { fontSize: 32, fontWeight: "900", color: COLORS.gray[800] },
  subtitle: { fontSize: 14, color: COLORS.gray[600] },
  badge: {
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { color: COLORS.primary, fontWeight: "800" },
  track: {
    height: 12,
    backgroundColor: COLORS.gray[200],
    borderRadius: 6,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 6 },
});