# 🚀 Space Shooter Game

A fast-paced 3D space shooter built with Three.js and vanilla JavaScript. Destroy enemies, rack up points, and survive as long as you can!

![Game Preview](https://via.placeholder.com/800x400/000000/00d4ff?text=Space+Shooter+Game)

## ✨ Features

- 🎮 **Smooth 3D Graphics** - Powered by Three.js
- 🎯 **Progressive Difficulty** - Game gets harder over time
- 🎵 **Sound Effects** - Synthesized audio feedback
- 💾 **Score System** - Track your best runs
- 🎨 **Modern UI** - Sleek menus and HUD
- 📱 **Responsive** - Works on different screen sizes
- ⚡ **Fast Loading** - Optimized with Vite

## 🎮 How to Play

### Controls

- **Move**: Arrow Keys or WASD
- **Shoot**: SPACE
- **Pause**: ESC or P

### Objective

Destroy red enemy ships to earn points. Avoid letting them reach you! You have 3 lives.

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/[repo-name].git
   cd [repo-name]
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

The optimized files will be in the `dist` directory.

### Deploy to GitHub Pages

```bash
npm run deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
space-shooter-game/
├── src/
│   ├── main.js          # Main game loop and initialization
│   ├── GameState.js     # Game state management
│   ├── Player.js        # Player ship and bullets
│   ├── EnemyManager.js  # Enemy spawning and management
│   ├── AudioManager.js  # Sound effects and music
│   └── UI.js            # Menu and HUD management
├── public/
│   └── assets/          # Game assets (models, sounds)
├── index.html           # Main HTML file
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
├── deploy.js            # Deployment script
├── DEPLOYMENT.md        # Deployment guide
└── README.md            # This file
```

## 🎨 Customization

### Adding Custom Models

Replace the placeholder geometries in `Player.js` and `EnemyManager.js` with your own 3D models:

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load('/assets/models/spaceship.glb', (gltf) => {
    this.mesh = gltf.scene;
});
```

### Adding Sound Files

Replace synthesized sounds in `AudioManager.js`:

```javascript
const audio = new Audio('/assets/sounds/shoot.mp3');
audio.play();
```

### Changing Colors & Theme

Edit the CSS variables in `index.html`:

```css
:root {
    --primary-color: #00d4ff;
    --secondary-color: #667eea;
    --danger-color: #ff0000;
}
```

## 🔧 Configuration

### Difficulty Settings

Edit `EnemyManager.js` to adjust game difficulty:

```javascript
this.spawnInterval = 1.5;      // Time between enemy spawns
this.difficultyInterval = 10;  // Time between difficulty increases
```

### Player Settings

Edit `Player.js` to modify player characteristics:

```javascript
this.speed = 5;                // Movement speed
this.shootCooldown = 0.2;      // Time between shots
```

## 🐛 Troubleshooting

### Game doesn't start
- Check browser console for errors
- Ensure all dependencies are installed
- Try clearing browser cache

### Performance issues
- Reduce number of particles in starfield
- Lower enemy spawn rate
- Disable shadows in Three.js

### Deployment issues
- See [DEPLOYMENT.md](./DEPLOYMENT.md)
- Check GitHub Pages is enabled in repository settings

## 📝 TODO / Future Enhancements

- [ ] Add power-ups (shields, rapid fire, bombs)
- [ ] Multiple enemy types with different behaviors
- [ ] Boss battles every 10 levels
- [ ] Local high score persistence
- [ ] Mobile touch controls
- [ ] Sound toggle buttons in menu
- [ ] Particle effects for explosions
- [ ] Background parallax scrolling
- [ ] Achievement system
- [ ] Multiplayer mode

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [Vite](https://vitejs.dev/) - Build tool
- Web Audio API for sound synthesis

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/[username]/[repo-name]](https://github.com/[username]/[repo-name])

---

Made with ❤️ and JavaScript

🎮 **[Play Now](https://[username].github.io/[repo-name]/)** 🎮
