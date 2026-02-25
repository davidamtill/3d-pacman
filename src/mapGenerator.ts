/**
 * Simple map generator for testing
 */

import { TileType } from './types.js';
import { MAP_WIDTH, MAP_HEIGHT } from './constants.js';

/**
 * Generate a simple test map
 */
export function generateTestMap(): TileType[][] {
  const map: TileType[][] = [];

  // Create a simple maze for testing
  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      // Borders are walls
      if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        row.push(TileType.WALL);
      }
      // Ghost house area
      else if (x >= 12 && x <= 16 && y >= 13 && y <= 15) {
        row.push(TileType.GHOST_HOUSE);
      }
      // Power pellets in corners
      else if (
        (x === 1 && y === 1) ||
        (x === MAP_WIDTH - 2 && y === 1) ||
        (x === 1 && y === MAP_HEIGHT - 2) ||
        (x === MAP_WIDTH - 2 && y === MAP_HEIGHT - 2)
      ) {
        row.push(TileType.POWER_PELLET);
      }
      // Some walls for structure
      else if (
        (x % 4 === 0 && y % 4 === 0 && x > 4 && x < MAP_WIDTH - 4 && y > 4 && y < MAP_HEIGHT - 4) ||
        (x === MAP_WIDTH / 2 && (y < 10 || y > 20))
      ) {
        row.push(TileType.WALL);
      }
      // Everything else is dots
      else {
        row.push(TileType.DOT);
      }
    }
    map.push(row);
  }

  return map;
}

/**
 * Generate classic Pac-Man style maze
 */
export function generateClassicMap(): TileType[][] {
  // This is a simplified representation
  // In a real implementation, you'd load this from a file
  const template = [
    '############################',
    '#............##............#',
    '#.####.#####.##.#####.####.#',
    '#O####.#####.##.#####.####O#',
    '#.####.#####.##.#####.####.#',
    '#..........................#',
    '#.####.##.########.##.####.#',
    '#.####.##.########.##.####.#',
    '#......##....##....##......#',
    '######.##### ## #####.######',
    '     #.##### ## #####.#     ',
    '     #.##          ##.#     ',
    '     #.## ###==### ##.#     ',
    '######.## #HHHHHH# ##.######',
    '      .   #HHHHHH#   .      ',
    '######.## #HHHHHH# ##.######',
    '     #.## ######## ##.#     ',
    '     #.##          ##.#     ',
    '     #.## ######## ##.#     ',
    '######.## ######## ##.######',
    '#............##............#',
    '#.####.#####.##.#####.####.#',
    '#.####.#####.##.#####.####.#',
    '#O..##................##..O#',
    '###.##.##.########.##.##.###',
    '###.##.##.########.##.##.###',
    '#......##....##....##......#',
    '#.##########.##.##########.#',
    '#.##########.##.##########.#',
    '#..........................#',
    '############################',
  ];

  const map: TileType[][] = [];

  for (let y = 0; y < template.length; y++) {
    const row: TileType[] = [];
    const line = template[y];

    for (let x = 0; x < line.length; x++) {
      const char = line[x];

      switch (char) {
        case '#':
          row.push(TileType.WALL);
          break;
        case 'O':
          row.push(TileType.POWER_PELLET);
          break;
        case 'H':
          row.push(TileType.GHOST_HOUSE);
          break;
        case '=':
        case ' ':
          row.push(TileType.EMPTY);
          break;
        case '.':
        default:
          row.push(TileType.DOT);
          break;
      }
    }

    map.push(row);
  }

  return map;
}

/**
 * Create an empty map
 */
export function createEmptyMap(width: number, height: number): TileType[][] {
  const map: TileType[][] = [];
  for (let y = 0; y < height; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < width; x++) {
      row.push(TileType.EMPTY);
    }
    map.push(row);
  }
  return map;
}

/**
 * Clone a map
 */
export function cloneMap(map: TileType[][]): TileType[][] {
  return map.map((row) => [...row]);
}

/**
 * Print map to console (for debugging)
 */
export function printMap(map: TileType[][]): void {
  const symbols: Record<TileType, string> = {
    [TileType.EMPTY]: ' ',
    [TileType.WALL]: '#',
    [TileType.DOT]: '.',
    [TileType.POWER_PELLET]: 'O',
    [TileType.GHOST_HOUSE]: 'H',
  };

  for (const row of map) {
    console.log(row.map((tile) => symbols[tile] || '?').join(''));
  }
}
