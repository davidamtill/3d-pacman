import * as THREE from 'three';

import type { Cell, WorldPosition } from './types';
import { Maze } from './Maze';

export class PelletField {
  public readonly group = new THREE.Group();
  public readonly totalPellets: number;

  private readonly pelletGeometry = new THREE.SphereGeometry(0.12, 12, 12);
  private readonly pelletMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x6666aa });
  private readonly pellets = new Map<string, THREE.Mesh>();
  private collected = 0;

  constructor(private readonly maze: Maze, excluded: Cell[] = []) {
    const excludedKeys = new Set(excluded.map((cell) => this.getKey(cell)));

    for (const cell of this.maze.walkableCells) {
      const key = this.getKey(cell);
      if (excludedKeys.has(key)) {
        continue;
      }

      const pellet = new THREE.Mesh(this.pelletGeometry, this.pelletMaterial);
      const position = this.maze.cellToWorld(cell);

      pellet.position.set(position.x, 0.2, position.z);
      pellet.castShadow = false;
      pellet.receiveShadow = false;

      this.group.add(pellet);
      this.pellets.set(key, pellet);
    }

    this.totalPellets = this.pellets.size;
  }

  public tryCollect(position: WorldPosition): boolean {
    const cell = this.maze.worldToCell(position);
    const key = this.getKey(cell);
    const pellet = this.pellets.get(key);

    if (!pellet) {
      return false;
    }

    this.group.remove(pellet);
    this.pellets.delete(key);
    this.collected += 1;

    return true;
  }

  public getRemaining(): number {
    return this.pellets.size;
  }

  public getCollected(): number {
    return this.collected;
  }

  private getKey(cell: Cell): string {
    return `${cell.row}:${cell.col}`;
  }
}
