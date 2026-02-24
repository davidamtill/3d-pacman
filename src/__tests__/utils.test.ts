/**
 * Tests for utility functions
 */

import {
  manhattanDistance,
  euclideanDistance,
  positionsEqual,
  getNextPosition,
  isInBounds,
  getOppositeDirection,
  getDirectionTo,
} from '../utils.js';
import { Direction } from '../types.js';

describe('Utils', () => {
  describe('manhattanDistance', () => {
    it('should calculate correct distance', () => {
      expect(manhattanDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(7);
      expect(manhattanDistance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
      expect(manhattanDistance({ x: -1, y: -1 }, { x: 1, y: 1 })).toBe(4);
    });
  });

  describe('euclideanDistance', () => {
    it('should calculate correct distance', () => {
      expect(euclideanDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
      expect(euclideanDistance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
    });
  });

  describe('positionsEqual', () => {
    it('should correctly compare positions', () => {
      expect(positionsEqual({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
      expect(positionsEqual({ x: 1, y: 2 }, { x: 2, y: 1 })).toBe(false);
    });
  });

  describe('getNextPosition', () => {
    it('should return correct next position', () => {
      const pos = { x: 5, y: 5 };
      
      expect(getNextPosition(pos, Direction.UP)).toEqual({ x: 5, y: 4 });
      expect(getNextPosition(pos, Direction.DOWN)).toEqual({ x: 5, y: 6 });
      expect(getNextPosition(pos, Direction.LEFT)).toEqual({ x: 4, y: 5 });
      expect(getNextPosition(pos, Direction.RIGHT)).toEqual({ x: 6, y: 5 });
      expect(getNextPosition(pos, Direction.NONE)).toEqual({ x: 5, y: 5 });
    });
  });

  describe('isInBounds', () => {
    it('should correctly check bounds', () => {
      expect(isInBounds({ x: 5, y: 5 }, 10, 10)).toBe(true);
      expect(isInBounds({ x: 0, y: 0 }, 10, 10)).toBe(true);
      expect(isInBounds({ x: 9, y: 9 }, 10, 10)).toBe(true);
      expect(isInBounds({ x: 10, y: 5 }, 10, 10)).toBe(false);
      expect(isInBounds({ x: -1, y: 5 }, 10, 10)).toBe(false);
    });
  });

  describe('getOppositeDirection', () => {
    it('should return opposite directions', () => {
      expect(getOppositeDirection(Direction.UP)).toBe(Direction.DOWN);
      expect(getOppositeDirection(Direction.DOWN)).toBe(Direction.UP);
      expect(getOppositeDirection(Direction.LEFT)).toBe(Direction.RIGHT);
      expect(getOppositeDirection(Direction.RIGHT)).toBe(Direction.LEFT);
      expect(getOppositeDirection(Direction.NONE)).toBe(Direction.NONE);
    });
  });

  describe('getDirectionTo', () => {
    it('should return correct direction', () => {
      const from = { x: 5, y: 5 };
      
      expect(getDirectionTo(from, { x: 5, y: 2 })).toBe(Direction.UP);
      expect(getDirectionTo(from, { x: 5, y: 8 })).toBe(Direction.DOWN);
      expect(getDirectionTo(from, { x: 2, y: 5 })).toBe(Direction.LEFT);
      expect(getDirectionTo(from, { x: 8, y: 5 })).toBe(Direction.RIGHT);
    });
  });
});
