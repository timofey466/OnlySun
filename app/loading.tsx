import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Sun } from "lucide-react-native";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/colors";
import { useAppStore } from "@/store/appStore";

const { width, height } = Dimensions.get("window");

export default function LoadingScreen() {
  const router = useRouter();
  const hasSeenTutorial = useAppStore((state) => state.hasSeenTutorial);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const sunRotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(sunRotateAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      )
    ]).start();
    
    // Navigate to main screen after delay
    const timer = setTimeout(() => {
      if (hasSeenTutorial) {
        router.replace("/(tabs)");
      } else {
        router.replace("/tutorial");
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [hasSeenTutorial]);
  
  // Rotate interpolation
  const spin = sunRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <LinearGradient
      colors={[COLORS.darkBackground, COLORS.background]}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Sun size={120} color={COLORS.accent} />
        </Animated.View>
        
        <Text style={styles.title}>Only Sun</Text>
        <Text style={styles.subtitle}>by Luminous Studios</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 30,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});