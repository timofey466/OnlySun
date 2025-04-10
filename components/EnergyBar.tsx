import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@/constants/colors';
import { GAME_CONFIG } from '@/constants/game';

interface EnergyBarProps {
  energy: number;
}

export const EnergyBar = ({ energy }: EnergyBarProps) => {
  const energyPercentage = (energy / GAME_CONFIG.MAX_ENERGY) * 100;
  
  // Determine color based on energy level
  const getBarColor = () => {
    if (energyPercentage > 70) return COLORS.energyHigh;
    if (energyPercentage > 30) return COLORS.energyMedium;
    return COLORS.energyLow;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${energyPercentage}%`,
              backgroundColor: getBarColor(),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
  },
  barBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
});