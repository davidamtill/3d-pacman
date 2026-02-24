import type { Cell, WorldPosition } from './types';

export class Maze {
  public readonly rows: number;
  public readonly cols: number;
  public readonly cellSize: number;
  public readonly grid: number[][];
  public readonly start: Cell;
  public readonly walkableCells: Cell[];

  private readonly halfWidth: number;
  private readonly halfHeight: number;

  constructor(rows = 21, cols = 21, cellSize = 1, rng: () => number = Math.random) {
    this.rows = Maze.ensureOdd(rows);
    this.cols = Maze.ensureOdd(cols);
    this.cellSize = cellSize;
    this.grid = Maze.generate(this.rows, this.cols, rng);
    this.walkableCells = [];

    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        if (this.grid[row][col] === 1) {
          this.walkableCells.push({ row, col });
        }
      }
    }

    this.start = this.walkableCells.find((cell) => cell.row === 1 && cell.col === 1) ?? this.walkableCells[0];

    this.halfWidth = (this.cols * this.cellSize) / 2;
    this.halfHeight = (this.rows * this.cellSize) / 2;
  }

  public isWalkableCell(row: number, col: number): boolean {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return false;
    }

    return this.grid[row][col] === 1;
  }

  public cellToWorld(cell: Cell): WorldPosition {
    const x = cell.col * this.cellSize - this.halfWidth + this.cellSize / 2;
    const z = cell.row * this.cellSize - this.halfHeight + this.cellSize / 2;
    return { x, z };
  }

  public worldToCell(position: WorldPosition): Cell {
    const col = Math.floor((position.x + this.halfWidth) / this.cellSize);
    const row = Math.floor((position.z + this.halfHeight) / this.cellSize);

    return {
      row: Maze.clamp(row, 0, this.rows - 1),
      col: Maze.clamp(col, 0, this.cols - 1),
    };
  }

  public isWalkableWorld(position: WorldPosition): boolean {
    const cell = this.worldToCell(position);
    return this.isWalkableCell(cell.row, cell.col);
  }

  public canOccupy(position: WorldPosition, radius: number): boolean {
    if (radius <= 0) {
      return this.isWalkableWorld(position);
    }

    const sampleAngles = [0, 90, 180, 270, 45, 135, 225, 315];

    return sampleAngles.every((angle) => {
      const radians = (angle * Math.PI) / 180;
      const sample: WorldPosition = {
        x: position.x + Math.cos(radians) * radius,
        z: position.z + Math.sin(radians) * radius,
      };

      return this.isWalkableWorld(sample);
    });
  }

  private static ensureOdd(value: number): number {
    return value % 2 === 0 ? value + 1 : value;
  }

  private static generate(rows: number, cols: number, rng: () => number): number[][] {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    const start: Cell = { row: 1, col: 1 };

    grid[start.row][start.col] = 1;
    const stack: Cell[] = [start];

    const directions: Cell[] = [
      { row: -2, col: 0 },
      { row: 2, col: 0 },
      { row: 0, col: -2 },
      { row: 0, col: 2 },
    ];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = directions
        .map((dir) => ({ row: current.row + dir.row, col: current.col + dir.col }))
        .filter((cell) => Maze.isWithinBounds(cell, rows, cols) && grid[cell.row][cell.col] === 0);

      if (neighbors.length === 0) {
        stack.pop();
        continue;
      }

      const next = neighbors[Math.floor(rng() * neighbors.length)];
      const wallRow = current.row + (next.row - current.row) / 2;
      const wallCol = current.col + (next.col - current.col) / 2;

      grid[wallRow][wallCol] = 1;
      grid[next.row][next.col] = 1;

      stack.push(next);
    }

    return grid;
  }

  private static isWithinBounds(cell: Cell, rows: number, cols: number): boolean {
    return cell.row > 0 && cell.row < rows && cell.col > 0 && cell.col < cols;
  }

  private static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
