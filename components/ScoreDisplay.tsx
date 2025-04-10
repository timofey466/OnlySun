import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface ScoreDisplayProps {
  score: number;
  distance: number;
}

export const ScoreDisplay = ({ score, distance }: ScoreDisplayProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.distanceText}>Distance: {Math.floor(distance)}m</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  scoreText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  distanceText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});