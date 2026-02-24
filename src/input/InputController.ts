export type DirectionVector = {
  x: number;
  z: number;
};

export class InputController {
  private readonly keys = new Set<string>();
  private direction: DirectionVector = { x: 0, z: 0 };
  private readonly target: Window & typeof globalThis;
  private readonly handleKeyDown = (event: KeyboardEvent) => {
    this.keys.add(event.key);
    this.computeDirection();
  };
  private readonly handleKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.key);
    this.computeDirection();
  };

  constructor(target: Window & typeof globalThis = window) {
    this.target = target;
    this.target.addEventListener('keydown', this.handleKeyDown);
    this.target.addEventListener('keyup', this.handleKeyUp);
  }

  public getDirection(): DirectionVector {
    return this.direction;
  }

  public dispose(): void {
    this.target.removeEventListener('keydown', this.handleKeyDown);
    this.target.removeEventListener('keyup', this.handleKeyUp);
  }

  private computeDirection(): void {
    const nextDirection: DirectionVector = { x: 0, z: 0 };

    if (this.keys.has('ArrowUp') || this.keys.has('w') || this.keys.has('W')) {
      nextDirection.z -= 1;
    }

    if (this.keys.has('ArrowDown') || this.keys.has('s') || this.keys.has('S')) {
      nextDirection.z += 1;
    }

    if (this.keys.has('ArrowLeft') || this.keys.has('a') || this.keys.has('A')) {
      nextDirection.x -= 1;
    }

    if (this.keys.has('ArrowRight') || this.keys.has('d') || this.keys.has('D')) {
      nextDirection.x += 1;
    }

    const length = Math.hypot(nextDirection.x, nextDirection.z);

    if (length === 0) {
      this.direction = { x: 0, z: 0 };
      return;
    }

    this.direction = {
      x: nextDirection.x / length,
      z: nextDirection.z / length,
    };
  }
}
