/**
 * Ghost AI behaviors: patrol, chase, scatter, frightened
 */

import {
  Ghost,
  GhostType,
  GhostMode,
  Player,
  Position,
  Direction,
  TileType,
} from './types.js';
import { getDirectionToTarget, findPath } from './pathfinding.js';
import { getNextPosition, manhattanDistance, euclideanDistance } from './utils.js';
import {
  GHOST_SPEED,
  GHOST_FRIGHTENED_SPEED,
  GHOST_EATEN_SPEED,
  GHOST_HOUSE_CENTER,
  MODE_TIMINGS,
} from './constants.js';

/**
 * Calculate target tile for each ghost based on their personality
 */
export function calculateTargetTile(
  ghost: Ghost,
  player: Player,
  blinkyPos?: Position
): Position {
  // Eaten ghosts return to ghost house
  if (ghost.mode === GhostMode.EATEN) {
    return GHOST_HOUSE_CENTER;
  }

  // Scatter mode - go to home corner
  if (ghost.mode === GhostMode.SCATTER) {
    return ghost.homeCorner;
  }

  // Frightened mode - random movement (handled separately)
  if (ghost.mode === GhostMode.FRIGHTENED) {
    return ghost.targetTile; // Keep previous target, movement is random
  }

  // Chase mode - each ghost has unique targeting
  switch (ghost.type) {
    case GhostType.BLINKY:
      // Blinky (Red) - Directly targets Pac-Man
      return { ...player.position };

    case GhostType.PINKY:
      // Pinky (Pink) - Targets 4 tiles ahead of Pac-Man
      return getPinkyTarget(player);

    case GhostType.INKY:
      // Inky (Cyan) - Complex targeting using Blinky's position
      return getInkyTarget(player, blinkyPos || ghost.position);

    case GhostType.CLYDE:
      // Clyde (Orange) - Targets Pac-Man if far, scatters if close
      return getClydeTarget(player, ghost.position, ghost.homeCorner);

    default:
      return player.position;
  }
}

/**
 * Pinky's targeting: 4 tiles ahead of player
 */
function getPinkyTarget(player: Player): Position {
  const lookahead = 4;
  let targetX = player.position.x;
  let targetY = player.position.y;

  switch (player.direction) {
    case Direction.UP:
      targetY -= lookahead;
      targetX -= lookahead; // Original bug in Pac-Man
      break;
    case Direction.DOWN:
      targetY += lookahead;
      break;
    case Direction.LEFT:
      targetX -= lookahead;
      break;
    case Direction.RIGHT:
      targetX += lookahead;
      break;
  }

  return { x: targetX, y: targetY };
}

/**
 * Inky's targeting: Uses vector from Blinky to 2 tiles ahead, then doubles it
 */
function getInkyTarget(player: Player, blinkyPos: Position): Position {
  const lookahead = 2;
  let pivotX = player.position.x;
  let pivotY = player.position.y;

  switch (player.direction) {
    case Direction.UP:
      pivotY -= lookahead;
      break;
    case Direction.DOWN:
      pivotY += lookahead;
      break;
    case Direction.LEFT:
      pivotX -= lookahead;
      break;
    case Direction.RIGHT:
      pivotX += lookahead;
      break;
  }

  // Vector from Blinky to pivot, doubled
  const vectorX = pivotX - blinkyPos.x;
  const vectorY = pivotY - blinkyPos.y;

  return {
    x: blinkyPos.x + vectorX * 2,
    y: blinkyPos.y + vectorY * 2,
  };
}

/**
 * Clyde's targeting: Shy behavior - chases if far, scatters if close
 */
function getClydeTarget(
  player: Player,
  clydePos: Position,
  homeCorner: Position
): Position {
  const distance = euclideanDistance(clydePos, player.position);
  const shyDistance = 8;

  if (distance > shyDistance) {
    return player.position;
  } else {
    return homeCorner;
  }
}

/**
 * Update ghost's AI and determine next direction
 */
export function updateGhostAI(
  ghost: Ghost,
  player: Player,
  map: TileType[][],
  blinkyPos?: Position
): Direction {
  // Update target tile based on current mode
  ghost.targetTile = calculateTargetTile(ghost, player, blinkyPos);

  // Frightened mode - random valid direction
  if (ghost.mode === GhostMode.FRIGHTENED) {
    return getRandomDirection(ghost, map);
  }

  // Normal pathfinding to target
  return getDirectionToTarget(ghost.position, ghost.targetTile, map);
}

/**
 * Get random valid direction (for frightened mode)
 */
function getRandomDirection(ghost: Ghost, map: TileType[][]): Direction {
  const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
  const validDirections = directions.filter((dir) => {
    const nextPos = getNextPosition(ghost.position, dir);
    // Avoid going back the way we came and check for walls
    return (
      dir !== getOppositeDirection(ghost.direction) &&
      !checkWallCollision(nextPos, map)
    );
  });

  if (validDirections.length === 0) {
    return ghost.direction; // Keep current direction if no valid options
  }

  return validDirections[Math.floor(Math.random() * validDirections.length)];
}

/**
 * Get opposite direction
 */
function getOppositeDirection(dir: Direction): Direction {
  const opposites: Record<Direction, Direction> = {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
    [Direction.NONE]: Direction.NONE,
  };
  return opposites[dir];
}

/**
 * Check for wall collision (simplified for AI)
 */
function checkWallCollision(pos: Position, map: TileType[][]): boolean {
  const x = Math.floor(pos.x);
  const y = Math.floor(pos.y);
  
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return true;
  }
  
  return map[y][x] === TileType.WALL;
}

/**
 * Update ghost mode based on timer and level
 */
export function updateGhostMode(
  ghost: Ghost,
  deltaTime: number,
  level: number,
  modePhase: number
): void {
  // Don't change mode if frightened or eaten
  if (ghost.mode === GhostMode.FRIGHTENED || ghost.mode === GhostMode.EATEN) {
    return;
  }

  ghost.modeTimer += deltaTime;

  const timings = MODE_TIMINGS[Math.min(modePhase, MODE_TIMINGS.length - 1)];
  const currentMode = ghost.mode;

  if (currentMode === GhostMode.SCATTER && ghost.modeTimer >= timings.scatter) {
    ghost.mode = GhostMode.CHASE;
    ghost.modeTimer = 0;
  } else if (
    currentMode === GhostMode.CHASE &&
    timings.chase !== -1 &&
    ghost.modeTimer >= timings.chase
  ) {
    ghost.mode = GhostMode.SCATTER;
    ghost.modeTimer = 0;
  }
}

/**
 * Set all ghosts to frightened mode
 */
export function frightenGhosts(ghosts: Ghost[], duration: number): void {
  for (const ghost of ghosts) {
    if (ghost.mode !== GhostMode.EATEN) {
      ghost.mode = GhostMode.FRIGHTENED;
      ghost.modeTimer = 0;
      // Reverse direction when frightened
      ghost.direction = getOppositeDirection(ghost.direction);
    }
  }
}

/**
 * Handle ghost being eaten
 */
export function eatGhost(ghost: Ghost): void {
  ghost.mode = GhostMode.EATEN;
  ghost.modeTimer = 0;
  ghost.speed = GHOST_EATEN_SPEED;
}

/**
 * Check if ghost has returned to house after being eaten
 */
export function checkGhostRespawn(ghost: Ghost): boolean {
  if (ghost.mode === GhostMode.EATEN) {
    const distance = manhattanDistance(ghost.position, GHOST_HOUSE_CENTER);
    if (distance < 1) {
      ghost.mode = GhostMode.SCATTER;
      ghost.speed = GHOST_SPEED;
      ghost.modeTimer = 0;
      return true;
    }
  }
  return false;
}

/**
 * Get ghost speed based on mode
 */
export function getGhostSpeed(ghost: Ghost): number {
  switch (ghost.mode) {
    case GhostMode.FRIGHTENED:
      return GHOST_FRIGHTENED_SPEED;
    case GhostMode.EATEN:
      return GHOST_EATEN_SPEED;
    default:
      return GHOST_SPEED;
  }
}
