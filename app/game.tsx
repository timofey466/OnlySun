import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Dimensions, Platform, PanResponder, BackHandler, TouchableOpacity, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGameStore } from "@/store/gameStore";
import { useAppStore } from "@/store/appStore";
import { GAME_CONFIG } from "@/constants/game";
import { COLORS } from "@/constants/colors";
import { Zap, Pause } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

// Components
import { LightEntity } from "@/components/LightEntity";
import { LightTrail } from "@/components/LightTrail";
import { YellowSphere } from "@/components/YellowSphere";
import { BlueSphere } from "@/components/BlueSphere";
import { Wall } from "@/components/Wall";
import { Projectile } from "@/components/Projectile";
import { EnergyBar } from "@/components/EnergyBar";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { GameMenu } from "@/components/GameMenu";
import { GameOver } from "@/components/GameOver";
import { PauseMenu } from "@/components/PauseMenu";

const { width, height } = Dimensions.get("window");

export default function GameScreen() {
  const router = useRouter();
  const gameState = useGameStore((state) => state.gameState);
  const position = useGameStore((state) => state.position);
  const energy = useGameStore((state) => state.energy);
  const score = useGameStore((state) => state.score);
  const highScore = useGameStore((state) => state.highScore);
  const distance = useGameStore((state) => state.distance);
  const yellowSpheres = useGameStore((state) => state.yellowSpheres);
  const blueSpheres = useGameStore((state) => state.blueSpheres);
  const obstacles = useGameStore((state) => state.obstacles);
  const projectiles = useGameStore((state) => state.projectiles);
  const lightTrail = useGameStore((state) => state.lightTrail);
  const movePlayer = useGameStore((state) => state.movePlayer);
  const shoot = useGameStore((state) => state.shoot);
  const startGame = useGameStore((state) => state.startGame);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const updateGame = useGameStore((state) => state.updateGame);
  const endGame = useGameStore((state) => state.endGame);
  
  const selectedSkin = useAppStore((state) => state.selectedSkin);
  const addCoins = useAppStore((state) => state.addCoins);
  
  // Animation frame reference
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  // Swipe sensitivity multiplier (lower = less sensitive)
  const SWIPE_SENSITIVITY = 0.4; // Increased from 0.2 to 0.4 (2x more sensitive)
  
  // Pan responder for swipe controls
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gameState !== GAME_CONFIG.GAME_STATES.PLAYING) return;
        
        // Apply sensitivity multiplier to make swipes less responsive
        const dx = gestureState.dx * SWIPE_SENSITIVITY;
        const dy = gestureState.dy * SWIPE_SENSITIVITY;
        
        // Allow movement in all directions
        movePlayer({ x: dx / 10, y: dy / 10 });
      },
      onPanResponderRelease: () => {
        // Stop movement when touch ends
        if (gameState === GAME_CONFIG.GAME_STATES.PLAYING) {
          movePlayer({ x: 0, y: 0 });
        }
      },
    })
  ).current;
  
  // Handle keyboard controls for web
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== GAME_CONFIG.GAME_STATES.PLAYING) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePlayer({ x: -5, y: 0 });
          break;
        case 'ArrowRight':
          movePlayer({ x: 5, y: 0 });
          break;
        case 'ArrowUp':
          movePlayer({ x: 0, y: -5 });
          break;
        case 'ArrowDown':
          movePlayer({ x: 0, y: 5 });
          break;
        case ' ':
          movePlayer({ x: 0, y: -10 });
          break;
        case 'p':
          pauseGame();
          break;
        case 'z':
        case 'x':
          shoot();
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameState !== GAME_CONFIG.GAME_STATES.PLAYING) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
          e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        movePlayer({ x: 0, y: 0 });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, movePlayer, pauseGame, shoot]);
  
  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (gameState === GAME_CONFIG.GAME_STATES.PLAYING) {
        pauseGame();
        return true;
      }
      return false;
    };
    
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    
    return () => backHandler.remove();
  }, [gameState, pauseGame]);
  
  // Game loop
  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        if (gameState === GAME_CONFIG.GAME_STATES.PLAYING) {
          // Slow down the game speed by 1.2x
          updateGame(deltaTime / 1.2);
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState, updateGame]);
  
  // Handle game over
  useEffect(() => {
    if (gameState === GAME_CONFIG.GAME_STATES.GAME_OVER) {
      // Add coins based on score
      const coinsEarned = Math.floor(score / 10);
      if (coinsEarned > 0) {
        addCoins(coinsEarned);
      }
    }
  }, [gameState, score, addCoins]);
  
  // Prevent navigation away during gameplay
  useEffect(() => {
    const preventNavigation = () => {
      return gameState === GAME_CONFIG.GAME_STATES.PLAYING;
    };
    
    // For web, we can use the beforeunload event
    if (Platform.OS === 'web') {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (preventNavigation()) {
          e.preventDefault();
          e.returnValue = '';
          return '';
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
    
    return () => {};
  }, [gameState, pauseGame]);
  
  // Handler functions for game controls
  const handlePause = () => {
    pauseGame();
  };
  
  const handleResume = () => {
    resumeGame();
  };
  
  const handleRestart = () => {
    resetGame();
    startGame();
  };
  
  const handleMainMenu = () => {
    resetGame();
    router.replace("/(tabs)");
  };
  
  const handleShoot = () => {
    shoot();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={[COLORS.darkBackground, COLORS.background]}
        style={styles.gameContainer}
        {...(gameState === GAME_CONFIG.GAME_STATES.PLAYING ? panResponder.panHandlers : {})}
      >
        {/* Game elements */}
        {gameState !== GAME_CONFIG.GAME_STATES.MENU && (
          <>
            {/* Light trail */}
            <LightTrail segments={lightTrail} skinId={selectedSkin} />
            
            {/* Player */}
            <LightEntity position={position} energy={energy} skinId={selectedSkin} />
            
            {/* Yellow spheres */}
            {yellowSpheres.map((sphere) => (
              <YellowSphere key={sphere.id} x={sphere.x} y={sphere.y} />
            ))}
            
            {/* Blue spheres */}
            {blueSpheres.map((sphere) => (
              <BlueSphere key={sphere.id} x={sphere.x} y={sphere.y} />
            ))}
            
            {/* Obstacles */}
            {obstacles.map((obstacle) => (
              <Wall
                key={obstacle.id}
                x={obstacle.x}
                y={obstacle.y}
                width={obstacle.width}
              />
            ))}
            
            {/* Projectiles */}
            {projectiles.map((projectile) => (
              <Projectile key={projectile.id} x={projectile.x} y={projectile.y} />
            ))}
            
            {/* UI elements */}
            <EnergyBar energy={energy} />
            <ScoreDisplay score={score} distance={distance} />
          </>
        )}
        
        {/* Game states */}
        {gameState === GAME_CONFIG.GAME_STATES.MENU && (
          <GameMenu onStart={startGame} highScore={highScore} />
        )}
        
        {gameState === GAME_CONFIG.GAME_STATES.GAME_OVER && (
          <GameOver
            score={score}
            distance={distance}
            highScore={highScore}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}
        
        {gameState === GAME_CONFIG.GAME_STATES.PAUSED && (
          <PauseMenu
            onResume={handleResume}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}
        
        {/* Game controls */}
        {gameState === GAME_CONFIG.GAME_STATES.PLAYING && (
          <View style={styles.controls}>
            {/* Pause button (left) */}
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={handlePause}
              activeOpacity={0.7}
            >
              <Pause size={24} color={COLORS.text} />
            </TouchableOpacity>
            
            {/* Shoot button (right) */}
            <TouchableOpacity
              style={styles.shootButton}
              onPress={handleShoot}
              activeOpacity={0.7}
            >
              <Zap size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shootButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});