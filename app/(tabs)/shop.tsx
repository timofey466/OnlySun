import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShoppingBag, Coins, Package, Award, Ban, Gift } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { useAppStore } from "@/store/appStore";
import { ChestOpeningAnimation } from "@/components/ChestOpeningAnimation";

export default function ShopScreen() {
  const coins = useAppStore((state) => state.coins);
  const hasPass = useAppStore((state) => state.hasPass);
  const adsDisabled = useAppStore((state) => state.adsDisabled);
  const purchasePass = useAppStore((state) => state.purchasePass);
  const disableAds = useAppStore((state) => state.disableAds);
  const addCoins = useAppStore((state) => state.addCoins);
  const unlockSkinWithoutCost = useAppStore((state) => state.unlockSkinWithoutCost);
  
  const [chestOpeningModal, setChestOpeningModal] = useState(false);
  const [selectedChestType, setSelectedChestType] = useState(null);
  const [insufficientFundsModal, setInsufficientFundsModal] = useState(false);
  const [chestPrice, setChestPrice] = useState(0);
  
  const handlePurchasePass = () => {
    // In a real app, this would trigger an in-app purchase
    purchasePass();
  };
  
  const handleDisableAds = () => {
    // In a real app, this would trigger an in-app purchase
    disableAds();
  };
  
  const handlePurchaseCoins = (amount) => {
    // In a real app, this would trigger an in-app purchase
    addCoins(amount);
  };
  
  const handlePurchaseChest = (chestType) => {
    let price = 0;
    
    switch (chestType) {
      case "common":
        price = 50;
        break;
      case "rare":
        price = 150;
        break;
      case "legendary":
        price = 500;
        break;
    }
    
    if (coins >= price) {
      // Deduct coins
      addCoins(-price);
      
      // Open chest animation
      setSelectedChestType(chestType);
      setChestOpeningModal(true);
    } else {
      // Show insufficient funds modal
      setChestPrice(price);
      setInsufficientFundsModal(true);
    }
  };
  
  const handleChestClose = () => {
    setChestOpeningModal(false);
    setSelectedChestType(null);
  };
  
  const handleSkinUnlock = (skinId) => {
    // Unlock the skin without deducting coins (already deducted when purchasing chest)
    unlockSkinWithoutCost(skinId);
  };
  
  return (
    <LinearGradient
      colors={[COLORS.darkBackground, COLORS.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Current Coins */}
        <View style={styles.coinsContainer}>
          <Coins size={24} color={COLORS.accent} />
          <Text style={styles.coinsText}>{coins}</Text>
        </View>
        
        {/* Premium Features */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Premium Features</Text>
          </View>
          
          <View style={styles.premiumItems}>
            <TouchableOpacity 
              style={[
                styles.premiumItem,
                hasPass && styles.purchasedItem
              ]}
              onPress={handlePurchasePass}
              disabled={hasPass}
            >
              <Award size={24} color={hasPass ? COLORS.textSecondary : COLORS.accent} />
              <Text style={styles.premiumItemTitle}>Game Pass</Text>
              <Text style={styles.premiumItemDescription}>
                Unlock exclusive skins and daily rewards
              </Text>
              <View style={styles.premiumItemPrice}>
                {hasPass ? (
                  <Text style={styles.purchasedText}>Purchased</Text>
                ) : (
                  <Text style={styles.priceText}>$4.99</Text>
                )}
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.premiumItem,
                adsDisabled && styles.purchasedItem
              ]}
              onPress={handleDisableAds}
              disabled={adsDisabled}
            >
              <Ban size={24} color={adsDisabled ? COLORS.textSecondary : COLORS.accent} />
              <Text style={styles.premiumItemTitle}>Remove Ads</Text>
              <Text style={styles.premiumItemDescription}>
                Play without interruptions
              </Text>
              <View style={styles.premiumItemPrice}>
                {adsDisabled ? (
                  <Text style={styles.purchasedText}>Purchased</Text>
                ) : (
                  <Text style={styles.priceText}>$2.99</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Coins Packages */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Coins size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Coins</Text>
          </View>
          
          <View style={styles.coinsPackages}>
            <TouchableOpacity 
              style={styles.coinPackage}
              onPress={() => handlePurchaseCoins(100)}
            >
              <Text style={styles.coinAmount}>100</Text>
              <Coins size={20} color={COLORS.accent} />
              <View style={styles.buyButton}>
                <Text style={styles.buyButtonText}>$0.99</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.coinPackage}
              onPress={() => handlePurchaseCoins(500)}
            >
              <Text style={styles.coinAmount}>500</Text>
              <Coins size={20} color={COLORS.accent} />
              <View style={styles.buyButton}>
                <Text style={styles.buyButtonText}>$4.99</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.coinPackage}
              onPress={() => handlePurchaseCoins(1000)}
            >
              <Text style={styles.coinAmount}>1000</Text>
              <Coins size={20} color={COLORS.accent} />
              <View style={[styles.buyButton, styles.bestValueButton]}>
                <Text style={styles.buyButtonText}>$8.99</Text>
                <Text style={styles.bestValueText}>Best Value!</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Chests */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Package size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Chests</Text>
          </View>
          
          <View style={styles.chestsContainer}>
            <TouchableOpacity 
              style={styles.chestItem}
              onPress={() => handlePurchaseChest("common")}
            >
              <Gift size={40} color="#A0A0A0" />
              <View style={styles.chestContent}>
                <Text style={styles.chestTitle}>Common Chest</Text>
                <Text style={styles.chestDescription}>
                  Contains common skins
                </Text>
              </View>
              <View style={styles.chestPrice}>
                <Coins size={16} color={COLORS.accent} />
                <Text style={styles.chestPriceText}>50</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.chestItem}
              onPress={() => handlePurchaseChest("rare")}
            >
              <Gift size={40} color="#4FC3F7" />
              <View style={styles.chestContent}>
                <Text style={styles.chestTitle}>Rare Chest</Text>
                <Text style={styles.chestDescription}>
                  Contains common and rare skins
                </Text>
              </View>
              <View style={styles.chestPrice}>
                <Coins size={16} color={COLORS.accent} />
                <Text style={styles.chestPriceText}>150</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.chestItem}
              onPress={() => handlePurchaseChest("legendary")}
            >
              <Gift size={40} color={COLORS.accent} />
              <View style={styles.chestContent}>
                <Text style={styles.chestTitle}>Legendary Chest</Text>
                <Text style={styles.chestDescription}>
                  Contains legendary skins
                </Text>
              </View>
              <View style={styles.chestPrice}>
                <Coins size={16} color={COLORS.accent} />
                <Text style={styles.chestPriceText}>500</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
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
      
      {/* Insufficient Funds Modal */}
      <Modal
        visible={insufficientFundsModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Insufficient Funds</Text>
            <Text style={styles.modalText}>
              You don't have enough coins to purchase this chest. You need {chestPrice} coins, but you only have {coins} coins.
            </Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setInsufficientFundsModal(false)}
            >
              <Text style={styles.modalButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
  },
  coinsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.accent,
    marginLeft: 10,
  },
  sectionContainer: {
    marginBottom: 25,
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
  premiumItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  premiumItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    padding: 15,
    width: "48%",
    alignItems: "center",
  },
  purchasedItem: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
  },
  premiumItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 5,
  },
  premiumItemDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 10,
  },
  premiumItemPrice: {
    marginTop: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.accent,
  },
  purchasedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  coinsPackages: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coinPackage: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    padding: 15,
    width: "30%",
    alignItems: "center",
  },
  coinAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  buyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: "center",
  },
  bestValueButton: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  bestValueText: {
    fontSize: 10,
    color: COLORS.accent,
    marginTop: 2,
  },
  chestsContainer: {
    gap: 15,
  },
  chestItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  chestContent: {
    flex: 1,
    marginLeft: 15,
  },
  chestTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  chestDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chestPrice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  chestPriceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.accent,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  modalButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});