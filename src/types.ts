/**
 * Core type definitions for the Pac-Man game
 */

export interface Position {
  x: number;
  y: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE',
}

export enum GhostMode {
  SCATTER = 'SCATTER',
  CHASE = 'CHASE',
  FRIGHTENED = 'FRIGHTENED',
  EATEN = 'EATEN',
}

export enum GhostType {
  BLINKY = 'BLINKY', // Red - aggressive chaser
  PINKY = 'PINKY',   // Pink - ambusher
  INKY = 'INKY',     // Cyan - unpredictable
  CLYDE = 'CLYDE',   // Orange - random
}

export enum TileType {
  EMPTY = 0,
  WALL = 1,
  DOT = 2,
  POWER_PELLET = 3,
  GHOST_HOUSE = 4,
}

export interface Entity {
  position: Position;
  direction: Direction;
  speed: number;
}

export interface Player extends Entity {
  lives: number;
  score: number;
  powerUpActive: boolean;
  powerUpTimer: number;
}

export interface Ghost extends Entity {
  type: GhostType;
  mode: GhostMode;
  targetTile: Position;
  homeCorner: Position; // Scatter target
  spawnPosition: Position;
  modeTimer: number;
}

export interface GameState {
  player: Player;
  ghosts: Ghost[];
  map: TileType[][];
  level: number;
  dotsRemaining: number;
  gameOver: boolean;
  paused: boolean;
  timestamp: number;
}

export interface CollisionResult {
  collided: boolean;
  type: 'wall' | 'ghost' | 'dot' | 'powerPellet' | 'none';
  entity?: Ghost;
}

export interface PathNode {
  position: Position;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // Total cost
  parent: PathNode | null;
}
