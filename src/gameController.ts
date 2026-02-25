/**
 * Main game controller - integrates all systems
 */

import {
  GameState,
  Direction,
  TileType,
  GhostMode,
} from './types.js';
import { getNextPosition } from './utils.js';
import {
  checkCollisions,
  canMove,
} from './collision.js';
import {
  updateGhostAI,
  updateGhostMode,
  getGhostSpeed,
  checkGhostRespawn,
} from './ghostAI.js';
import {
  handlePlayerDeath,
  collectDot,
  collectPowerPellet,
  handleGhostEaten,
  updatePowerUp,
  resetConsecutiveGhostEats,
  checkExtraLife,
} from './gameMechanics.js';

/**
 * Main game update loop
 */
export function updateGame(
  gameState: GameState,
  deltaTime: number,
  playerInput?: Direction
): void {
  if (gameState.gameOver || gameState.paused) {
    return;
  }

  // Update timestamp
  gameState.timestamp += deltaTime;

  // Update player
  if (playerInput) {
    updatePlayer(gameState, playerInput);
  }

  // Update power-up timer
  updatePowerUp(gameState, deltaTime);

  // Update ghosts
  updateGhosts(gameState, deltaTime);

  // Check collisions
  handleCollisions(gameState);

  // Check for extra life
  checkExtraLife(gameState);
}

/**
 * Update player movement
 */
function updatePlayer(gameState: GameState, direction: Direction): void {
  const player = gameState.player;

  // Try to change direction if different from current
  if (direction !== player.direction) {
    if (canMove(player, direction, gameState.map)) {
      player.direction = direction;
    }
  }

  // Move in current direction
  if (canMove(player, player.direction, gameState.map)) {
    const nextPos = getNextPosition(player.position, player.direction);
    player.position = nextPos;
  }
}

/**
 * Update all ghosts
 */
function updateGhosts(gameState: GameState, deltaTime: number): void {
  // Get Blinky's position for Inky's AI
  const blinky = gameState.ghosts.find((g) => g.type === 'BLINKY');
  const blinkyPos = blinky?.position;

  for (const ghost of gameState.ghosts) {
    // Update ghost mode timing
    updateGhostMode(ghost, deltaTime, gameState.level, 0);

    // Check if ghost has respawned
    checkGhostRespawn(ghost);

    // Update AI to get next direction
    const nextDirection = updateGhostAI(
      ghost,
      gameState.player,
      gameState.map,
      blinkyPos
    );

    // Update direction if it's valid
    if (nextDirection !== 'NONE') {
      ghost.direction = nextDirection;
    }

    // Move ghost
    if (canMove(ghost, ghost.direction, gameState.map)) {
      const speed = getGhostSpeed(ghost);
      ghost.speed = speed;
      
      const nextPos = getNextPosition(ghost.position, ghost.direction);
      ghost.position = nextPos;
    }
  }
}

/**
 * Handle all collision detection and responses
 */
function handleCollisions(gameState: GameState): void {
  const collision = checkCollisions(
    gameState.player,
    gameState.ghosts,
    gameState.map
  );

  if (!collision.collided) {
    return;
  }

  switch (collision.type) {
    case 'ghost':
      if (collision.entity) {
        handleGhostCollision(gameState, collision.entity);
      }
      break;

    case 'dot':
      collectDot(gameState, gameState.player.position);
      break;

    case 'powerPellet':
      collectPowerPellet(gameState, gameState.player.position);
      break;

    case 'wall':
      // Wall collisions are prevented by movement logic
      break;
  }
}

/**
 * Handle collision with a ghost
 */
function handleGhostCollision(gameState: GameState, ghost: any): void {
  if (ghost.mode === GhostMode.FRIGHTENED) {
    // Eat the ghost
    handleGhostEaten(gameState, ghost);
  } else if (ghost.mode !== GhostMode.EATEN) {
    // Player dies
    handlePlayerDeath(gameState);
    resetConsecutiveGhostEats();
  }
}

/**
 * Set player input direction
 */
export function setPlayerDirection(
  gameState: GameState,
  direction: Direction
): void {
  // Store intended direction - will be applied in next update
  gameState.player.direction = direction;
}

/**
 * Pause/unpause the game
 */
export function togglePause(gameState: GameState): void {
  gameState.paused = !gameState.paused;
}

/**
 * Reset the game
 */
export function resetGame(gameState: GameState, map: TileType[][]): void {
  // This would reinitialize the game state
  // For now, just reset key values
  gameState.gameOver = false;
  gameState.paused = false;
  gameState.level = 1;
  gameState.player.lives = 3;
  gameState.player.score = 0;
  gameState.player.powerUpActive = false;
  
  // Reset would also reload the map and respawn entities
}

/**
 * Get current game statistics
 */
export function getGameStats(gameState: GameState) {
  return {
    score: gameState.player.score,
    lives: gameState.player.lives,
    level: gameState.level,
    dotsRemaining: gameState.dotsRemaining,
    powerUpActive: gameState.player.powerUpActive,
    powerUpTimeRemaining: gameState.player.powerUpTimer,
    gameOver: gameState.gameOver,
    paused: gameState.paused,
  };
}
