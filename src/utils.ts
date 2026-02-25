/**
 * Utility functions for position, distance, and direction calculations
 */

import { Position, Direction } from './types.js';
import { DIRECTION_VECTORS, OPPOSITE_DIRECTIONS } from './constants.js';

/**
 * Calculate Manhattan distance between two positions
 */
export function manhattanDistance(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Calculate Euclidean distance between two positions
 */
export function euclideanDistance(a: Position, b: Position): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Get the next position given current position and direction
 */
export function getNextPosition(pos: Position, dir: Direction): Position {
  const vector = DIRECTION_VECTORS[dir];
  return {
    x: pos.x + vector.x,
    y: pos.y + vector.y,
  };
}

/**
 * Check if a position is within map bounds
 */
export function isInBounds(pos: Position, width: number, height: number): boolean {
  return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
}

/**
 * Get the opposite direction
 */
export function getOppositeDirection(dir: Direction): Direction {
  return OPPOSITE_DIRECTIONS[dir];
}

/**
 * Get all valid directions (excluding opposite of current)
 */
export function getValidDirections(currentDir: Direction): Direction[] {
  const opposite = getOppositeDirection(currentDir);
  return [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT].filter(
    (dir) => dir !== opposite
  );
}

/**
 * Normalize a position to tile coordinates
 */
export function toTilePosition(pos: Position, tileSize: number): Position {
  return {
    x: Math.floor(pos.x / tileSize),
    y: Math.floor(pos.y / tileSize),
  };
}

/**
 * Convert tile coordinates to pixel position
 */
export function toPixelPosition(pos: Position, tileSize: number): Position {
  return {
    x: pos.x * tileSize,
    y: pos.y * tileSize,
  };
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get direction from one position to another
 */
export function getDirectionTo(from: Position, to: Position): Direction {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? Direction.RIGHT : Direction.LEFT;
  } else {
    return dy > 0 ? Direction.DOWN : Direction.UP;
  }
}

/**
 * Wrap position around map edges (for tunnel effect)
 */
export function wrapPosition(pos: Position, width: number, height: number): Position {
  return {
    x: ((pos.x % width) + width) % width,
    y: ((pos.y % height) + height) % height,
  };
}
