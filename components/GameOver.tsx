import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { RotateCcw, Home, Coins } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface GameOverProps {
  score: number;
  distance: number;
  highScore: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOver = ({
  score,
  distance,
  highScore,
  onRestart,
  onMainMenu,
}: GameOverProps) => {
  const router = useRouter();
  const isNewHighScore = score === highScore && score > 0;
  
  // Calculate coins earned
  const coinsEarned = Math.floor(score / 10);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Fixed handlers for the buttons
  const handleRestart = () => {
    onRestart();
  };
  
  const handleMainMenu = () => {
    onMainMenu();
  };
  
  return (
    <LinearGradient
      colors={[COLORS.darkBackground, COLORS.background]}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <Text style={styles.title}>Game Over</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.distanceText}>Distance: {Math.floor(distance)}m</Text>
          <Text style={styles.highScoreText}>High Score: {highScore}</Text>
          
          {isNewHighScore && (
            <Text style={styles.newHighScoreText}>New High Score!</Text>
          )}
          
          {coinsEarned > 0 && (
            <View style={styles.coinsEarned}>
              <Text style={styles.coinsText}>Coins Earned:</Text>
              <View style={styles.coinsAmount}>
                <Coins size={20} color={COLORS.accent} />
                <Text style={styles.coinsValue}>{coinsEarned}</Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRestart}
            activeOpacity={0.7}
          >
            <RotateCcw size={24} color={COLORS.background} />
            <Text style={styles.buttonText}>Try Again</Text>
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
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  content: {
    alignItems: 'center',
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  scoreText: {
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  distanceText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  highScoreText: {
    fontSize: 18,
    color: COLORS.accent,
    marginBottom: 10,
    textAlign: 'center',
  },
  newHighScoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: 10,
    textAlign: 'center',
  },
  coinsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  coinsText: {
    fontSize: 16,
    color: COLORS.text,
  },
  coinsAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: 5,
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