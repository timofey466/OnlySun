import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@/constants/colors';
import { GAME_CONFIG } from '@/constants/game';

interface YellowSphereProps {
  x: number;
  y: number;
}

export const YellowSphere = ({ x, y }: YellowSphereProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
    
    return () => {
      pulseAnim.stopAnimation();
      rotateAnim.stopAnimation();
    };
  }, []);
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x - GAME_CONFIG.PARTICLE_SIZE / 2,
          top: y - GAME_CONFIG.PARTICLE_SIZE / 2,
          transform: [
            { scale: pulseAnim },
            { rotate: spin },
          ],
        },
      ]}
    >
      <View style={styles.inner} />
      <View style={styles.outer} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONFIG.PARTICLE_SIZE,
    height: GAME_CONFIG.PARTICLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: GAME_CONFIG.PARTICLE_SIZE * 0.4,
    height: GAME_CONFIG.PARTICLE_SIZE * 0.4,
    borderRadius: GAME_CONFIG.PARTICLE_SIZE * 0.2,
    backgroundColor: COLORS.energyParticle,
  },
  outer: {
    position: 'absolute',
    width: GAME_CONFIG.PARTICLE_SIZE,
    height: GAME_CONFIG.PARTICLE_SIZE,
    borderRadius: GAME_CONFIG.PARTICLE_SIZE / 2,
    borderWidth: 2,
    borderColor: COLORS.energyParticle,
    opacity: 0.7,
  },
});