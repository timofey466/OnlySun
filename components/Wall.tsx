import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface WallProps {
  x: number;
  y: number;
  width: number;
}

export const Wall = ({ x, y, width }: WallProps) => {
  return (
    <View
      style={[
        styles.wall,
        {
          left: x,
          top: y,
          width,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  wall: {
    position: 'absolute',
    height: 30,
    backgroundColor: COLORS.obstacle,
    borderRadius: 5,
  },
});