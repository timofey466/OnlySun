import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@/constants/colors';

interface ProjectileProps {
  x: number;
  y: number;
}

export const Projectile = ({ x, y }: ProjectileProps) => {
  // Animation for the projectile glow
  const glowAnim = useRef(new Animated.Value(0.7)).current;
  
  useEffect(() => {
    // Create a pulsing glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    return () => {
      glowAnim.stopAnimation();
    };
  }, []);
  
  return (
    <View style={[styles.projectileContainer, { left: x - 10, top: y - 20 }]}>
      {/* Glow effect */}
      <Animated.View 
        style={[
          styles.projectileGlow,
          { opacity: glowAnim }
        ]} 
      />
      
      {/* Core projectile */}
      <View style={styles.projectile} />
      
      {/* Trail */}
      <View style={styles.projectileTrail} />
    </View>
  );
};

const styles = StyleSheet.create({
  projectileContainer: {
    position: 'absolute',
    width: 20,
    height: 40,
    alignItems: 'center',
  },
  projectile: {
    position: 'absolute',
    width: 6,
    height: 20,
    backgroundColor: COLORS.energyHigh,
    borderRadius: 3,
    zIndex: 2,
  },
  projectileGlow: {
    position: 'absolute',
    width: 14,
    height: 28,
    backgroundColor: COLORS.energyHigh,
    borderRadius: 7,
    opacity: 0.7,
    zIndex: 1,
  },
  projectileTrail: {
    position: 'absolute',
    top: 20,
    width: 4,
    height: 15,
    backgroundColor: COLORS.energyHigh,
    borderRadius: 2,
    opacity: 0.5,
    zIndex: 0,
  },
});