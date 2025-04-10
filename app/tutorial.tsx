import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Sun, Lightbulb, Zap, Move } from "lucide-react-native";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/colors";
import { useAppStore } from "@/store/appStore";

const { width, height } = Dimensions.get("window");

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Only Sun",
    description: "Control a light entity in a darkening world. Your goal is to survive as long as possible.",
    icon: Sun,
  },
  {
    title: "Swipe to Move",
    description: "Swipe left or right to move your light entity. Swipe up to jump over obstacles.",
    icon: Move,
  },
  {
    title: "Manage Your Energy",
    description: "Each movement costs energy. Collect yellow particles to replenish your light.",
    icon: Zap,
  },
  {
    title: "Survive the Darkness",
    description: "The world gets darker as you progress. Keep your light alive as long as possible!",
    icon: Lightbulb,
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const completeFirstTimeTutorial = useAppStore((state) => state.completeFirstTimeTutorial);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Light entity position for demo
  const lightPosition = useRef(new Animated.ValueXY({ x: width / 2, y: height / 2 })).current;
  
  // Pan responder for swipe demo
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (currentStep === 1) { // Only respond during the swipe tutorial step
          lightPosition.setValue({
            x: width / 2 + gestureState.dx,
            y: height / 2 + Math.min(0, gestureState.dy), // Only allow upward movement for "jump"
          });
        }
      },
      onPanResponderRelease: () => {
        // Return to center
        Animated.spring(lightPosition, {
          toValue: { x: width / 2, y: height / 2 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;
  
  const nextStep = () => {
    // Animate transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 1,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (currentStep < TUTORIAL_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        slideAnim.setValue(100);
        
        Animated.sequence([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Tutorial complete
        completeFirstTimeTutorial();
        router.replace("/(tabs)");
      }
    });
  };
  
  const CurrentIcon = TUTORIAL_STEPS[currentStep].icon;
  
  return (
    <LinearGradient
      colors={[COLORS.darkBackground, COLORS.background]}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      {currentStep === 1 && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.lightEntityDemo,
            {
              left: lightPosition.x,
              top: lightPosition.y,
              transform: [
                { translateX: -25 },
                { translateY: -25 },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[COLORS.energyHigh, COLORS.lightEntity]}
            style={styles.lightCore}
          />
        </Animated.View>
      )}
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <CurrentIcon size={80} color={COLORS.accent} />
        </View>
        
        <Text style={styles.title}>{TUTORIAL_STEPS[currentStep].title}</Text>
        <Text style={styles.description}>{TUTORIAL_STEPS[currentStep].description}</Text>
        
        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <Text style={styles.nextButtonText}>
            {currentStep < TUTORIAL_STEPS.length - 1 ? "Next" : "Start Playing"}
          </Text>
          <ArrowRight size={20} color={COLORS.background} />
        </TouchableOpacity>
      </Animated.View>
      
      <View style={styles.pagination}>
        {TUTORIAL_STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentStep === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
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
    width: "80%",
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  nextButton: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  nextButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: COLORS.accent,
    width: 20,
  },
  lightEntityDemo: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  lightCore: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});