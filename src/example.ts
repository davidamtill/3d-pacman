/**
 * Example usage of the Pac-Man game engine
 */

import {
  initializeGame,
  updateGame,
  setPlayerDirection,
  getGameStats,
  Direction,
  GameState,
  generateTestMap,
  GhostMode,
} from './index.js';

// Initialize game
console.log('🎮 Initializing Pac-Man Game Engine...\n');

const map = generateTestMap();
const gameState: GameState = initializeGame(map);

console.log('Initial Game State:');
console.log('------------------');
logGameStats(gameState);

// Simulate game loop
console.log('\n🏃 Running simulation...\n');

// Move right for a few frames
for (let i = 0; i < 10; i++) {
  updateGame(gameState, 16, Direction.RIGHT);
}

console.log('After moving right:');
logGameStats(gameState);

// Activate power-up simulation
console.log('\n⚡ Simulating power pellet collection...');
gameState.player.powerUpActive = true;
gameState.player.powerUpTimer = 6000;

for (const ghost of gameState.ghosts) {
  if (ghost.mode !== GhostMode.EATEN) {
    ghost.mode = GhostMode.FRIGHTENED;
  }
}

console.log('Power-up active! Ghosts are frightened.');

// Run more frames
for (let i = 0; i < 5; i++) {
  updateGame(gameState, 16, Direction.UP);
}

console.log('\nAfter power-up:');
logGameStats(gameState);

// Test collision scenario
console.log('\n💥 Ghost AI Targeting:');
for (const ghost of gameState.ghosts) {
  console.log(`${ghost.type}:`);
  console.log(`  Position: (${ghost.position.x.toFixed(1)}, ${ghost.position.y.toFixed(1)})`);
  console.log(`  Target: (${ghost.targetTile.x.toFixed(1)}, ${ghost.targetTile.y.toFixed(1)})`);
  console.log(`  Mode: ${ghost.mode}`);
}

console.log('\n✅ Simulation complete!\n');

// Helper function
function logGameStats(state: GameState) {
  const stats = getGameStats(state);
  console.log(`Score: ${stats.score}`);
  console.log(`Lives: ${stats.lives}`);
  console.log(`Level: ${stats.level}`);
  console.log(`Dots Remaining: ${stats.dotsRemaining}`);
  console.log(`Power-up Active: ${stats.powerUpActive}`);
  console.log(`Player Position: (${state.player.position.x.toFixed(1)}, ${state.player.position.y.toFixed(1)})`);
  console.log(`Game Over: ${stats.gameOver}`);
}
