# 3D Models

Place your 3D model files here (.glb, .gltf, .obj).

## Suggested Models

- `player-ship.glb` - Player spaceship
- `enemy-ship.glb` - Enemy ship
- `bullet.glb` - Projectile (optional)
- `asteroid.glb` - Obstacles (optional)
- `powerup.glb` - Power-up items (optional)

## Current Implementation

The game currently uses Three.js primitive geometries:
- Player: `ConeGeometry` (cyan)
- Enemy: `OctahedronGeometry` (red)
- Bullet: `SphereGeometry` (green)

Replace these in the respective class files (`Player.js`, `EnemyManager.js`) when you add real models.
