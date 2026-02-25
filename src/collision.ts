/**
 * Collision detection system
 */

import {
  Position,
  TileType,
  Entity,
  Ghost,
  Player,
  CollisionResult,
  Direction,
} from './types.js';
import { positionsEqual, getNextPosition, isInBounds } from './utils.js';
import { MAP_WIDTH, MAP_HEIGHT } from './constants.js';

/**
 * Check if a position collides with a wall
 */
export function checkWallCollision(
  pos: Position,
  map: TileType[][]
): boolean {
  if (!isInBounds(pos, MAP_WIDTH, MAP_HEIGHT)) {
    return true;
  }
  
  const tile = map[Math.floor(pos.y)][Math.floor(pos.x)];
  return tile === TileType.WALL;
}

/**
 * Check if an entity can move in a given direction
 */
export function canMove(
  entity: Entity,
  direction: Direction,
  map: TileType[][]
): boolean {
  const nextPos = getNextPosition(entity.position, direction);
  return !checkWallCollision(nextPos, map);
}

/**
 * Check collision between player and a specific ghost
 */
export function checkGhostCollision(
  playerPos: Position,
  ghostPos: Position,
  threshold: number = 0.5
): boolean {
  const dx = Math.abs(playerPos.x - ghostPos.x);
  const dy = Math.abs(playerPos.y - ghostPos.y);
  
  // Use threshold for "close enough" collision
  return dx < threshold && dy < threshold;
}

/**
 * Check collision between player and all ghosts
 */
export function checkAllGhostCollisions(
  player: Player,
  ghosts: Ghost[]
): Ghost | null {
  for (const ghost of ghosts) {
    if (checkGhostCollision(player.position, ghost.position)) {
      return ghost;
    }
  }
  return null;
}

/**
 * Check what tile type the player is on
 */
export function getTileAt(pos: Position, map: TileType[][]): TileType {
  const x = Math.floor(pos.x);
  const y = Math.floor(pos.y);
  
  if (!isInBounds({ x, y }, MAP_WIDTH, MAP_HEIGHT)) {
    return TileType.WALL;
  }
  
  return map[y][x];
}

/**
 * Check for dot collection
 */
export function checkDotCollision(
  pos: Position,
  map: TileType[][]
): boolean {
  const tile = getTileAt(pos, map);
  return tile === TileType.DOT;
}

/**
 * Check for power pellet collection
 */
export function checkPowerPelletCollision(
  pos: Position,
  map: TileType[][]
): boolean {
  const tile = getTileAt(pos, map);
  return tile === TileType.POWER_PELLET;
}

/**
 * Comprehensive collision check
 */
export function checkCollisions(
  player: Player,
  ghosts: Ghost[],
  map: TileType[][]
): CollisionResult {
  // Check ghost collisions first (highest priority)
  const collidedGhost = checkAllGhostCollisions(player, ghosts);
  if (collidedGhost) {
    return {
      collided: true,
      type: 'ghost',
      entity: collidedGhost,
    };
  }

  // Check wall collision
  if (checkWallCollision(player.position, map)) {
    return {
      collided: true,
      type: 'wall',
    };
  }

  // Check power pellet
  if (checkPowerPelletCollision(player.position, map)) {
    return {
      collided: true,
      type: 'powerPellet',
    };
  }

  // Check dot
  if (checkDotCollision(player.position, map)) {
    return {
      collided: true,
      type: 'dot',
    };
  }

  return {
    collided: false,
    type: 'none',
  };
}

/**
 * Get all valid adjacent positions (not walls)
 */
export function getValidAdjacentPositions(
  pos: Position,
  map: TileType[][]
): Position[] {
  const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
  const validPositions: Position[] = [];

  for (const dir of directions) {
    const nextPos = getNextPosition(pos, dir);
    if (!checkWallCollision(nextPos, map)) {
      validPositions.push(nextPos);
    }
  }

  return validPositions;
}

/**
 * Check if position is at an intersection (more than 2 possible directions)
 */
export function isIntersection(pos: Position, map: TileType[][]): boolean {
  const validPositions = getValidAdjacentPositions(pos, map);
  return validPositions.length > 2;
}

/**
 * Check if two entities are on the same tile
 */
export function onSameTile(a: Entity, b: Entity): boolean {
  const aX = Math.floor(a.position.x);
  const aY = Math.floor(a.position.y);
  const bX = Math.floor(b.position.x);
  const bY = Math.floor(b.position.y);
  
  return aX === bX && aY === bY;
}
