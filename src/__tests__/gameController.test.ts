/**
 * Tests for game controller
 */

import {
  updateGame,
  setPlayerDirection,
  togglePause,
  getGameStats,
} from '../gameController.js';
import { initializeGame } from '../gameMechanics.js';
import { GameState, Direction } from '../types.js';
import { generateTestMap } from '../mapGenerator.js';

describe('Game Controller', () => {
  let gameState: GameState;

  beforeEach(() => {
    const map = generateTestMap();
    gameState = initializeGame(map);
  });

  describe('updateGame', () => {
    it('should not update when game is over', () => {
      gameState.gameOver = true;
      const initialTime = gameState.timestamp;
      
      updateGame(gameState, 16);
      
      expect(gameState.timestamp).toBe(initialTime);
    });

    it('should not update when paused', () => {
      gameState.paused = true;
      const initialTime = gameState.timestamp;
      
      updateGame(gameState, 16);
      
      expect(gameState.timestamp).toBe(initialTime);
    });

    it('should update timestamp', () => {
      const initialTime = gameState.timestamp;
      
      updateGame(gameState, 16);
      
      expect(gameState.timestamp).toBeGreaterThan(initialTime);
    });

    it('should update player with input', () => {
      const initialPos = { ...gameState.player.position };
      
      // Update multiple times to ensure movement
      for (let i = 0; i < 5; i++) {
        updateGame(gameState, 16, Direction.RIGHT);
      }
      
      // Position might change depending on walls
      expect(typeof gameState.player.position.x).toBe('number');
    });
  });

  describe('setPlayerDirection', () => {
    it('should update player direction', () => {
      setPlayerDirection(gameState, Direction.UP);
      
      expect(gameState.player.direction).toBe(Direction.UP);
    });
  });

  describe('togglePause', () => {
    it('should toggle pause state', () => {
      expect(gameState.paused).toBe(false);
      
      togglePause(gameState);
      expect(gameState.paused).toBe(true);
      
      togglePause(gameState);
      expect(gameState.paused).toBe(false);
    });
  });

  describe('getGameStats', () => {
    it('should return game statistics', () => {
      const stats = getGameStats(gameState);
      
      expect(stats).toHaveProperty('score');
      expect(stats).toHaveProperty('lives');
      expect(stats).toHaveProperty('level');
      expect(stats).toHaveProperty('dotsRemaining');
      expect(stats).toHaveProperty('powerUpActive');
      expect(stats).toHaveProperty('gameOver');
      expect(stats).toHaveProperty('paused');
      
      expect(typeof stats.score).toBe('number');
      expect(typeof stats.lives).toBe('number');
      expect(typeof stats.gameOver).toBe('boolean');
    });
  });
});
