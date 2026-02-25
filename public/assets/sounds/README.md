# Audio Files

Place your audio files here (.mp3, .wav, .ogg).

## Suggested Sound Files

### Sound Effects
- `shoot.mp3` - Laser/weapon firing (0.1-0.3s)
- `explosion.mp3` - Enemy destroyed (0.5-1s)
- `hit.mp3` - Bullet impact (0.1-0.2s)
- `player-hit.mp3` - Player takes damage (0.3-0.5s)
- `game-over.mp3` - Defeat sound (2-3s)
- `powerup.mp3` - Collect power-up (0.3-0.5s)

### Music
- `music-loop.mp3` - Background music (loopable, 1-2 min)
- `menu-music.mp3` - Menu theme (optional)

## Current Implementation

The game currently uses Web Audio API to generate synthesized sounds:
- **Shoot**: 440 Hz square wave
- **Hit**: 220 Hz sawtooth wave
- **Explosion**: White noise burst
- **Player Hit**: 110 Hz sawtooth wave
- **Game Over**: Descending tone sequence

These are defined in `src/AudioManager.js` and can be replaced with real audio files.

## Free Sound Resources

- [Freesound.org](https://freesound.org/) - Community sound library
- [OpenGameArt.org](https://opengameart.org/) - Free game assets
- [Kenney.nl](https://kenney.nl/assets) - High-quality game assets
- [Zapsplat.com](https://www.zapsplat.com/) - Sound effects library
