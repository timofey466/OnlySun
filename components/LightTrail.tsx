import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { GAME_CONFIG } from '@/constants/game';
import { SKINS } from '@/constants/skins';

interface TrailSegment {
  id: string;
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
}

interface LightTrailProps {
  segments: TrailSegment[];
  skinId?: string;
}

export const LightTrail = ({ segments, skinId = 'default' }: LightTrailProps) => {
  const now = Date.now();
  
  // Get skin colors
  const skin = SKINS.find(s => s.id === skinId) || SKINS[0];
  const trailColor = skin.trailColor || skin.colors[0];
  
  return (
    <View style={styles.container}>
      {segments.map((segment, index) => {
        const age = now - segment.timestamp;
        const opacity = Math.max(0, 1 - age / GAME_CONFIG.TRAIL_FADE_DURATION);
        const size = GAME_CONFIG.PLAYER_SIZE * 0.5 * (1 - index / segments.length) * opacity;
        
        return (
          <View
            key={segment.id}
            style={[
              styles.segment,
              {
                left: segment.x - size / 2,
                top: segment.y - size / 2,
                width: size,
                height: size,
                opacity: opacity * segment.intensity,
                backgroundColor: trailColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  segment: {
    position: 'absolute',
    borderRadius: 50,
  },
});