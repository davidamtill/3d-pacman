/**
 * A* pathfinding algorithm for ghost AI
 */

import { Position, TileType, PathNode, Direction } from './types.js';
import {
  manhattanDistance,
  positionsEqual,
  getNextPosition,
  isInBounds,
} from './utils.js';
import { checkWallCollision } from './collision.js';
import { MAP_WIDTH, MAP_HEIGHT, DIRECTION_VECTORS } from './constants.js';

/**
 * A* pathfinding to find optimal path to target
 */
export function findPath(
  start: Position,
  goal: Position,
  map: TileType[][]
): Position[] {
  const startNode: PathNode = {
    position: start,
    g: 0,
    h: manhattanDistance(start, goal),
    f: manhattanDistance(start, goal),
    parent: null,
  };

  const openList: PathNode[] = [startNode];
  const closedList: Set<string> = new Set();

  while (openList.length > 0) {
    // Find node with lowest f score
    let currentIndex = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < openList[currentIndex].f) {
        currentIndex = i;
      }
    }

    const current = openList[currentIndex];

    // Goal reached
    if (positionsEqual(current.position, goal)) {
      return reconstructPath(current);
    }

    // Move current from open to closed
    openList.splice(currentIndex, 1);
    closedList.add(positionKey(current.position));

    // Check all neighbors
    const neighbors = getNeighbors(current.position, map);

    for (const neighborPos of neighbors) {
      const key = positionKey(neighborPos);

      // Skip if already evaluated
      if (closedList.has(key)) {
        continue;
      }

      const g = current.g + 1;
      const h = manhattanDistance(neighborPos, goal);
      const f = g + h;

      // Check if neighbor is in open list
      const existingIndex = openList.findIndex((node) =>
        positionsEqual(node.position, neighborPos)
      );

      if (existingIndex === -1) {
        // Add new node
        openList.push({
          position: neighborPos,
          g,
          h,
          f,
          parent: current,
        });
      } else if (g < openList[existingIndex].g) {
        // Update existing node with better path
        openList[existingIndex].g = g;
        openList[existingIndex].f = f;
        openList[existingIndex].parent = current;
      }
    }
  }

  // No path found
  return [];
}

/**
 * Get valid neighbor positions (not walls)
 */
function getNeighbors(pos: Position, map: TileType[][]): Position[] {
  const neighbors: Position[] = [];
  const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
  const mapWidth = map[0]?.length || MAP_WIDTH;
  const mapHeight = map.length || MAP_HEIGHT;

  for (const dir of directions) {
    const nextPos = getNextPosition(pos, dir);
    
    // Wrap around edges (tunnel effect)
    if (nextPos.x < 0) nextPos.x = mapWidth - 1;
    if (nextPos.x >= mapWidth) nextPos.x = 0;
    if (nextPos.y < 0) nextPos.y = mapHeight - 1;
    if (nextPos.y >= mapHeight) nextPos.y = 0;

    if (!checkWallCollision(nextPos, map)) {
      neighbors.push(nextPos);
    }
  }

  return neighbors;
}

/**
 * Reconstruct path from goal to start
 */
function reconstructPath(node: PathNode): Position[] {
  const path: Position[] = [];
  let current: PathNode | null = node;

  while (current !== null) {
    path.unshift(current.position);
    current = current.parent;
  }

  return path;
}

/**
 * Create unique key for position
 */
function positionKey(pos: Position): string {
  return `${Math.floor(pos.x)},${Math.floor(pos.y)}`;
}

/**
 * Get the best direction to move toward a target
 * (Simpler alternative to full pathfinding for performance)
 */
export function getDirectionToTarget(
  from: Position,
  to: Position,
  map: TileType[][]
): Direction {
  const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
  let bestDirection = Direction.NONE;
  let bestDistance = Infinity;

  for (const dir of directions) {
    const nextPos = getNextPosition(from, dir);
    
    if (!checkWallCollision(nextPos, map)) {
      const distance = manhattanDistance(nextPos, to);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestDirection = dir;
      }
    }
  }

  return bestDirection;
}

/**
 * Get next tile position in path (returns the immediate next step)
 */
export function getNextTileInPath(
  start: Position,
  goal: Position,
  map: TileType[][]
): Position | null {
  const path = findPath(start, goal, map);
  
  // Return the second position in path (first is current position)
  if (path.length > 1) {
    return path[1];
  }
  
  return null;
}
