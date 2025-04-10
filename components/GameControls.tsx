import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, ArrowRight, ArrowUp, Pause } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onPause: () => void;
}

export const GameControls = ({
  onMoveLeft,
  onMoveRight,
  onJump,
  onPause,
}: GameControlsProps) => {
  // On web, we'll use keyboard controls instead of buttons
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webControls}>
        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Pause size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.directionControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onMoveLeft}
          activeOpacity={0.7}
        >
          <ArrowLeft size={32} color={COLORS.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onJump}
          activeOpacity={0.7}
        >
          <ArrowUp size={32} color={COLORS.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onMoveRight}
          activeOpacity={0.7}
        >
          <ArrowRight size={32} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
        <Pause size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  webControls: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  directionControls: {
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});