import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Lock, Check, Coins, X } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { useAppStore } from "@/store/appStore";
import { LightEntity } from "@/components/LightEntity";
import { SKINS } from "@/constants/skins";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.3;

// Define skin type
interface Skin {
  id: string;
  name: string;
  price: number;
  colors: string[];
  trailColor: string;
  rarity: string;
  isAnimated?: boolean;
}

export default function SkinsScreen() {
  const selectedSkin = useAppStore((state) => state.selectedSkin);
  const unlockedSkins = useAppStore((state) => state.unlockedSkins);
  const coins = useAppStore((state) => state.coins);
  const selectSkin = useAppStore((state) => state.selectSkin);
  const unlockSkin = useAppStore((state) => state.unlockSkin);
  
  const [confirmModal, setConfirmModal] = useState(false);
  const [insufficientFundsModal, setInsufficientFundsModal] = useState(false);
  const [selectedSkinToBuy, setSelectedSkinToBuy] = useState<Skin | null>(null);
  
  const handleSelectSkin = (skinId: string) => {
    if (unlockedSkins.includes(skinId)) {
      selectSkin(skinId);
    } else {
      // Try to purchase
      const skin = SKINS.find(s => s.id === skinId);
      if (skin) {
        setSelectedSkinToBuy(skin);
        if (coins >= skin.price) {
          setConfirmModal(true);
        } else {
          setInsufficientFundsModal(true);
        }
      }
    }
  };
  
  const confirmPurchase = () => {
    if (selectedSkinToBuy) {
      unlockSkin(selectedSkinToBuy.id, selectedSkinToBuy.price);
    }
    setConfirmModal(false);
    setSelectedSkinToBuy(null);
  };
  
  const cancelPurchase = () => {
    setConfirmModal(false);
    setInsufficientFundsModal(false);
    setSelectedSkinToBuy(null);
  };
  
  const renderSkinItem = ({ item }: { item: Skin }) => {
    const isUnlocked = unlockedSkins.includes(item.id);
    const isSelected = selectedSkin === item.id;
    
    // Determine rarity color
    let rarityColor = COLORS.textSecondary;
    if (item.rarity === "rare") rarityColor = "#4FC3F7";
    if (item.rarity === "legendary") rarityColor = COLORS.accent;
    
    return (
      <TouchableOpacity
        style={[
          styles.skinCard,
          isSelected && styles.selectedSkinCard,
        ]}
        onPress={() => handleSelectSkin(item.id)}
      >
        <View style={styles.skinPreview}>
          <LightEntity 
            position={{ x: CARD_WIDTH / 2 - 18, y: CARD_WIDTH / 2 - 10 }} 
            energy={100}
            skinId={item.id}
            size={26} // Increased from 24 to 26 (1.1x)
            static
          />
        </View>
        
        <Text style={styles.skinName}>{item.name}</Text>
        <Text style={[styles.rarityText, { color: rarityColor }]}>
          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
        </Text>
        
        <View style={styles.skinFooter}>
          {isUnlocked ? (
            <View style={styles.skinStatus}>
              {isSelected && (
                <>
                  <Check size={16} color={COLORS.accent} />
                  <Text style={styles.selectedText}>Selected</Text>
                </>
              )}
              {!isSelected && (
                <Text style={styles.unlockedText}>Unlocked</Text>
              )}
            </View>
          ) : (
            <View style={styles.skinPrice}>
              <Coins size={16} color={COLORS.accent} />
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          )}
        </View>
        
        {!isUnlocked && (
          <View style={styles.lockOverlay}>
            <Lock size={24} color={COLORS.text} />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  // Get the currently selected skin
  const currentSkin = SKINS.find(skin => skin.id === selectedSkin) || SKINS[0];
  
  return (
    <LinearGradient
      colors={[COLORS.darkBackground, COLORS.background]}
      style={styles.container}
    >
      {/* Split View Layout */}
      <View style={styles.splitContainer}>
        {/* Left Side - Skin Display (60%) */}
        <View style={styles.skinDisplayContainer}>
          <LightEntity 
            position={{ x: width * 0.3, y: height * 0.15 }} 
            energy={100}
            skinId={selectedSkin}
            size={60}
            static
          />
        </View>
        
        {/* Right Side - Skin Info (40%) */}
        <View style={styles.skinInfoContainer}>
          <Text style={styles.currentSkinName}>{currentSkin.name}</Text>
          <Text style={[styles.currentSkinRarity, { 
            color: currentSkin.rarity === "legendary" ? COLORS.accent : 
                  currentSkin.rarity === "rare" ? "#4FC3F7" : COLORS.textSecondary 
          }]}>
            {currentSkin.rarity.charAt(0).toUpperCase() + currentSkin.rarity.slice(1)}
          </Text>
        </View>
      </View>
      
      {/* Available Skins */}
      <View style={styles.skinsListContainer}>
        <Text style={styles.skinsListTitle}>Available Skins</Text>
        
        <FlatList
          data={SKINS}
          renderItem={renderSkinItem}
          keyExtractor={(item: Skin) => item.id}
          numColumns={3}
          contentContainerStyle={styles.skinsList}
          columnWrapperStyle={styles.skinsRow}
        />
      </View>
      
      {/* Confirmation Modal */}
      <Modal
        visible={confirmModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Purchase</Text>
            {selectedSkinToBuy && (
              <>
                <Text style={styles.modalText}>
                  Are you sure you want to purchase the {selectedSkinToBuy.name} skin for {selectedSkinToBuy.price} coins?
                </Text>
                
                <View style={styles.skinPreviewModal}>
                  <LightEntity 
                    position={{ x: 50, y: 50 }} 
                    energy={100}
                    skinId={selectedSkinToBuy.id}
                    size={60}
                    static
                  />
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={cancelPurchase}
                  >
                    <Text style={styles.cancelButtonText}>No</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.confirmButton]} 
                    onPress={confirmPurchase}
                  >
                    <Text style={styles.confirmButtonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
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
            {selectedSkinToBuy && (
              <Text style={styles.modalText}>
                You don't have enough coins to purchase this skin. You need {selectedSkinToBuy.price} coins, but you only have {coins} coins.
              </Text>
            )}
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.fullWidthButton]} 
              onPress={cancelPurchase}
            >
              <Text style={styles.confirmButtonText}>Back</Text>
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
  splitContainer: {
    flexDirection: 'row',
    height: '35%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  skinDisplayContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skinInfoContainer: {
    width: '40%',
    justifyContent: 'center',
    paddingRight: 20,
  },
  currentSkinName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  currentSkinRarity: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  skinsListContainer: {
    flex: 1,
    padding: 20,
  },
  skinsListTitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  skinsList: {
    paddingBottom: 20,
  },
  skinsRow: {
    justifyContent: 'space-between',
    marginBottom: 3,
    gap: 3,
  },
  skinCard: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    transform: [{ translateX: -CARD_WIDTH / 6 }], // Move cards to the left by 1/6 of their width (1.2x)
  },
  selectedSkinCard: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  skinPreview: {
    width: CARD_WIDTH - 30,
    height: CARD_WIDTH - 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skinName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 2,
    textAlign: 'center',
  },
  rarityText: {
    fontSize: 10,
    marginBottom: 5,
  },
  skinFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  skinStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 12,
    color: COLORS.accent,
    marginLeft: 5,
  },
  unlockedText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  skinPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 12,
    color: COLORS.accent,
    marginLeft: 5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  skinPreviewModal: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
  },
  fullWidthButton: {
    width: '100%',
    backgroundColor: COLORS.accent,
  },
  confirmButton: {
    backgroundColor: COLORS.accent,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});