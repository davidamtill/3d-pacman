/**
 * Game constants and configuration
 */

import { Direction, GhostType, Position } from './types.js';

export const TILE_SIZE = 8;
export const MAP_WIDTH = 28;
export const MAP_HEIGHT = 31;

// Player constants
export const PLAYER_SPEED = 2;
export const PLAYER_SPAWN: Position = { x: 14, y: 23 };
export const INITIAL_LIVES = 3;
export const POWER_UP_DURATION = 6000; // 6 seconds in milliseconds

// Ghost constants
export const GHOST_SPEED = 1.8;
export const GHOST_FRIGHTENED_SPEED = 0.9;
export const GHOST_EATEN_SPEED = 4;

// Ghost spawn positions
export const GHOST_HOUSE_CENTER: Position = { x: 14, y: 14 };
export const GHOST_SPAWNS: Record<GhostType, Position> = {
  [GhostType.BLINKY]: { x: 14, y: 11 },
  [GhostType.PINKY]: { x: 14, y: 14 },
  [GhostType.INKY]: { x: 12, y: 14 },
  [GhostType.CLYDE]: { x: 16, y: 14 },
};

// Ghost scatter targets (home corners)
export const GHOST_HOME_CORNERS: Record<GhostType, Position> = {
  [GhostType.BLINKY]: { x: 25, y: 0 },  // Top-right
  [GhostType.PINKY]: { x: 2, y: 0 },    // Top-left
  [GhostType.INKY]: { x: 27, y: 30 },   // Bottom-right
  [GhostType.CLYDE]: { x: 0, y: 30 },   // Bottom-left
};

// Mode timing (in milliseconds)
export const MODE_TIMINGS = [
  { scatter: 7000, chase: 20000 },
  { scatter: 7000, chase: 20000 },
  { scatter: 5000, chase: 20000 },
  { scatter: 5000, chase: -1 },  // -1 = infinite
];

// Scoring
export const POINTS_DOT = 10;
export const POINTS_POWER_PELLET = 50;
export const POINTS_GHOST = [200, 400, 800, 1600]; // Multiplier for consecutive ghost eats

// Direction vectors
export const DIRECTION_VECTORS: Record<Direction, Position> = {
  [Direction.UP]: { x: 0, y: -1 },
  [Direction.DOWN]: { x: 0, y: 1 },
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.RIGHT]: { x: 1, y: 0 },
  [Direction.NONE]: { x: 0, y: 0 },
};

// Opposite directions for preventing 180-degree turns
export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT,
  [Direction.NONE]: Direction.NONE,
};
