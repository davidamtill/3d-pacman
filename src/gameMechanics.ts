/**
 * Game mechanics: lives, respawn, scoring, power-ups
 */

import {
  Player,
  Ghost,
  GameState,
  GhostMode,
  GhostType,
  TileType,
  Position,
  Direction,
} from './types.js';
import {
  INITIAL_LIVES,
  POWER_UP_DURATION,
  POINTS_DOT,
  POINTS_POWER_PELLET,
  POINTS_GHOST,
  PLAYER_SPAWN,
  GHOST_SPAWNS,
} from './constants.js';
import { frightenGhosts, eatGhost } from './ghostAI.js';

/**
 * Handle player death and respawn
 */
export function handlePlayerDeath(gameState: GameState): void {
  gameState.player.lives -= 1;

  if (gameState.player.lives <= 0) {
    gameState.gameOver = true;
    return;
  }

  // Respawn player
  respawnPlayer(gameState.player);

  // Respawn all ghosts
  for (const ghost of gameState.ghosts) {
    respawnGhost(ghost);
  }
}

/**
 * Respawn player at starting position
 */
export function respawnPlayer(player: Player): void {
  player.position = { ...PLAYER_SPAWN };
  player.powerUpActive = false;
  player.powerUpTimer = 0;
}

/**
 * Respawn ghost at starting position
 */
export function respawnGhost(ghost: Ghost): void {
  ghost.position = { ...ghost.spawnPosition };
  ghost.mode = GhostMode.SCATTER;
  ghost.modeTimer = 0;
}

/**
 * Collect a dot and update score
 */
export function collectDot(
  gameState: GameState,
  position: Position
): void {
  const x = Math.floor(position.x);
  const y = Math.floor(position.y);

  if (gameState.map[y][x] === TileType.DOT) {
    gameState.map[y][x] = TileType.EMPTY;
    gameState.player.score += POINTS_DOT;
    gameState.dotsRemaining -= 1;

    // Check for level completion
    if (gameState.dotsRemaining === 0) {
      advanceLevel(gameState);
    }
  }
}

/**
 * Collect a power pellet and activate power-up
 */
export function collectPowerPellet(
  gameState: GameState,
  position: Position
): void {
  const x = Math.floor(position.x);
  const y = Math.floor(position.y);

  if (gameState.map[y][x] === TileType.POWER_PELLET) {
    gameState.map[y][x] = TileType.EMPTY;
    gameState.player.score += POINTS_POWER_PELLET;
    gameState.dotsRemaining -= 1;

    // Activate power-up
    activatePowerUp(gameState);

    // Check for level completion
    if (gameState.dotsRemaining === 0) {
      advanceLevel(gameState);
    }
  }
}

/**
 * Activate power-up mode
 */
export function activatePowerUp(gameState: GameState): void {
  gameState.player.powerUpActive = true;
  gameState.player.powerUpTimer = POWER_UP_DURATION;

  // Frighten all ghosts
  frightenGhosts(gameState.ghosts, POWER_UP_DURATION);
}

/**
 * Update power-up timer
 */
export function updatePowerUp(gameState: GameState, deltaTime: number): void {
  if (gameState.player.powerUpActive) {
    gameState.player.powerUpTimer -= deltaTime;

    if (gameState.player.powerUpTimer <= 0) {
      deactivatePowerUp(gameState);
    }
  }
}

/**
 * Deactivate power-up mode
 */
function deactivatePowerUp(gameState: GameState): void {
  gameState.player.powerUpActive = false;
  gameState.player.powerUpTimer = 0;

  // Return ghosts to scatter/chase mode
  for (const ghost of gameState.ghosts) {
    if (ghost.mode === GhostMode.FRIGHTENED) {
      ghost.mode = GhostMode.SCATTER;
      ghost.modeTimer = 0;
    }
  }
}

/**
 * Handle eating a ghost
 */
let consecutiveGhostEats = 0;

export function handleGhostEaten(
  gameState: GameState,
  ghost: Ghost
): void {
  if (ghost.mode === GhostMode.FRIGHTENED) {
    // Award points based on consecutive eats
    const points = POINTS_GHOST[Math.min(consecutiveGhostEats, POINTS_GHOST.length - 1)];
    gameState.player.score += points;
    consecutiveGhostEats += 1;

    // Set ghost to eaten mode
    eatGhost(ghost);
  }
}

/**
 * Reset consecutive ghost eat counter
 */
export function resetConsecutiveGhostEats(): void {
  consecutiveGhostEats = 0;
}

/**
 * Advance to next level
 */
export function advanceLevel(gameState: GameState): void {
  gameState.level += 1;

  // Reset map (reload dots and power pellets)
  initializeMap(gameState);

  // Respawn player
  respawnPlayer(gameState.player);

  // Respawn ghosts
  for (const ghost of gameState.ghosts) {
    respawnGhost(ghost);
  }

  // Reset consecutive eat counter
  resetConsecutiveGhostEats();
}

/**
 * Initialize/reset the game map
 */
function initializeMap(gameState: GameState): void {
  // This is a placeholder - in a real implementation,
  // you would load the map from a level file
  // For now, we'll just reset dot count
  gameState.dotsRemaining = countDots(gameState.map);
}

/**
 * Count total dots in map
 */
function countDots(map: TileType[][]): number {
  let count = 0;
  for (const row of map) {
    for (const tile of row) {
      if (tile === TileType.DOT || tile === TileType.POWER_PELLET) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Award extra life at certain score thresholds
 */
const EXTRA_LIFE_THRESHOLD = 10000;
let lastLifeScore = 0;

export function checkExtraLife(gameState: GameState): void {
  const currentThreshold = Math.floor(gameState.player.score / EXTRA_LIFE_THRESHOLD);
  const lastThreshold = Math.floor(lastLifeScore / EXTRA_LIFE_THRESHOLD);

  if (currentThreshold > lastThreshold) {
    gameState.player.lives += 1;
  }

  lastLifeScore = gameState.player.score;
}

/**
 * Initialize a new game
 */
export function initializeGame(map: TileType[][]): GameState {
  const player: Player = {
    position: { ...PLAYER_SPAWN },
    direction: Direction.NONE,
    speed: 2,
    lives: INITIAL_LIVES,
    score: 0,
    powerUpActive: false,
    powerUpTimer: 0,
  };

  const ghosts: Ghost[] = [
    createGhost(GhostType.BLINKY),
    createGhost(GhostType.PINKY),
    createGhost(GhostType.INKY),
    createGhost(GhostType.CLYDE),
  ];

  return {
    player,
    ghosts,
    map,
    level: 1,
    dotsRemaining: countDots(map),
    gameOver: false,
    paused: false,
    timestamp: Date.now(),
  };
}

/**
 * Create a ghost with proper initialization
 */
function createGhost(type: GhostType): Ghost {
  const spawnPos = GHOST_SPAWNS[type];
  const homeCorner = getHomeCorner(type);

  return {
    type: type,
    position: { ...spawnPos },
    direction: Direction.NONE,
    speed: 1.8,
    mode: GhostMode.SCATTER,
    targetTile: { ...homeCorner },
    homeCorner,
    spawnPosition: { ...spawnPos },
    modeTimer: 0,
  };
}

/**
 * Get home corner for ghost type
 */
function getHomeCorner(type: GhostType): Position {
  const corners: Record<GhostType, Position> = {
    [GhostType.BLINKY]: { x: 25, y: 0 },
    [GhostType.PINKY]: { x: 2, y: 0 },
    [GhostType.INKY]: { x: 27, y: 30 },
    [GhostType.CLYDE]: { x: 0, y: 30 },
  };
  return corners[type];
}
