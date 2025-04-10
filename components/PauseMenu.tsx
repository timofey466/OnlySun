import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Home, RotateCcw } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseMenu = ({
  onResume,
  onRestart,
  onMainMenu,
}: PauseMenuProps) => {
  // Fixed handlers for the buttons
  const handleResume = () => {
    onResume();
  };
  
  const handleRestart = () => {
    onRestart();
  };
  
  const handleMainMenu = () => {
    onMainMenu();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Paused</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleResume}
            activeOpacity={0.7}
          >
            <Play size={24} color={COLORS.background} />
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleRestart}
            activeOpacity={0.7}
          >
            <RotateCcw size={24} color={COLORS.text} />
            <Text style={styles.secondaryButtonText}>Restart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleMainMenu}
            activeOpacity={0.7}
          >
            <Home size={24} color={COLORS.text} />
            <Text style={styles.secondaryButtonText}>Main Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modal: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});