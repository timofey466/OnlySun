import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Play, RotateCcw, Sun } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';

interface GameMenuProps {
  onStart: () => void;
  highScore: number;
}

export const GameMenu = ({ onStart, highScore }: GameMenuProps) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);
  
  return (
    <LinearGradient
      colors={[COLORS.darkBackground, COLORS.background]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Sun size={80} color={COLORS.accent} />
        </Animated.View>
        
        <Text style={styles.title}>Only Sun</Text>
        <Text style={styles.subtitle}>Keep the light alive</Text>
        
        {highScore > 0 && (
          <Text style={styles.highScore}>High Score: {highScore}</Text>
        )}
        
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Play size={24} color={COLORS.background} />
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
        
        <Text style={styles.instructions}>
          Collect light particles to maintain your energy.{"\n"}
          Move carefully - each movement costs energy.{"\n"}
          The world gets darker as you progress.
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },
  highScore: {
    fontSize: 16,
    color: COLORS.accent,
    marginBottom: 30,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  startButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  instructions: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});