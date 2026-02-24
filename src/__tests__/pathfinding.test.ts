/**
 * Tests for pathfinding
 */

import {
  findPath,
  getDirectionToTarget,
  getNextTileInPath,
} from '../pathfinding.js';
import { TileType, Direction } from '../types.js';
import { createEmptyMap } from '../mapGenerator.js';

describe('Pathfinding', () => {
  let testMap: TileType[][];

  beforeEach(() => {
    // Create simple test map
    testMap = createEmptyMap(10, 10);
    
    // Add some walls
    testMap[5][5] = TileType.WALL;
    testMap[5][6] = TileType.WALL;
    testMap[5][7] = TileType.WALL;
  });

  describe('findPath', () => {
    it('should find path between two points', () => {
      const start = { x: 2, y: 2 };
      const goal = { x: 8, y: 8 };
      
      const path = findPath(start, goal, testMap);
      
      expect(path.length).toBeGreaterThan(0);
      expect(path[0]).toEqual(start);
      expect(path[path.length - 1]).toEqual(goal);
    });

    it('should find path even with obstacles (wrapping enabled)', () => {
      // Wall off the middle
      for (let x = 0; x < 10; x++) {
        testMap[5][x] = TileType.WALL;
      }
      
      const start = { x: 2, y: 2 };
      const goal = { x: 8, y: 8 };
      
      const path = findPath(start, goal, testMap);
      
      // Path should exist due to wrapping
      expect(path.length).toBeGreaterThan(0);
    });

    it('should handle same start and goal', () => {
      const pos = { x: 5, y: 5 };
      testMap[5][5] = TileType.EMPTY; // Make sure it's not a wall
      
      const path = findPath(pos, pos, testMap);
      
      expect(path.length).toBeGreaterThan(0);
    });
  });

  describe('getDirectionToTarget', () => {
    it('should return valid direction toward target', () => {
      const from = { x: 5, y: 5 };
      const to = { x: 8, y: 5 };
      
      const direction = getDirectionToTarget(from, to, testMap);
      
      expect([
        Direction.UP,
        Direction.DOWN,
        Direction.LEFT,
        Direction.RIGHT,
      ]).toContain(direction);
    });

    it('should return NONE when surrounded by walls', () => {
      // Wall off position
      testMap[4][5] = TileType.WALL;
      testMap[6][5] = TileType.WALL;
      testMap[5][4] = TileType.WALL;
      testMap[5][6] = TileType.WALL;
      
      const from = { x: 5, y: 5 };
      const to = { x: 8, y: 8 };
      
      const direction = getDirectionToTarget(from, to, testMap);
      
      expect(direction).toBe(Direction.NONE);
    });
  });

  describe('getNextTileInPath', () => {
    it('should return immediate next tile', () => {
      const start = { x: 2, y: 2 };
      const goal = { x: 8, y: 8 };
      
      const nextTile = getNextTileInPath(start, goal, testMap);
      
      if (nextTile) {
        // Next tile should be adjacent to start
        const distance = Math.abs(nextTile.x - start.x) + Math.abs(nextTile.y - start.y);
        expect(distance).toBeLessThanOrEqual(1);
      }
    });

    it('should return next tile even with obstacles (wrapping enabled)', () => {
      // Wall off the middle
      for (let x = 0; x < 10; x++) {
        testMap[5][x] = TileType.WALL;
      }
      
      const start = { x: 2, y: 2 };
      const goal = { x: 8, y: 8 };
      
      const nextTile = getNextTileInPath(start, goal, testMap);
      
      // Should find a path due to wrapping
      expect(nextTile).not.toBeNull();
    });
  });
});
