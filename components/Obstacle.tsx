import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface ObstacleProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const Obstacle = ({ x, y, width, height }: ObstacleProps) => {
  return (
    <View
      style={[
        styles.obstacle,
        {
          left: x,
          top: y,
          width,
          height,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    backgroundColor: COLORS.obstacle,
    borderRadius: 5,
  },
});