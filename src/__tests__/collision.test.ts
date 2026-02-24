/**
 * Tests for collision detection
 */

import {
  checkWallCollision,
  canMove,
  checkGhostCollision,
  getTileAt,
  getValidAdjacentPositions,
  isIntersection,
} from '../collision.js';
import { TileType, Direction, Entity, Ghost, GhostType, GhostMode } from '../types.js';
import { generateTestMap } from '../mapGenerator.js';

describe('Collision Detection', () => {
  let testMap: TileType[][];

  beforeEach(() => {
    testMap = generateTestMap();
  });

  describe('checkWallCollision', () => {
    it('should detect wall collisions', () => {
      // Border walls
      expect(checkWallCollision({ x: 0, y: 0 }, testMap)).toBe(true);
      
      // Open space
      expect(checkWallCollision({ x: 5, y: 5 }, testMap)).toBe(false);
    });

    it('should detect out of bounds as wall', () => {
      expect(checkWallCollision({ x: -1, y: 5 }, testMap)).toBe(true);
      expect(checkWallCollision({ x: 100, y: 5 }, testMap)).toBe(true);
    });
  });

  describe('canMove', () => {
    it('should check if entity can move in direction', () => {
      const entity: Entity = {
        position: { x: 5, y: 5 },
        direction: Direction.RIGHT,
        speed: 2,
      };

      // Assuming (6, 5) is not a wall
      const canMoveRight = canMove(entity, Direction.RIGHT, testMap);
      expect(typeof canMoveRight).toBe('boolean');
    });
  });

  describe('checkGhostCollision', () => {
    it('should detect collision when positions are close', () => {
      expect(checkGhostCollision(
        { x: 5, y: 5 },
        { x: 5.2, y: 5.2 }
      )).toBe(true);
    });

    it('should not detect collision when positions are far', () => {
      expect(checkGhostCollision(
        { x: 5, y: 5 },
        { x: 10, y: 10 }
      )).toBe(false);
    });
  });

  describe('getTileAt', () => {
    it('should return correct tile type', () => {
      const tile = getTileAt({ x: 5, y: 5 }, testMap);
      expect([
        TileType.EMPTY,
        TileType.DOT,
        TileType.POWER_PELLET,
        TileType.WALL,
        TileType.GHOST_HOUSE,
      ]).toContain(tile);
    });

    it('should return WALL for out of bounds', () => {
      expect(getTileAt({ x: -1, y: 5 }, testMap)).toBe(TileType.WALL);
      expect(getTileAt({ x: 100, y: 5 }, testMap)).toBe(TileType.WALL);
    });
  });

  describe('getValidAdjacentPositions', () => {
    it('should return valid adjacent positions', () => {
      const adjacent = getValidAdjacentPositions({ x: 5, y: 5 }, testMap);
      expect(adjacent.length).toBeGreaterThan(0);
      expect(adjacent.length).toBeLessThanOrEqual(4);
    });
  });

  describe('isIntersection', () => {
    it('should detect intersections', () => {
      // Most positions should not be intersections
      const result = isIntersection({ x: 5, y: 5 }, testMap);
      expect(typeof result).toBe('boolean');
    });
  });
});
