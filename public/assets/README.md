# 🎨 Game Assets

This directory contains all game assets including 3D models, sounds, and textures.

## Directory Structure

```
assets/
├── models/          # 3D models (.glb, .gltf, .obj)
├── sounds/          # Audio files (.mp3, .wav, .ogg)
└── textures/        # Image textures (.png, .jpg)
```

## Current Status

🔧 **Placeholder Mode**: The game currently uses procedurally generated geometries and synthesized sounds from the Web Audio API.

## Adding Real Assets

### 3D Models

**Supported Formats:**
- `.glb` (recommended) - Binary GLTF
- `.gltf` - GLTF JSON
- `.obj` - Wavefront OBJ

**Recommended Tools:**
- [Blender](https://www.blender.org/) - Free 3D modeling
- [Sketchfab](https://sketchfab.com/) - Download free models
- [Poly Haven](https://polyhaven.com/) - Free 3D assets

**Usage Example:**
```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load('/assets/models/spaceship.glb', (gltf) => {
    scene.add(gltf.scene);
});
```

### Sounds

**Supported Formats:**
- `.mp3` (recommended for compatibility)
- `.wav` (best quality, larger files)
- `.ogg` (good balance)

**Recommended Sounds:**
- `shoot.mp3` - Laser firing sound
- `explosion.mp3` - Enemy destroyed
- `hit.mp3` - Bullet hit
- `player-hit.mp3` - Player takes damage
- `game-over.mp3` - Game over jingle
- `music-loop.mp3` - Background music

**Free Sound Resources:**
- [Freesound.org](https://freesound.org/)
- [OpenGameArt.org](https://opengameart.org/)
- [Kenney.nl](https://kenney.nl/assets)

**Usage Example:**
```javascript
const audio = new Audio('/assets/sounds/shoot.mp3');
audio.volume = 0.5;
audio.play();
```

### Textures

**Supported Formats:**
- `.png` (recommended for transparency)
- `.jpg` (smaller file size)
- `.webp` (modern, efficient)

**Recommended Textures:**
- `spaceship-diffuse.png` - Player ship texture
- `enemy-diffuse.png` - Enemy texture
- `particle.png` - Explosion particles
- `skybox/` - Space background

**Usage Example:**
```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/assets/textures/spaceship.png');
material.map = texture;
```

## Asset Guidelines

### Models
- Keep polygon count reasonable (< 5k triangles for mobile)
- Use PBR materials for realistic rendering
- Include normal maps for detail
- Center pivot point at origin
- Scale: 1 unit = 1 meter

### Sounds
- Sample rate: 44100 Hz
- Bit depth: 16-bit minimum
- Format: Stereo for music, Mono for SFX
- Max file size: 1MB for SFX, 5MB for music
- Normalize audio levels

### Textures
- Power-of-2 dimensions (512x512, 1024x1024, etc.)
- Use mipmaps for better performance
- Compress large textures
- Use texture atlases when possible

## Optimization Tips

1. **Compress Models**: Use GLTF with Draco compression
2. **Optimize Audio**: Use MP3 at 128kbps for SFX
3. **Resize Textures**: Don't use 4K textures for small objects
4. **Lazy Loading**: Load assets as needed, not all at once
5. **Use Sprite Sheets**: Combine multiple textures

## License Considerations

When adding third-party assets:

1. ✅ Check the license (CC0, MIT, CC-BY, etc.)
2. ✅ Attribute creators if required
3. ✅ Don't use copyrighted material
4. ✅ Keep a `CREDITS.md` file

## Credits Template

Create a `CREDITS.md` file:

```markdown
# Asset Credits

## 3D Models
- Spaceship by [Artist Name] - [License] - [Source URL]

## Sounds
- Laser Sound by [Artist Name] - [License] - [Source URL]

## Textures
- Space Background by [Artist Name] - [License] - [Source URL]
```

---

**Need help?** Check the main [README.md](../../README.md) or open an issue!
