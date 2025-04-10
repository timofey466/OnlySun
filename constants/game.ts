// Game configuration constants
export const GAME_CONFIG = {
  // Player settings
  INITIAL_ENERGY: 100,
  MAX_ENERGY: 100,
  ENERGY_DECAY_RATE: 1, // Energy lost every 0.5 seconds
  ENERGY_DECAY_INTERVAL: 500, // ms
  
  // World settings
  INITIAL_SPEED: 3, // Base speed of the world
  WORLD_ACCELERATION: 0.0001, // How quickly the world speeds up
  
  // Gameplay settings
  YELLOW_SPHERE_VALUE: 1, // Energy gained from collecting a yellow sphere
  YELLOW_SPHERE_SPEED_BOOST: 1, // Speed boost from yellow sphere
  YELLOW_SPHERE_SPAWN_RATE: 0.02, // Probability of spawning a yellow sphere per frame
  
  BLUE_SPHERE_VALUE: -1, // Energy lost from collecting a blue sphere
  BLUE_SPHERE_SPEED_PENALTY: -1, // Speed penalty from blue sphere
  BLUE_SPHERE_SPAWN_RATE: 0.004, // 5x rarer than yellow spheres
  
  OBSTACLE_SPAWN_RATE: 0.005, // Probability of spawning an obstacle per frame
  OBSTACLE_TYPES: [0.33, 0.66, 1], // Obstacle width percentages
  
  SHOOT_ENERGY_COST: 15, // Energy cost to shoot
  SHOOT_SPEED_COST: 15, // Speed cost to shoot
  
  // Visual settings
  TRAIL_FADE_DURATION: 2000, // How long light trails remain visible (ms)
  TRAIL_SEGMENTS: 10, // Number of segments in the light trail
  PARTICLE_SIZE: 15,
  PLAYER_SIZE: 25,
  
  // Game states
  GAME_STATES: {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
  },
};