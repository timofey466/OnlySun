import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface GameOverlayProps {
  darknessLevel: number;
}

export const GameOverlay = ({ darknessLevel }: GameOverlayProps) => {
  // Removed the overlay completely by returning null
  return null;
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    pointerEvents: 'none',
  },
});