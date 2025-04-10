import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define reward item type
interface RewardItem {
  day: number;
  reward: string;
  icon: string;
  premium: boolean;
  claimed: boolean;
}

// Types for app state
interface AppState {
  // User progress
  hasSeenTutorial: boolean;
  coins: number;
  
  // Premium features
  hasPass: boolean;
  adsDisabled: boolean;
  
  // Skins
  selectedSkin: string;
  unlockedSkins: string[];
  
  // Pass rewards
  passRewards: RewardItem[];
  
  // Actions
  completeFirstTimeTutorial: () => void;
  addCoins: (amount: number) => void;
  purchasePass: () => void;
  disableAds: () => void;
  selectSkin: (skinId: string) => void;
  unlockSkin: (skinId: string, price: number) => void;
  unlockSkinWithoutCost: (skinId: string) => void;
  claimPassReward: (day: number) => void;
}

// Generate 100 season pass rewards
const generatePassRewards = (): RewardItem[] => {
  const rewards: RewardItem[] = [];
  
  for (let i = 1; i <= 100; i++) {
    // Determine reward type based on day number
    let reward = "";
    let premium = false;
    
    // Every 5th day is premium
    if (i % 5 === 0) {
      premium = true;
      
      // Every 10th day is a premium chest
      if (i % 30 === 0) {
        reward = "Legendary Chest";
      } else if (i % 15 === 0) {
        reward = "Rare Chest";
      } else if (i % 10 === 0) {
        reward = "Common Chest";
      } else {
        // Other premium days get skins or more coins
        const skinNames = [
          "Arctic Frost", "Emerald Pulse", "Mystic Aura", "Inferno Core",
          "Cosmic Nebula", "Phoenix Rebirth", "Quantum Flux", "Solar Eclipse",
          "Prismatic Shift", "Glacial Wisp", "Twilight Ember", "Toxic Radiance",
          "Void Walker", "Astral Beacon", "Dimensional Vortex", "Northern Aurora",
          "Dragon's Breath", "Temporal Shift", "Crystal Core", "Shadow Flame"
        ];
        
        if (i % 25 === 0) {
          // Special days get legendary skins
          const legendaryIndex = Math.floor(i / 25) % 8;
          reward = `${skinNames[legendaryIndex + 8]} Skin`;
        } else {
          // Other premium days get more coins
          reward = `${i * 5} Coins`;
        }
      }
    } else {
      // Regular rewards are coins or common chests
      if (i % 7 === 0) {
        reward = "Common Chest";
      } else {
        reward = `${i * 2} Coins`;
      }
    }
    
    rewards.push({
      day: i,
      reward,
      icon: reward.includes("Chest") ? "Chest" : 
            reward.includes("Skin") ? "Skin" : "Coins",
      premium,
      claimed: false
    });
  }
  
  return rewards;
};

// Season pass rewards data
const SEASON_PASS_REWARDS = generatePassRewards();

// Initial state values
const initialState = {
  hasSeenTutorial: false,
  coins: 0,
  
  hasPass: false,
  adsDisabled: false,
  
  selectedSkin: "default",
  unlockedSkins: ["default"],
  
  passRewards: SEASON_PASS_REWARDS,
};

// Create the app store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      completeFirstTimeTutorial: () => set({ hasSeenTutorial: true }),
      
      addCoins: (amount) => set((state) => ({ 
        coins: state.coins + amount 
      })),
      
      purchasePass: () => set({ hasPass: true }),
      
      disableAds: () => set({ adsDisabled: true }),
      
      selectSkin: (skinId) => set({ selectedSkin: skinId }),
      
      unlockSkin: (skinId, price) => {
        const { coins, unlockedSkins } = get();
        
        if (coins >= price && !unlockedSkins.includes(skinId)) {
          set({
            coins: coins - price,
            unlockedSkins: [...unlockedSkins, skinId],
            selectedSkin: skinId,
          });
        }
      },
      
      unlockSkinWithoutCost: (skinId) => {
        const { unlockedSkins } = get();
        
        if (!unlockedSkins.includes(skinId)) {
          set({
            unlockedSkins: [...unlockedSkins, skinId],
            selectedSkin: skinId,
          });
        }
      },
      
      claimPassReward: (day) => {
        const { passRewards } = get();
        const updatedRewards = passRewards.map(reward => 
          reward.day === day ? { ...reward, claimed: true } : reward
        );
        
        set({ passRewards: updatedRewards });
      },
    }),
    {
      name: 'only-sun-app',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);