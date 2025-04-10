import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { SKINS } from '@/constants/skins';
import { LightEntity } from './LightEntity';
import { Gift, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = 120;
const SPACING = 180; // Increased spacing by 3x (was 60)

// Define a type for the skin object
type Skin = {
  id: string;
  name: string;
  price: number;
  colors: string[];
  trailColor: string;
  rarity: string;
  isAnimated?: boolean;
};

interface ChestOpeningAnimationProps {
  chestType: 'common' | 'rare' | 'legendary' | null;
  onClose: () => void;
  onSkinUnlock: (skinId: string) => void;
}

export const ChestOpeningAnimation = ({ 
  chestType, 
  onClose,
  onSkinUnlock
}: ChestOpeningAnimationProps) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Filter skins based on chest type
  const availableSkins = SKINS.filter(skin => {
    if (!chestType) return skin.rarity === 'common';
    if (chestType === 'legendary') return skin.rarity === 'legendary';
    if (chestType === 'rare') return skin.rarity === 'rare' || skin.rarity === 'common';
    return skin.rarity === 'common';
  });
  
  // Create a large array of skins to ensure continuous scrolling
  // This ensures we always have enough items to fill the view
  const extendedSkins = [...availableSkins, ...availableSkins, ...availableSkins, ...availableSkins, ...availableSkins];
  
  // Calculate the total width of all items
  const totalWidth = extendedSkins.length * (ITEM_SIZE + SPACING);
  
  useEffect(() => {
    // Start the animation
    const randomOffset = Math.floor(Math.random() * availableSkins.length);
    const targetPosition = (availableSkins.length * 2 + randomOffset) * (ITEM_SIZE + SPACING);
    
    Animated.sequence([
      // Initial delay
      Animated.delay(500),
      
      // Fast scroll - CS:GO style but slower for better viewing
      Animated.timing(scrollX, {
        toValue: targetPosition * 0.3,
        duration: 2500, // Increased from 1500 to 2500
        useNativeDriver: true,
      }),
      
      // Slow down gradually
      Animated.timing(scrollX, {
        toValue: targetPosition * 0.7,
        duration: 3000, // Increased from 2000 to 3000
        useNativeDriver: true,
      }),
      
      // Final slow approach to target
      Animated.spring(scrollX, {
        toValue: targetPosition,
        friction: 18, // Increased friction for smoother stop (was 15)
        tension: 20, // Decreased tension for smoother stop (was 25)
        useNativeDriver: true,
      })
    ]).start(() => {
      // Animation complete
      const finalIndex = Math.round(targetPosition / (ITEM_SIZE + SPACING)) % availableSkins.length;
      
      // Make sure we have a valid skin
      if (availableSkins[finalIndex]) {
        setSelectedSkin(availableSkins[finalIndex]);
        setAnimationComplete(true);
        
        // Unlock the skin
        onSkinUnlock(availableSkins[finalIndex].id);
      }
    });
  }, []);
  
  // Get chest type display name with proper capitalization
  const getChestDisplayName = () => {
    if (!chestType) return "Chest";
    return chestType.charAt(0).toUpperCase() + chestType.slice(1);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Opening {getChestDisplayName()} Chest
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.chestIcon}>
        <Gift 
          size={60} 
          color={
            chestType === 'legendary' ? COLORS.accent :
            chestType === 'rare' ? '#4FC3F7' : '#A0A0A0'
          } 
        />
      </View>
      
      <View style={styles.carouselContainer}>
        <View style={styles.mask}>
          <View style={styles.maskHighlight} />
        </View>
        
        <Animated.View
          style={[
            styles.carousel,
            {
              transform: [{ translateX: Animated.multiply(scrollX, -1) }]
            }
          ]}
        >
          {extendedSkins.map((skin, index) => {
            // Calculate the input range for the interpolation
            const inputRange = [
              (index - 2) * (ITEM_SIZE + SPACING),
              (index - 1) * (ITEM_SIZE + SPACING),
              index * (ITEM_SIZE + SPACING),
              (index + 1) * (ITEM_SIZE + SPACING),
              (index + 2) * (ITEM_SIZE + SPACING),
            ];
            
            // Calculate the scale based on the scroll position
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 0.9, 1, 0.9, 0.8],
              extrapolate: 'clamp',
            });
            
            // Calculate the opacity based on the scroll position
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 0.8, 1, 0.8, 0.5],
              extrapolate: 'clamp',
            });
            
            // We'll use a different approach to check if this is the selected skin
            const isSelected = animationComplete && 
                              selectedSkin && 
                              skin.id === selectedSkin.id;
            
            return (
              <Animated.View 
                key={`${skin.id}-${index}`}
                style={[
                  styles.skinItem,
                  {
                    marginHorizontal: SPACING / 2,
                    transform: [{ scale }],
                    opacity,
                    left: index * (ITEM_SIZE + SPACING) + (width - ITEM_SIZE) / 2,
                  }
                ]}
              >
                <LightEntity
                  position={{ x: ITEM_SIZE / 2, y: ITEM_SIZE / 2 }}
                  energy={100}
                  skinId={skin.id}
                  size={60}
                  static
                />
              </Animated.View>
            );
          })}
        </Animated.View>
      </View>
      
      {animationComplete && selectedSkin && (
        <View style={styles.resultContainer}>
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={[styles.skinNameText, { 
            color: selectedSkin.rarity === 'legendary' ? COLORS.accent :
                  selectedSkin.rarity === 'rare' ? '#4FC3F7' : COLORS.text 
          }]}>
            {selectedSkin.name}
          </Text>
          <Text style={styles.rarityText}>
            {selectedSkin.rarity.charAt(0).toUpperCase() + selectedSkin.rarity.slice(1)}
          </Text>
          
          <TouchableOpacity style={styles.closeResultButton} onPress={onClose}>
            <Text style={styles.closeResultText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center', // Center vertically
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 5,
  },
  chestIcon: {
    alignItems: 'center',
    marginBottom: 40,
  },
  carouselContainer: {
    height: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  carousel: {
    position: 'absolute',
    height: ITEM_SIZE,
    flexDirection: 'row',
  },
  skinItem: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mask: {
    position: 'absolute',
    width: ITEM_SIZE + 10,
    height: ITEM_SIZE + 10,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 12,
    zIndex: 10,
  },
  maskHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 10,
  },
  resultContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  skinNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rarityText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },
  closeResultButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  closeResultText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});