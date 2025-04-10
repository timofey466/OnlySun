import React from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>About Only Sun</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Concept</Text>
          <Text style={styles.text}>
            "Only Sun" is an atmospheric runner where you control a light entity in a world that's gradually darkening. Your goal is to survive as long as possible by collecting energy particles while managing your light's energy.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Play</Text>
          <Text style={styles.text}>
            • Move left and right to navigate the world{"\n"}
            • Jump to avoid obstacles{"\n"}
            • Collect yellow energy particles to maintain your light{"\n"}
            • Each movement costs energy, so move strategically{"\n"}
            • The world gets darker as you progress{"\n"}
            • Game ends when your energy is depleted or you hit an obstacle
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Mobile:</Text>{"\n"}
            • Use the on-screen buttons to move and jump{"\n"}
            {"\n"}
            <Text style={styles.bold}>Web:</Text>{"\n"}
            • Arrow keys to move left/right{"\n"}
            • Up arrow or Space to jump{"\n"}
            • P key to pause
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <Text style={styles.text}>
            • Don't move constantly - each movement costs energy{"\n"}
            • Prioritize collecting energy particles when your energy is low{"\n"}
            • Plan your jumps carefully to avoid wasting energy{"\n"}
            • The game gets progressively harder as you travel further
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
    color: COLORS.text,
  },
});