/**
 * Tests for ghost AI
 */

import {
  calculateTargetTile,
  updateGhostMode,
  frightenGhosts,
  eatGhost,
  checkGhostRespawn,
  getGhostSpeed,
} from '../ghostAI.js';
import {
  Ghost,
  GhostType,
  GhostMode,
  Player,
  Direction,
} from '../types.js';
import {
  GHOST_SPEED,
  GHOST_FRIGHTENED_SPEED,
  GHOST_EATEN_SPEED,
  GHOST_HOUSE_CENTER,
  GHOST_SPAWNS,
  GHOST_HOME_CORNERS,
} from '../constants.js';

describe('Ghost AI', () => {
  let testGhost: Ghost;
  let testPlayer: Player;

  beforeEach(() => {
    testGhost = {
      type: GhostType.BLINKY,
      position: { x: 10, y: 10 },
      direction: Direction.RIGHT,
      speed: GHOST_SPEED,
      mode: GhostMode.CHASE,
      targetTile: { x: 5, y: 5 },
      homeCorner: GHOST_HOME_CORNERS[GhostType.BLINKY],
      spawnPosition: GHOST_SPAWNS[GhostType.BLINKY],
      modeTimer: 0,
    };

    testPlayer = {
      position: { x: 15, y: 15 },
      direction: Direction.RIGHT,
      speed: 2,
      lives: 3,
      score: 0,
      powerUpActive: false,
      powerUpTimer: 0,
    };
  });

  describe('calculateTargetTile', () => {
    it('should target ghost house when eaten', () => {
      testGhost.mode = GhostMode.EATEN;
      const target = calculateTargetTile(testGhost, testPlayer);
      expect(target).toEqual(GHOST_HOUSE_CENTER);
    });

    it('should target home corner when scattering', () => {
      testGhost.mode = GhostMode.SCATTER;
      const target = calculateTargetTile(testGhost, testPlayer);
      expect(target).toEqual(testGhost.homeCorner);
    });

    it('should target player directly for Blinky in chase mode', () => {
      testGhost.type = GhostType.BLINKY;
      testGhost.mode = GhostMode.CHASE;
      const target = calculateTargetTile(testGhost, testPlayer);
      expect(target).toEqual(testPlayer.position);
    });

    it('should target ahead of player for Pinky', () => {
      testGhost.type = GhostType.PINKY;
      testGhost.mode = GhostMode.CHASE;
      testPlayer.direction = Direction.RIGHT;
      
      const target = calculateTargetTile(testGhost, testPlayer);
      
      // Should be 4 tiles ahead
      expect(target.x).toBeGreaterThan(testPlayer.position.x);
    });
  });

  describe('updateGhostMode', () => {
    it('should switch from scatter to chase after timer expires', () => {
      testGhost.mode = GhostMode.SCATTER;
      testGhost.modeTimer = 0;

      // Update with enough time to trigger switch
      updateGhostMode(testGhost, 10000, 1, 0);

      expect(testGhost.mode).toBe(GhostMode.CHASE);
    });

    it('should not change mode when frightened', () => {
      testGhost.mode = GhostMode.FRIGHTENED;
      const originalMode = testGhost.mode;

      updateGhostMode(testGhost, 10000, 1, 0);

      expect(testGhost.mode).toBe(originalMode);
    });
  });

  describe('frightenGhosts', () => {
    it('should set all ghosts to frightened mode', () => {
      const ghosts = [testGhost];
      frightenGhosts(ghosts, 6000);

      expect(testGhost.mode).toBe(GhostMode.FRIGHTENED);
    });

    it('should not frighten eaten ghosts', () => {
      testGhost.mode = GhostMode.EATEN;
      const ghosts = [testGhost];
      
      frightenGhosts(ghosts, 6000);

      expect(testGhost.mode).toBe(GhostMode.EATEN);
    });
  });

  describe('eatGhost', () => {
    it('should set ghost to eaten mode', () => {
      eatGhost(testGhost);

      expect(testGhost.mode).toBe(GhostMode.EATEN);
      expect(testGhost.speed).toBe(GHOST_EATEN_SPEED);
    });
  });

  describe('checkGhostRespawn', () => {
    it('should respawn ghost when reaching ghost house', () => {
      testGhost.mode = GhostMode.EATEN;
      testGhost.position = { ...GHOST_HOUSE_CENTER };

      const respawned = checkGhostRespawn(testGhost);

      expect(respawned).toBe(true);
      expect(testGhost.mode).toBe(GhostMode.SCATTER);
      expect(testGhost.speed).toBe(GHOST_SPEED);
    });

    it('should not respawn ghost when far from house', () => {
      testGhost.mode = GhostMode.EATEN;
      testGhost.position = { x: 0, y: 0 };

      const respawned = checkGhostRespawn(testGhost);

      expect(respawned).toBe(false);
      expect(testGhost.mode).toBe(GhostMode.EATEN);
    });
  });

  describe('getGhostSpeed', () => {
    it('should return correct speed for each mode', () => {
      testGhost.mode = GhostMode.CHASE;
      expect(getGhostSpeed(testGhost)).toBe(GHOST_SPEED);

      testGhost.mode = GhostMode.FRIGHTENED;
      expect(getGhostSpeed(testGhost)).toBe(GHOST_FRIGHTENED_SPEED);

      testGhost.mode = GhostMode.EATEN;
      expect(getGhostSpeed(testGhost)).toBe(GHOST_EATEN_SPEED);
    });
  });
});
