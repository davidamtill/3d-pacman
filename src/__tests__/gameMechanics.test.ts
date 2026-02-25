/**
 * Tests for game mechanics
 */

import {
  handlePlayerDeath,
  respawnPlayer,
  collectDot,
  collectPowerPellet,
  activatePowerUp,
  updatePowerUp,
  handleGhostEaten,
  initializeGame,
} from '../gameMechanics.js';
import {
  GameState,
  TileType,
  GhostMode,
} from '../types.js';
import {
  INITIAL_LIVES,
  POWER_UP_DURATION,
  POINTS_DOT,
  POINTS_POWER_PELLET,
  POINTS_GHOST,
  PLAYER_SPAWN,
} from '../constants.js';
import { generateTestMap } from '../mapGenerator.js';

describe('Game Mechanics', () => {
  let gameState: GameState;

  beforeEach(() => {
    const map = generateTestMap();
    gameState = initializeGame(map);
  });

  describe('handlePlayerDeath', () => {
    it('should decrease lives', () => {
      const initialLives = gameState.player.lives;
      handlePlayerDeath(gameState);
      
      expect(gameState.player.lives).toBe(initialLives - 1);
    });

    it('should set game over when lives reach 0', () => {
      gameState.player.lives = 1;
      handlePlayerDeath(gameState);
      
      expect(gameState.gameOver).toBe(true);
    });

    it('should respawn player at spawn point', () => {
      handlePlayerDeath(gameState);
      
      expect(gameState.player.position).toEqual(PLAYER_SPAWN);
    });
  });

  describe('respawnPlayer', () => {
    it('should reset player position and power-up', () => {
      gameState.player.position = { x: 20, y: 20 };
      gameState.player.powerUpActive = true;
      
      respawnPlayer(gameState.player);
      
      expect(gameState.player.position).toEqual(PLAYER_SPAWN);
      expect(gameState.player.powerUpActive).toBe(false);
    });
  });

  describe('collectDot', () => {
    it('should award points and remove dot', () => {
      // Find a dot position
      let dotPos = { x: 5, y: 5 };
      for (let y = 0; y < gameState.map.length; y++) {
        for (let x = 0; x < gameState.map[y].length; x++) {
          if (gameState.map[y][x] === TileType.DOT) {
            dotPos = { x, y };
            break;
          }
        }
      }
      
      const initialScore = gameState.player.score;
      const initialDots = gameState.dotsRemaining;
      
      collectDot(gameState, dotPos);
      
      expect(gameState.player.score).toBe(initialScore + POINTS_DOT);
      expect(gameState.dotsRemaining).toBe(initialDots - 1);
      expect(gameState.map[dotPos.y][dotPos.x]).toBe(TileType.EMPTY);
    });
  });

  describe('collectPowerPellet', () => {
    it('should award points and activate power-up', () => {
      // Find a power pellet position
      let pelletPos = { x: 1, y: 1 };
      for (let y = 0; y < gameState.map.length; y++) {
        for (let x = 0; x < gameState.map[y].length; x++) {
          if (gameState.map[y][x] === TileType.POWER_PELLET) {
            pelletPos = { x, y };
            break;
          }
        }
      }
      
      const initialScore = gameState.player.score;
      
      collectPowerPellet(gameState, pelletPos);
      
      expect(gameState.player.score).toBe(initialScore + POINTS_POWER_PELLET);
      expect(gameState.player.powerUpActive).toBe(true);
    });
  });

  describe('activatePowerUp', () => {
    it('should frighten all ghosts', () => {
      activatePowerUp(gameState);
      
      expect(gameState.player.powerUpActive).toBe(true);
      
      for (const ghost of gameState.ghosts) {
        expect(ghost.mode).toBe(GhostMode.FRIGHTENED);
      }
    });
  });

  describe('updatePowerUp', () => {
    it('should decrease power-up timer', () => {
      gameState.player.powerUpActive = true;
      gameState.player.powerUpTimer = 1000;
      
      updatePowerUp(gameState, 500);
      
      expect(gameState.player.powerUpTimer).toBe(500);
    });

    it('should deactivate power-up when timer expires', () => {
      gameState.player.powerUpActive = true;
      gameState.player.powerUpTimer = 100;
      
      updatePowerUp(gameState, 200);
      
      expect(gameState.player.powerUpActive).toBe(false);
    });
  });

  describe('handleGhostEaten', () => {
    it('should award points when eating frightened ghost', () => {
      const ghost = gameState.ghosts[0];
      ghost.mode = GhostMode.FRIGHTENED;
      
      const initialScore = gameState.player.score;
      
      handleGhostEaten(gameState, ghost);
      
      expect(gameState.player.score).toBeGreaterThan(initialScore);
      expect(ghost.mode).toBe(GhostMode.EATEN);
    });

    it('should not award points for non-frightened ghost', () => {
      const ghost = gameState.ghosts[0];
      ghost.mode = GhostMode.CHASE;
      
      const initialScore = gameState.player.score;
      
      handleGhostEaten(gameState, ghost);
      
      expect(gameState.player.score).toBe(initialScore);
    });
  });

  describe('initializeGame', () => {
    it('should create valid game state', () => {
      expect(gameState.player.lives).toBe(INITIAL_LIVES);
      expect(gameState.player.score).toBe(0);
      expect(gameState.ghosts.length).toBe(4);
      expect(gameState.level).toBe(1);
      expect(gameState.gameOver).toBe(false);
    });
  });
});
