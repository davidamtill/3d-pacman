# Pac-Man Ghost AI & Game Engine

A comprehensive TypeScript implementation of Pac-Man game mechanics featuring:
- 🤖 Advanced ghost AI with unique personalities (Blinky, Pinky, Inky, Clyde)
- 💥 Collision detection system
- 🎮 Game rules (lives, respawn, scoring, power-ups)
- 🧪 Comprehensive test suite
- 🏗️ Modular, extensible architecture

## Features

### Ghost AI Behaviors

Each ghost has a unique personality and targeting strategy:

- **Blinky (Red)** - The Chaser
  - Directly targets Pac-Man's current position
  - Most aggressive pursuer
  
- **Pinky (Pink)** - The Ambusher
  - Targets 4 tiles ahead of Pac-Man
  - Tries to cut off Pac-Man's path
  
- **Inky (Cyan)** - The Unpredictable
  - Uses complex vector calculation involving Blinky's position
  - Creates flanking maneuvers
  
- **Clyde (Orange)** - The Random
  - Chases when far from Pac-Man (> 8 tiles)
  - Retreats to home corner when close
  - Creates unpredictable behavior

### Game Modes

Ghosts alternate between different behavioral modes:

1. **Scatter Mode** - Ghosts retreat to their home corners
2. **Chase Mode** - Ghosts actively pursue Pac-Man using unique strategies
3. **Frightened Mode** - Ghosts move randomly and can be eaten (triggered by power pellet)
4. **Eaten Mode** - Ghosts return to ghost house at high speed after being eaten

### Collision Detection

- Wall collision detection
- Ghost-player collision with configurable threshold
- Dot and power pellet collection
- Comprehensive collision result system

### Game Mechanics

- **Lives System** - Start with 3 lives, respawn on death
- **Scoring** - Points for dots (10), power pellets (50), and ghosts (200-1600)
- **Power-Ups** - 6-second invincibility with frightened ghosts
- **Level Progression** - Advance when all dots collected
- **Extra Lives** - Awarded at score thresholds

## Project Structure

```
src/
├── types.ts              # Core type definitions
├── constants.ts          # Game constants and configuration
├── utils.ts              # Utility functions (distance, direction, etc.)
├── collision.ts          # Collision detection system
├── pathfinding.ts        # A* pathfinding algorithm
├── ghostAI.ts            # Ghost AI behaviors and modes
├── gameMechanics.ts      # Lives, scoring, power-ups
├── gameController.ts     # Main game loop integration
├── mapGenerator.ts       # Map creation utilities
├── index.ts              # Public API exports
└── __tests__/            # Comprehensive test suite
    ├── utils.test.ts
    ├── collision.test.ts
    ├── ghostAI.test.ts
    ├── gameMechanics.test.ts
    ├── pathfinding.test.ts
    └── gameController.test.ts
```

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Usage

### Basic Game Setup

```typescript
import {
  initializeGame,
  updateGame,
  setPlayerDirection,
  getGameStats,
  Direction,
  generateTestMap,
} from './index.js';

// Create a game map
const map = generateTestMap();

// Initialize game state
const gameState = initializeGame(map);

// Game loop (typically 60 FPS)
function gameLoop() {
  const deltaTime = 16; // milliseconds (60 FPS)
  
  // Update with player input
  updateGame(gameState, deltaTime, Direction.RIGHT);
  
  // Get current game stats
  const stats = getGameStats(gameState);
  console.log(`Score: ${stats.score}, Lives: ${stats.lives}`);
  
  if (!gameState.gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

gameLoop();
```

### Manual Control

```typescript
// Set player direction
setPlayerDirection(gameState, Direction.UP);

// Pause/unpause
togglePause(gameState);

// Check collisions manually
import { checkCollisions } from './collision.js';
const collision = checkCollisions(
  gameState.player,
  gameState.ghosts,
  gameState.map
);

if (collision.collided && collision.type === 'ghost') {
  console.log('Ghost collision!');
}
```

### Custom Ghost AI

```typescript
import {
  calculateTargetTile,
  updateGhostAI,
  frightenGhosts,
} from './ghostAI.js';

// Update a single ghost
const ghost = gameState.ghosts[0];
const direction = updateGhostAI(
  ghost,
  gameState.player,
  gameState.map
);

// Frighten all ghosts (power-up)
frightenGhosts(gameState.ghosts, 6000); // 6 seconds
```

### Pathfinding

```typescript
import { findPath, getDirectionToTarget } from './pathfinding.js';

// Find full path using A*
const path = findPath(
  { x: 5, y: 5 },
  { x: 20, y: 20 },
  gameState.map
);

// Get immediate best direction
const direction = getDirectionToTarget(
  ghostPosition,
  targetPosition,
  gameState.map
);
```

## Architecture

### Type Safety

Full TypeScript implementation with comprehensive type definitions for:
- Game state and entities
- Directions and positions
- Collision results
- Ghost modes and types

### Modularity

Each system is isolated and can be used independently:
- Use collision detection without AI
- Use pathfinding for custom entities
- Extend ghost behaviors without modifying core code

### Performance

- Efficient A* pathfinding with Manhattan distance heuristic
- Optimized collision detection with early exits
- Mode timing system to reduce unnecessary AI updates

### Testing

Comprehensive test coverage including:
- Unit tests for all utility functions
- Integration tests for game mechanics
- AI behavior verification
- Edge case handling

## Constants Configuration

Modify game behavior through constants:

```typescript
// In src/constants.ts
export const PLAYER_SPEED = 2;
export const GHOST_SPEED = 1.8;
export const POWER_UP_DURATION = 6000;
export const INITIAL_LIVES = 3;

// Mode timings (scatter/chase alternation)
export const MODE_TIMINGS = [
  { scatter: 7000, chase: 20000 },
  { scatter: 7000, chase: 20000 },
  { scatter: 5000, chase: 20000 },
  { scatter: 5000, chase: -1 },  // -1 = infinite
];
```

## Integration Examples

### Canvas Rendering

```typescript
function render(ctx: CanvasRenderingContext2D, gameState: GameState) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Render map
  gameState.map.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === TileType.WALL) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x * 8, y * 8, 8, 8);
      } else if (tile === TileType.DOT) {
        ctx.fillStyle = 'white';
        ctx.fillRect(x * 8 + 3, y * 8 + 3, 2, 2);
      }
    });
  });
  
  // Render player
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(
    gameState.player.position.x * 8,
    gameState.player.position.y * 8,
    6,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Render ghosts
  gameState.ghosts.forEach(ghost => {
    const colors = {
      BLINKY: 'red',
      PINKY: 'pink',
      INKY: 'cyan',
      CLYDE: 'orange',
    };
    
    ctx.fillStyle = ghost.mode === GhostMode.FRIGHTENED 
      ? 'blue' 
      : colors[ghost.type];
      
    ctx.fillRect(
      ghost.position.x * 8 - 4,
      ghost.position.y * 8 - 4,
      8,
      8
    );
  });
}
```

### Input Handling

```typescript
document.addEventListener('keydown', (e) => {
  const keyMap: Record<string, Direction> = {
    ArrowUp: Direction.UP,
    ArrowDown: Direction.DOWN,
    ArrowLeft: Direction.LEFT,
    ArrowRight: Direction.RIGHT,
  };
  
  const direction = keyMap[e.key];
  if (direction) {
    setPlayerDirection(gameState, direction);
  }
  
  if (e.key === ' ') {
    togglePause(gameState);
  }
});
```

## Advanced Features

### Custom Map Loading

```typescript
import { TileType } from './types.js';

function loadMapFromString(mapString: string): TileType[][] {
  const lines = mapString.trim().split('\n');
  return lines.map(line => 
    line.split('').map(char => {
      switch (char) {
        case '#': return TileType.WALL;
        case '.': return TileType.DOT;
        case 'O': return TileType.POWER_PELLET;
        case 'H': return TileType.GHOST_HOUSE;
        default: return TileType.EMPTY;
      }
    })
  );
}
```

### Event System

```typescript
// Add custom event handling
function updateGameWithEvents(gameState: GameState, deltaTime: number) {
  const prevScore = gameState.player.score;
  const prevLives = gameState.player.lives;
  
  updateGame(gameState, deltaTime);
  
  // Emit events
  if (gameState.player.score > prevScore) {
    emit('score-changed', gameState.player.score);
  }
  
  if (gameState.player.lives < prevLives) {
    emit('player-died', gameState.player.lives);
  }
  
  if (gameState.player.powerUpActive) {
    emit('power-up-active', gameState.player.powerUpTimer);
  }
}
```

## Contributing

This implementation follows clean code principles:
- Single Responsibility Principle
- Clear separation of concerns
- Comprehensive documentation
- Type safety throughout

To extend the system:
1. Add new ghost types in `types.ts`
2. Implement targeting logic in `ghostAI.ts`
3. Add tests in `__tests__/`
4. Update constants as needed

## License

MIT

## Credits

Implementation based on classic Pac-Man AI behaviors with modern TypeScript architecture.
