import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_CONFIG } from '@/constants/game';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Types for game state
interface GameState {
  // Game status
  gameState: string;
  score: number;
  highScore: number;
  distance: number;
  
  // Player state
  energy: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  gameSpeed: number;
  lastEnergyDecayTime: number;
  
  // Game elements
  yellowSpheres: Array<{ id: string; x: number; y: number }>;
  blueSpheres: Array<{ id: string; x: number; y: number }>;
  obstacles: Array<{ 
    id: string; 
    x: number; 
    y: number; 
    width: number; 
    health: number;
    type: number; // 0.33, 0.66, or 1 (percentage of screen width)
  }>;
  projectiles: Array<{ id: string; x: number; y: number }>;
  lightTrail: Array<{ id: string; x: number; y: number; intensity: number; timestamp: number }>;
  
  // Actions
  startGame: () => void;
  endGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updateGame: (deltaTime: number) => void;
  movePlayer: (direction: { x: number; y: number }) => void;
  shoot: () => void;
  resetGame: () => void;
}

// Initial state values
const initialState = {
  gameState: GAME_CONFIG.GAME_STATES.MENU,
  score: 0,
  highScore: 0,
  distance: 0,
  
  energy: GAME_CONFIG.INITIAL_ENERGY,
  position: { x: width / 2, y: height * 0.75 - GAME_CONFIG.PLAYER_SIZE / 2 }, // Position at 75% of screen height, adjusted up by half player size
  velocity: { x: 0, y: 0 },
  gameSpeed: GAME_CONFIG.INITIAL_SPEED,
  lastEnergyDecayTime: 0,
  
  yellowSpheres: [],
  blueSpheres: [],
  obstacles: [],
  projectiles: [],
  lightTrail: [],
};

// Create the game store with persistence for high scores
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      startGame: () => set({
        gameState: GAME_CONFIG.GAME_STATES.PLAYING,
        score: 0,
        distance: 0,
        energy: GAME_CONFIG.INITIAL_ENERGY,
        position: { x: width / 2, y: height * 0.75 - GAME_CONFIG.PLAYER_SIZE }, // Position at 75% of screen height, adjusted up by player size
        velocity: { x: 0, y: 0 },
        gameSpeed: GAME_CONFIG.INITIAL_SPEED,
        lastEnergyDecayTime: Date.now(),
        yellowSpheres: [],
        blueSpheres: [],
        obstacles: [],
        projectiles: [],
        lightTrail: [],
      }),
      
      endGame: () => {
        const { score, highScore } = get();
        set({
          gameState: GAME_CONFIG.GAME_STATES.GAME_OVER,
          highScore: Math.max(score, highScore),
        });
      },
      
      pauseGame: () => set({ gameState: GAME_CONFIG.GAME_STATES.PAUSED }),
      
      resumeGame: () => set({ gameState: GAME_CONFIG.GAME_STATES.PLAYING }),
      
      updateGame: (deltaTime) => {
        const {
          gameState,
          position,
          velocity,
          energy,
          gameSpeed,
          yellowSpheres,
          blueSpheres,
          obstacles,
          projectiles,
          lightTrail,
          distance,
          lastEnergyDecayTime,
        } = get();
        
        if (gameState !== GAME_CONFIG.GAME_STATES.PLAYING) return;
        
        // Update player position based on velocity
        const newPosition = {
          x: position.x + velocity.x,
          y: position.y + velocity.y,
        };
        
        // Keep player within screen bounds
        // Prevent moving into top 25% of screen
        const minY = height * 0.25;
        const maxY = height - GAME_CONFIG.PLAYER_SIZE / 2;
        
        newPosition.x = Math.max(GAME_CONFIG.PLAYER_SIZE / 2, Math.min(width - GAME_CONFIG.PLAYER_SIZE / 2, newPosition.x));
        newPosition.y = Math.max(minY, Math.min(maxY, newPosition.y));
        
        // Apply friction to slow down movement
        const newVelocity = {
          x: velocity.x * 0.9, // Friction
          y: velocity.y * 0.9,
        };
        
        // Check energy decay interval
        const now = Date.now();
        let newEnergy = energy;
        let newLastEnergyDecayTime = lastEnergyDecayTime;
        
        if (now - lastEnergyDecayTime >= GAME_CONFIG.ENERGY_DECAY_INTERVAL) {
          newEnergy = Math.max(0, energy - GAME_CONFIG.ENERGY_DECAY_RATE);
          newLastEnergyDecayTime = now;
        }
        
        // Check game over condition
        if (newEnergy <= 0) {
          get().endGame();
          return;
        }
        
        // Update game speed - keep constant regardless of player movement
        const newGameSpeed = gameSpeed + GAME_CONFIG.WORLD_ACCELERATION * deltaTime;
        
        // Move game elements (they move down as player moves up)
        const newYellowSpheres = yellowSpheres
          .map(sphere => ({ ...sphere, y: sphere.y + newGameSpeed }))
          .filter(sphere => sphere.y < height + GAME_CONFIG.PARTICLE_SIZE);
        
        const newBlueSpheres = blueSpheres
          .map(sphere => ({ ...sphere, y: sphere.y + newGameSpeed }))
          .filter(sphere => sphere.y < height + GAME_CONFIG.PARTICLE_SIZE);
        
        const newObstacles = obstacles
          .map(obs => ({ ...obs, y: obs.y + newGameSpeed }))
          .filter(obs => obs.y < height + 50); // 50 is an estimated obstacle height
        
        // Move projectiles upward
        const newProjectiles = projectiles
          .map(proj => ({ ...proj, y: proj.y - 10 })) // Projectiles move faster than game speed
          .filter(proj => proj.y > -10);
        
        // Add new light trail segment
        const now2 = Date.now();
        const newLightTrail = [
          { 
            id: now2.toString(), 
            x: newPosition.x, 
            y: newPosition.y,
            intensity: Math.min(1, newEnergy / 50),
            timestamp: now2
          },
          ...lightTrail
        ].filter(segment => now2 - segment.timestamp < GAME_CONFIG.TRAIL_FADE_DURATION)
         .slice(0, GAME_CONFIG.TRAIL_SEGMENTS);
        
        // Randomly spawn new yellow spheres
        if (Math.random() < GAME_CONFIG.YELLOW_SPHERE_SPAWN_RATE) {
          newYellowSpheres.push({
            id: `yellow-${Date.now()}-${Math.random()}`,
            x: GAME_CONFIG.PARTICLE_SIZE + Math.random() * (width - 2 * GAME_CONFIG.PARTICLE_SIZE),
            y: -GAME_CONFIG.PARTICLE_SIZE,
          });
        }
        
        // Randomly spawn blue spheres (rarer)
        if (Math.random() < GAME_CONFIG.BLUE_SPHERE_SPAWN_RATE) {
          newBlueSpheres.push({
            id: `blue-${Date.now()}-${Math.random()}`,
            x: GAME_CONFIG.PARTICLE_SIZE + Math.random() * (width - 2 * GAME_CONFIG.PARTICLE_SIZE),
            y: -GAME_CONFIG.PARTICLE_SIZE,
          });
        }
        
        // Randomly spawn obstacles
        if (Math.random() < GAME_CONFIG.OBSTACLE_SPAWN_RATE) {
          const obstacleType = GAME_CONFIG.OBSTACLE_TYPES[Math.floor(Math.random() * GAME_CONFIG.OBSTACLE_TYPES.length)];
          const obstacleWidth = width * obstacleType;
          const obstacleX = Math.random() * (width - obstacleWidth);
          
          newObstacles.push({
            id: `obstacle-${Date.now()}-${Math.random()}`,
            x: obstacleX,
            y: -50, // Start above the screen
            width: obstacleWidth,
            health: 1,
            type: obstacleType,
          });
        }
        
        // Check collisions with yellow spheres
        const collidedYellowSpheres = newYellowSpheres.filter(sphere => {
          const dx = sphere.x - newPosition.x;
          const dy = sphere.y - newPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < (GAME_CONFIG.PLAYER_SIZE + GAME_CONFIG.PARTICLE_SIZE) / 2;
        });
        
        // Check collisions with blue spheres
        const collidedBlueSpheres = newBlueSpheres.filter(sphere => {
          const dx = sphere.x - newPosition.x;
          const dy = sphere.y - newPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < (GAME_CONFIG.PLAYER_SIZE + GAME_CONFIG.PARTICLE_SIZE) / 2;
        });
        
        // Apply effects from collected spheres
        let energyChange = 0;
        let speedChange = 0;
        
        collidedYellowSpheres.forEach(() => {
          energyChange += GAME_CONFIG.YELLOW_SPHERE_VALUE;
          speedChange += GAME_CONFIG.YELLOW_SPHERE_SPEED_BOOST;
        });
        
        collidedBlueSpheres.forEach(() => {
          energyChange += GAME_CONFIG.BLUE_SPHERE_VALUE;
          speedChange += GAME_CONFIG.BLUE_SPHERE_SPEED_PENALTY;
        });
        
        // Filter out collected spheres
        const filteredYellowSpheres = newYellowSpheres.filter(
          sphere => !collidedYellowSpheres.some(s => s.id === sphere.id)
        );
        
        const filteredBlueSpheres = newBlueSpheres.filter(
          sphere => !collidedBlueSpheres.some(s => s.id === sphere.id)
        );
        
        // Check projectile collisions with obstacles
        let destroyedObstacles = 0;
        const updatedObstacles = [...newObstacles];
        const updatedProjectiles = [...newProjectiles];
        
        for (let i = updatedProjectiles.length - 1; i >= 0; i--) {
          const proj = updatedProjectiles[i];
          let hitObstacle = false;
          
          for (let j = updatedObstacles.length - 1; j >= 0; j--) {
            const obs = updatedObstacles[j];
            
            if (
              proj.x >= obs.x && 
              proj.x <= obs.x + obs.width &&
              proj.y >= obs.y && 
              proj.y <= obs.y + 50 // Assuming obstacle height is 50
            ) {
              // Hit an obstacle
              hitObstacle = true;
              updatedObstacles.splice(j, 1); // Remove the obstacle
              destroyedObstacles++;
              break;
            }
          }
          
          if (hitObstacle) {
            updatedProjectiles.splice(i, 1); // Remove the projectile
          }
        }
        
        // Check player collisions with obstacles
        const hasCollided = updatedObstacles.some(obstacle => {
          return (
            newPosition.x + GAME_CONFIG.PLAYER_SIZE / 2 > obstacle.x &&
            newPosition.x - GAME_CONFIG.PLAYER_SIZE / 2 < obstacle.x + obstacle.width &&
            newPosition.y + GAME_CONFIG.PLAYER_SIZE / 2 > obstacle.y &&
            newPosition.y - GAME_CONFIG.PLAYER_SIZE / 2 < obstacle.y + 50 // Assuming obstacle height is 50
          );
        });
        
        if (hasCollided) {
          get().endGame();
          return;
        }
        
        // Update distance and score
        const newDistance = distance + newGameSpeed;
        const newScore = Math.floor(newDistance / 10) + 
                        collidedYellowSpheres.length * 10 + 
                        destroyedObstacles * 20;
        
        // Update state
        set({
          position: newPosition,
          velocity: newVelocity,
          energy: Math.max(0, Math.min(GAME_CONFIG.MAX_ENERGY, newEnergy + energyChange)),
          gameSpeed: Math.max(1, newGameSpeed + speedChange),
          yellowSpheres: filteredYellowSpheres,
          blueSpheres: filteredBlueSpheres,
          obstacles: updatedObstacles,
          projectiles: updatedProjectiles,
          lightTrail: newLightTrail,
          distance: newDistance,
          score: newScore,
          lastEnergyDecayTime: newLastEnergyDecayTime,
        });
      },
      
      movePlayer: (direction) => {
        const { gameState, position, velocity } = get();
        if (gameState !== GAME_CONFIG.GAME_STATES.PLAYING) return;
        
        // Prevent moving into top 25% of screen
        const minY = height * 0.25;
        const maxY = height - GAME_CONFIG.PLAYER_SIZE / 2;
        
        // Update velocity based on direction
        set({
          velocity: {
            x: direction.x,
            y: direction.y,
          }
        });
      },
      
      shoot: () => {
        const { gameState, position, energy, gameSpeed, projectiles } = get();
        if (gameState !== GAME_CONFIG.GAME_STATES.PLAYING) return;
        
        // Check if player has enough energy and speed to shoot
        if (energy < GAME_CONFIG.SHOOT_ENERGY_COST || gameSpeed < GAME_CONFIG.SHOOT_SPEED_COST) {
          return;
        }
        
        // Create new projectile
        const newProjectiles = [
          ...projectiles,
          {
            id: `projectile-${Date.now()}-${Math.random()}`,
            x: position.x,
            y: position.y - GAME_CONFIG.PLAYER_SIZE,
          }
        ];
        
        // Deduct energy and speed
        set({
          energy: energy - GAME_CONFIG.SHOOT_ENERGY_COST,
          gameSpeed: gameSpeed - GAME_CONFIG.SHOOT_SPEED_COST,
          projectiles: newProjectiles,
        });
      },
      
      resetGame: () => set({ ...initialState, highScore: get().highScore }),
    }),
    {
      name: 'only-sun-game',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ highScore: state.highScore }),
    }
  )
);