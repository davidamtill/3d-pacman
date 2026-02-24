import * as THREE from 'three';

import type { DirectionVector } from '../input/InputController';
import type { WorldPosition } from './types';
import { Maze } from './Maze';

export class Player {
  public readonly mesh: THREE.Mesh;
  public readonly radius = 0.28;
  private readonly speed = 3.25;
  private readonly position = new THREE.Vector3();

  constructor(start: WorldPosition, private readonly maze: Maze) {
    const geometry = new THREE.SphereGeometry(0.35, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0x332200 });
    this.mesh = new THREE.Mesh(geometry, material);

    this.position.set(start.x, 0.35, start.z);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
  }

  public update(deltaTime: number, direction: DirectionVector): void {
    if (direction.x === 0 && direction.z === 0) {
      return;
    }

    const movement = new THREE.Vector3(direction.x, 0, direction.z)
      .normalize()
      .multiplyScalar(this.speed * deltaTime);

    const nextPosition = this.position.clone().add(movement);

    if (this.maze.canOccupy({ x: nextPosition.x, z: nextPosition.z }, this.radius)) {
      this.position.copy(nextPosition);
      this.mesh.position.copy(this.position);
    }
  }

  public getPosition(): WorldPosition {
    return { x: this.position.x, z: this.position.z };
  }

  public respawn(position: WorldPosition): void {
    this.position.set(position.x, 0.35, position.z);
    this.mesh.position.copy(this.position);
  }
}
