import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Sun, Play, Info, Award, Star, Clock, Gift, Gamepad2 } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { useGameStore } from "@/store/gameStore";
import { useAppStore } from "@/store/appStore";
import { GamePass } from "@/components/GamePass";

export default function HomeScreen() {
  const router = useRouter();
  const highScore = useGameStore((state) => state.highScore);
  const coins = useAppStore((state) => state.coins);
  const hasPass = useAppStore((state) => state.hasPass);
  const startGame = useGameStore((state) => state.startGame);
  
  const handlePlay = () => {
    // Start the game directly and navigate to game screen
    startGame();
    router.push("/game");
  };
  
  const handleInfo = () => {
    router.push("/modal");
  };
  
  return (
    <LinearGradient
      colors={[COLORS.darkBackground, COLORS.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Game Pass Section */}
        <GamePass />
        
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Award size={24} color={COLORS.accent} />
            <Text style={styles.statValue}>{highScore}</Text>
            <Text style={styles.statLabel}>High Score</Text>
          </View>
          
          <View style={styles.statCard}>
            <Star size={24} color={COLORS.accent} />
            <Text style={styles.statValue}>{coins}</Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
          
          <View style={styles.statCard}>
            <Clock size={24} color={COLORS.accent} />
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Next Reward</Text>
          </View>
        </View>
        
        {/* Daily Rewards */}
        <View style={styles.dailyRewardsContainer}>
          <View style={styles.sectionHeader}>
            <Gift size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Daily Rewards</Text>
          </View>
          
          <View style={styles.dailyRewardsRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <View 
                key={day} 
                style={[
                  styles.dailyRewardItem,
                  day === 1 && styles.dailyRewardActive
                ]}
              >
                <Text style={styles.dailyRewardDay}>Day {day}</Text>
                <Text style={styles.dailyRewardValue}>
                  {day < 7 ? `${day * 10} 🪙` : "Chest"}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Play Button */}
        <View style={styles.playButtonContainer}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
            <Gamepad2 size={24} color={COLORS.background} />
            <Text style={styles.playButtonText}>Play Now</Text>
          </TouchableOpacity>
        </View>
        
        {/* Game Info */}
        <TouchableOpacity style={styles.infoContainer} onPress={handleInfo}>
          <Info size={20} color={COLORS.textSecondary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Control a light entity in a darkening world. Collect energy particles to maintain your light and survive as long as possible. Each movement costs energy, so move wisely!
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: "30%",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dailyRewardsContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 10,
  },
  dailyRewardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dailyRewardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: 45,
  },
  dailyRewardActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  dailyRewardDay: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  dailyRewardValue: {
    fontSize: 10,
    color: COLORS.text,
  },
  playButtonContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  playButton: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  playButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
});