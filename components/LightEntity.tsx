import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { GAME_CONFIG } from '@/constants/game';
import { SKINS } from '@/constants/skins';

interface LightEntityProps {
  position: { x: number; y: number };
  energy: number;
  skinId?: string;
  size?: number;
  static?: boolean;
}

export const LightEntity = ({ 
  position, 
  energy, 
  skinId = 'default',
  size = GAME_CONFIG.PLAYER_SIZE,
  static: isStatic = false
}: LightEntityProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const energyRatio = energy / GAME_CONFIG.MAX_ENERGY;
  
  // Get skin colors
  const skin = SKINS.find(s => s.id === skinId) || SKINS[0];
  
  // Ensure we have at least two colors for LinearGradient
  const gradientColors = skin.colors.length >= 2 
    ? skin.colors 
    : [...skin.colors, skin.colors[0] || COLORS.lightEntity];
  
  // Pulse animation
  useEffect(() => {
    if (isStatic) {
      // Slower, gentler pulse for static display
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      const pulseDuration = 1500 - energyRatio * 500; // Faster pulse when low energy
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: pulseDuration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: pulseDuration / 2,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    
    return () => {
      pulseAnim.stopAnimation();
    };
  }, [energyRatio, isStatic]);
  
  // Calculate light intensity based on energy
  const getIntensity = () => {
    if (isStatic) return 0.8;
    if (energyRatio > 0.7) return 0.8;
    if (energyRatio > 0.4) return 0.6;
    if (energyRatio > 0.2) return 0.4;
    return 0.2;
  };
  
  // Make sure we have a valid array of colors for LinearGradient
  const safeGradientColors: [string, string, ...string[]] = [
    gradientColors[0] || COLORS.lightEntity,
    gradientColors[1] || gradientColors[0] || COLORS.lightEntity,
    ...(gradientColors.slice(2) || [])
  ];
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.x - size / 2,
          top: position.y - size / 2,
          width: size,
          height: size,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={safeGradientColors}
        style={[
          styles.core,
          {
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: size * 0.3,
          }
        ]}
      />
      <LinearGradient
        colors={[safeGradientColors[0] + '00', safeGradientColors[0] + Math.floor(getIntensity() * 255).toString(16)]}
        style={[
          styles.glow,
          {
            width: size * 2,
            height: size * 2,
            borderRadius: size,
          }
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: GAME_CONFIG.PLAYER_SIZE * 0.6,
    height: GAME_CONFIG.PLAYER_SIZE * 0.6,
    borderRadius: GAME_CONFIG.PLAYER_SIZE * 0.3,
  },
  glow: {
    position: 'absolute',
    width: GAME_CONFIG.PLAYER_SIZE * 2,
    height: GAME_CONFIG.PLAYER_SIZE * 2,
    borderRadius: GAME_CONFIG.PLAYER_SIZE,
    opacity: 0.7,
  },
});