import * as THREE from 'three';

import { Maze } from '../game/Maze';

export class MazeRenderer {
  public readonly group = new THREE.Group();

  constructor(private readonly maze: Maze) {
    this.group.name = 'maze';
    this.buildFloor();
    this.buildWalls();
  }

  private buildFloor(): void {
    const geometry = new THREE.PlaneGeometry(this.maze.cols * this.maze.cellSize, this.maze.rows * this.maze.cellSize);
    const material = new THREE.MeshStandardMaterial({ color: 0x0b132b, metalness: 0.1, roughness: 0.8 });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);
  }

  private buildWalls(): void {
    const wallHeight = 1.2;
    const geometry = new THREE.BoxGeometry(this.maze.cellSize, wallHeight, this.maze.cellSize);
    const material = new THREE.MeshStandardMaterial({ color: 0x1c2541, metalness: 0.2, roughness: 0.6 });

    for (let row = 0; row < this.maze.rows; row += 1) {
      for (let col = 0; col < this.maze.cols; col += 1) {
        if (this.maze.isWalkableCell(row, col)) {
          continue;
        }

        const mesh = new THREE.Mesh(geometry, material);
        const position = this.maze.cellToWorld({ row, col });
        mesh.position.set(position.x, wallHeight / 2, position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.group.add(mesh);
      }
    }
  }
}
