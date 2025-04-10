import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { Award, ChevronRight, Gift, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { ChestOpeningAnimation } from './ChestOpeningAnimation';

// Define reward item type
interface RewardItem {
  day: number;
  reward: string;
  icon: string;
  premium: boolean;
  claimed: boolean;
}

export const GamePass = () => {
  const hasPass = useAppStore((state) => state.hasPass);
  const purchasePass = useAppStore((state) => state.purchasePass);
  const passRewards = useAppStore((state) => state.passRewards);
  const claimPassReward = useAppStore((state) => state.claimPassReward);
  const addCoins = useAppStore((state) => state.addCoins);
  const unlockSkinWithoutCost = useAppStore((state) => state.unlockSkinWithoutCost);
  
  const [rewardsModalVisible, setRewardsModalVisible] = useState(false);
  const [chestOpeningModal, setChestOpeningModal] = useState(false);
  const [selectedChestType, setSelectedChestType] = useState<'common' | 'rare' | 'legendary' | null>(null);
  
  const handlePurchase = () => {
    // In a real app, this would trigger an in-app purchase
    purchasePass();
  };
  
  const showRewardsModal = () => {
    setRewardsModalVisible(true);
  };
  
  const handleClaimReward = (day: number, reward: string) => {
    // Process the reward
    if (reward.includes("Coins")) {
      const amount = parseInt(reward.split(" ")[0]);
      addCoins(amount);
      Alert.alert("Reward Claimed", `You received ${amount} coins!`);
      claimPassReward(day);
    } else if (reward.includes("Skin")) {
      // Extract skin name from reward text
      const skinName = reward.replace(" Skin", "");
      // Find skin ID by name (simplified approach)
      const skinId = skinName.toLowerCase().replace(/ /g, "");
      unlockSkinWithoutCost(skinId);
      Alert.alert("Reward Claimed", `You unlocked the ${skinName} skin!`);
      claimPassReward(day);
    } else if (reward.includes("Chest")) {
      // Determine chest type
      let chestType: 'common' | 'rare' | 'legendary' | null = null;
      if (reward.includes("Common")) chestType = 'common';
      if (reward.includes("Rare")) chestType = 'rare';
      if (reward.includes("Legendary")) chestType = 'legendary';
      
      // Mark as claimed first
      claimPassReward(day);
      
      // Open chest animation
      setSelectedChestType(chestType);
      setChestOpeningModal(true);
    } else {
      // Generic reward
      Alert.alert("Reward Claimed", `You received ${reward}!`);
      claimPassReward(day);
    }
  };
  
  const handleChestClose = () => {
    setChestOpeningModal(false);
    setSelectedChestType(null);
  };
  
  const handleSkinUnlock = (skinId: string) => {
    // Unlock the skin without deducting coins (already claimed from pass)
    unlockSkinWithoutCost(skinId);
  };
  
  const renderRewardItem = ({ item }: { item: RewardItem }) => (
    <View style={[
      styles.modalRewardItem,
      item.premium && styles.premiumRewardItem
    ]}>
      <View style={styles.rewardDay}>
        <Text style={styles.rewardDayText}>Day {item.day}</Text>
      </View>
      
      <View style={styles.rewardContent}>
        <View style={[
          styles.rewardIconContainer,
          item.premium && styles.premiumIconContainer
        ]}>
          <Gift size={24} color={item.premium ? COLORS.accent : COLORS.textSecondary} />
        </View>
        
        <Text style={[
          styles.rewardText,
          item.premium && styles.premiumRewardText
        ]}>
          {item.reward}
        </Text>
        
        {item.premium && (
          <View style={styles.premiumBadge}>
            <Award size={12} color={COLORS.background} />
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
        )}
        
        {!item.claimed && (
          <TouchableOpacity 
            style={[
              styles.claimButton,
              (!hasPass && item.premium) && styles.disabledClaimButton
            ]}
            onPress={() => handleClaimReward(item.day, item.reward)}
            disabled={!hasPass && item.premium}
          >
            <Text style={styles.claimButtonText}>
              {(!hasPass && item.premium) ? "Premium" : "Claim"}
            </Text>
          </TouchableOpacity>
        )}
        
        {item.claimed && (
          <View style={styles.claimedBadge}>
            <Text style={styles.claimedText}>Claimed</Text>
          </View>
        )}
      </View>
    </View>
  );
  
  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={showRewardsModal}
      >
        <LinearGradient
          colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.05)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Award size={30} color={COLORS.accent} />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>Season Pass</Text>
              <Text style={styles.description}>
                {hasPass 
                  ? "Unlock exclusive rewards every day!" 
                  : "Unlock exclusive skins and daily rewards"}
              </Text>
              
              <View style={styles.rewardsRow}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={styles.rewardItem}>
                    <Gift size={16} color={COLORS.accent} />
                  </View>
                ))}
                <Text style={styles.moreText}>+97 more</Text>
              </View>
            </View>
            
            <View style={styles.actionContainer}>
              {hasPass ? (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {passRewards.filter(r => r.claimed).length}/{passRewards.length}
                  </Text>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill, 
                      { width: `${(passRewards.filter(r => r.claimed).length / passRewards.length) * 100}%` }
                    ]} />
                  </View>
                </View>
              ) : (
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>$4.99</Text>
                  <ChevronRight size={20} color={COLORS.text} />
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Season Pass Rewards Modal */}
      <Modal
        visible={rewardsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRewardsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Season Pass Rewards</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setRewardsModalVisible(false)}
              >
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passInfoContainer}>
              <View style={styles.passInfo}>
                <Award size={24} color={COLORS.accent} />
                <View style={styles.passInfoText}>
                  <Text style={styles.passInfoTitle}>Premium Pass</Text>
                  <Text style={styles.passInfoDescription}>
                    Unlock all premium rewards and get exclusive skins!
                  </Text>
                </View>
              </View>
              
              {!hasPass && (
                <TouchableOpacity 
                  style={styles.purchaseButton}
                  onPress={() => {
                    handlePurchase();
                    setRewardsModalVisible(false);
                  }}
                >
                  <Text style={styles.purchaseButtonText}>Purchase $4.99</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={passRewards}
              renderItem={renderRewardItem}
              keyExtractor={(item) => `day-${item.day}`}
              contentContainerStyle={styles.rewardsList}
            />
          </View>
        </View>
      </Modal>
      
      {/* Chest Opening Modal */}
      <Modal
        visible={chestOpeningModal}
        animationType="fade"
        transparent={false}
      >
        <ChestOpeningAnimation 
          chestType={selectedChestType} 
          onClose={handleChestClose}
          onSkinUnlock={handleSkinUnlock}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  gradient: {
    borderRadius: 15,
  },
  content: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  rewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardItem: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  moreText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  actionContainer: {
    marginLeft: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginRight: 5,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: COLORS.text,
    marginBottom: 5,
  },
  progressBar: {
    width: 60,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 15,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 5,
  },
  passInfoContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  passInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  passInfoText: {
    marginLeft: 15,
    flex: 1,
  },
  passInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  passInfoDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  purchaseButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rewardsList: {
    padding: 15,
  },
  modalRewardItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  premiumRewardItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  rewardDay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  rewardDayText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  rewardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    position: 'relative',
  },
  rewardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  premiumIconContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  rewardText: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  premiumRewardText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  premiumBadge: {
    position: 'absolute',
    top: 5,
    right: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadgeText: {
    color: COLORS.background,
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  claimButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginLeft: 10,
  },
  disabledClaimButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  claimButtonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  claimedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginLeft: 10,
  },
  claimedText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});