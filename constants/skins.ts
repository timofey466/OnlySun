import { COLORS } from './colors';

// Skin definitions with more creative designs
export const SKINS = [
  { 
    id: "default", 
    name: "Luminous Core", 
    price: 0, 
    colors: [COLORS.energyHigh, COLORS.lightEntity],
    trailColor: COLORS.lightTrail,
    rarity: "common"
  },
  { 
    id: "blue", 
    name: "Arctic Frost", 
    price: 100, 
    colors: ["#4FC3F7", "#BBDEFB", "#E1F5FE"],
    trailColor: "#81D4FA",
    rarity: "common"
  },
  { 
    id: "green", 
    name: "Emerald Pulse", 
    price: 200, 
    colors: ["#66BB6A", "#C8E6C9", "#43A047"],
    trailColor: "#A5D6A7",
    rarity: "common"
  },
  { 
    id: "purple", 
    name: "Mystic Aura", 
    price: 300, 
    colors: ["#9C27B0", "#E1BEE7", "#7B1FA2"],
    trailColor: "#CE93D8",
    rarity: "rare"
  },
  { 
    id: "red", 
    name: "Inferno Core", 
    price: 400, 
    colors: ["#F44336", "#FFCDD2", "#D32F2F"],
    trailColor: "#EF9A9A",
    rarity: "rare"
  },
  // Jupiter-themed skin
  { 
    id: "jupiter", 
    name: "Gas Giant", 
    price: 1200, 
    colors: ["#E59866", "#F5CBA7", "#F8C471", "#F39C12", "#D35400"],
    trailColor: "#F5B041",
    isAnimated: true,
    rarity: "legendary"
  },
  // Creative legendary skins
  { 
    id: "nebula", 
    name: "Cosmic Nebula", 
    price: 1500, 
    colors: ["#673AB7", "#3F51B5", "#2196F3", "#00BCD4"],
    trailColor: "#9575CD",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "phoenix", 
    name: "Phoenix Rebirth", 
    price: 1800, 
    colors: ["#FF9800", "#F44336", "#FFEB3B", "#FF5722"],
    trailColor: "#FFAB91",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "quantum", 
    name: "Quantum Flux", 
    price: 2000, 
    colors: ["#00BCD4", "#18FFFF", "#84FFFF", "#FFFFFF"],
    trailColor: "#80DEEA",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "eclipse", 
    name: "Solar Eclipse", 
    price: 2500, 
    colors: ["#212121", "#FF9800", "#FFEB3B", "#FFFFFF"],
    trailColor: "#FFA726",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "rainbow", 
    name: "Prismatic Shift", 
    price: 1000, 
    colors: ["#FF9800", "#F44336", "#9C27B0", "#3F51B5", "#4CAF50", "#FFEB3B"],
    trailColor: "#FFB74D",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "frost", 
    name: "Glacial Wisp", 
    price: 350, 
    colors: ["#B3E5FC", "#E1F5FE", "#81D4FA", "#4FC3F7"],
    trailColor: "#E1F5FE",
    rarity: "rare"
  },
  { 
    id: "sunset", 
    name: "Twilight Ember", 
    price: 450, 
    colors: ["#FF7043", "#FFCCBC", "#FF5722", "#E64A19"],
    trailColor: "#FFAB91",
    rarity: "rare"
  },
  { 
    id: "toxic", 
    name: "Toxic Radiance", 
    price: 550, 
    colors: ["#CDDC39", "#F0F4C3", "#AFB42B", "#827717"],
    trailColor: "#DCE775",
    rarity: "rare"
  },
  { 
    id: "cosmic", 
    name: "Void Walker", 
    price: 800, 
    colors: ["#311B92", "#D1C4E9", "#512DA8", "#4527A0"],
    trailColor: "#7986CB",
    rarity: "legendary"
  },
  { 
    id: "celestial", 
    name: "Astral Beacon", 
    price: 1200, 
    colors: ["#FFEB3B", "#FFFFFF", "#FFF176", "#FBC02D"],
    trailColor: "#FFF59D",
    isAnimated: true,
    rarity: "legendary"
  },
  // New creative legendary skins
  { 
    id: "vortex", 
    name: "Dimensional Vortex", 
    price: 2200, 
    colors: ["#6A1B9A", "#4A148C", "#9C27B0", "#E1BEE7", "#4A148C"],
    trailColor: "#9575CD",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "aurora", 
    name: "Northern Aurora", 
    price: 1900, 
    colors: ["#00BCD4", "#26C6DA", "#80DEEA", "#4DD0E1", "#00ACC1", "#0097A7"],
    trailColor: "#B2EBF2",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "dragonfire", 
    name: "Dragon's Breath", 
    price: 2300, 
    colors: ["#FF6F00", "#FF8F00", "#FFA000", "#FFB300", "#FFC107"],
    trailColor: "#FFCC80",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "timeshift", 
    name: "Temporal Shift", 
    price: 2800, 
    colors: ["#1A237E", "#283593", "#3949AB", "#3F51B5", "#5C6BC0", "#7986CB"],
    trailColor: "#C5CAE9",
    isAnimated: true,
    rarity: "legendary"
  },
  // Even more creative skins
  { 
    id: "crystalcore", 
    name: "Crystal Core", 
    price: 2400, 
    colors: ["#00BFA5", "#1DE9B6", "#64FFDA", "#A7FFEB", "#B2DFDB"],
    trailColor: "#80CBC4",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "shadowflame", 
    name: "Shadow Flame", 
    price: 2600, 
    colors: ["#212121", "#424242", "#616161", "#FF5722", "#FF7043"],
    trailColor: "#BDBDBD",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "stardust", 
    name: "Star Dust", 
    price: 2700, 
    colors: ["#5D4037", "#795548", "#8D6E63", "#FFEB3B", "#FFF176"],
    trailColor: "#D7CCC8",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "oceandepths", 
    name: "Ocean Depths", 
    price: 2500, 
    colors: ["#01579B", "#0277BD", "#0288D1", "#039BE5", "#03A9F4"],
    trailColor: "#81D4FA",
    isAnimated: true,
    rarity: "legendary"
  },
  // New super creative legendary skins
  { 
    id: "etherealflame", 
    name: "Ethereal Flame", 
    price: 3000, 
    colors: ["#7E57C2", "#B39DDB", "#D1C4E9", "#9575CD", "#673AB7"],
    trailColor: "#9575CD",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "frostfire", 
    name: "Frost Fire", 
    price: 3200, 
    colors: ["#29B6F6", "#81D4FA", "#E1F5FE", "#FF7043", "#FF5722"],
    trailColor: "#B3E5FC",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "abyssalecho", 
    name: "Abyssal Echo", 
    price: 3500, 
    colors: ["#263238", "#37474F", "#455A64", "#546E7A", "#78909C"],
    trailColor: "#90A4AE",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "solarsurge", 
    name: "Solar Surge", 
    price: 4000, 
    colors: ["#FFEB3B", "#FFF176", "#FFF59D", "#FFF9C4", "#FFFDE7"],
    trailColor: "#FFF59D",
    isAnimated: true,
    rarity: "legendary"
  },
  // Additional creative skins
  { 
    id: "galaxycore", 
    name: "Galaxy Core", 
    price: 3800, 
    colors: ["#3F51B5", "#5C6BC0", "#7986CB", "#9FA8DA", "#C5CAE9"],
    trailColor: "#9FA8DA",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "emeraldflame", 
    name: "Emerald Flame", 
    price: 2900, 
    colors: ["#004D40", "#00695C", "#00796B", "#00897B", "#009688"],
    trailColor: "#80CBC4",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "bloodmoon", 
    name: "Blood Moon", 
    price: 3300, 
    colors: ["#B71C1C", "#C62828", "#D32F2F", "#E53935", "#F44336"],
    trailColor: "#EF9A9A",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "sunsetglow", 
    name: "Sunset Glow", 
    price: 2800, 
    colors: ["#FF6F00", "#FF8F00", "#FFA000", "#FFB300", "#FFC107"],
    trailColor: "#FFECB3",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "electricblue", 
    name: "Electric Blue", 
    price: 2700, 
    colors: ["#0D47A1", "#1565C0", "#1976D2", "#1E88E5", "#2196F3"],
    trailColor: "#90CAF9",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "lavaglow", 
    name: "Lava Glow", 
    price: 3100, 
    colors: ["#BF360C", "#D84315", "#E64A19", "#F4511E", "#FF5722"],
    trailColor: "#FFAB91",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "neonpulse", 
    name: "Neon Pulse", 
    price: 3400, 
    colors: ["#00E676", "#00E5FF", "#18FFFF", "#84FFFF", "#A7FFEB"],
    trailColor: "#84FFFF",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "purplehaze", 
    name: "Purple Haze", 
    price: 2600, 
    colors: ["#4A148C", "#6A1B9A", "#7B1FA2", "#8E24AA", "#9C27B0"],
    trailColor: "#E1BEE7",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "goldenaura", 
    name: "Golden Aura", 
    price: 3600, 
    colors: ["#FF6F00", "#FF8F00", "#FFA000", "#FFB300", "#FFC107"],
    trailColor: "#FFE082",
    isAnimated: true,
    rarity: "legendary"
  },
  { 
    id: "silverlight", 
    name: "Silver Light", 
    price: 3200, 
    colors: ["#757575", "#9E9E9E", "#BDBDBD", "#E0E0E0", "#EEEEEE"],
    trailColor: "#F5F5F5",
    isAnimated: true,
    rarity: "legendary"
  }
];