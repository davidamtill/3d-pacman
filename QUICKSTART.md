# ⚡ Quick Start Guide

Get your Space Shooter game running in under 5 minutes!

## 🚀 Fast Track (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start the game
npm run dev

# 3. Open browser
# Game automatically opens at http://localhost:3000
```

**That's it!** You're ready to play! 🎮

## 📤 Fast Track (Deploy to GitHub Pages)

```bash
# 1. Build the game
npm run build

# 2. Deploy
npm run deploy
```

**Done!** Your game is now live! 🌐

## 📋 Commands Cheatsheet

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy to GitHub Pages |

## 🎮 Game Controls

- **Move**: Arrow Keys / WASD
- **Shoot**: SPACE
- **Pause**: ESC / P

## 🛠️ First Steps After Setup

### 1. Customize the Game

**Edit game title:**
- Open `index.html`
- Change `<h1>🚀 SPACE SHOOTER</h1>` to your title

**Change colors:**
- Edit CSS in `index.html`
- Look for color codes like `#00d4ff`

**Adjust difficulty:**
- Open `src/EnemyManager.js`
- Change `this.spawnInterval` (enemy spawn rate)
- Change `this.difficultyInterval` (difficulty progression)

### 2. Add Real Assets

**Add 3D models:**
```javascript
// In Player.js or EnemyManager.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const loader = new GLTFLoader();
loader.load('/assets/models/spaceship.glb', (gltf) => {
    this.mesh = gltf.scene;
});
```

**Add sounds:**
```javascript
// In AudioManager.js
const audio = new Audio('/assets/sounds/shoot.mp3');
audio.play();
```

### 3. Test Your Changes

```bash
npm run dev
```

Make changes and see them instantly!

### 4. Deploy

```bash
npm run build
npm run deploy
```

## 🐛 Common Issues

### Port already in use
```bash
# Change port in vite.config.js
server: {
  port: 3001  // Change from 3000
}
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Game not loading after deploy
- Wait 2-3 minutes for GitHub Pages to build
- Check GitHub repository Settings > Pages
- Ensure gh-pages branch is selected

## 📚 Next Steps

- Read the full [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deploy guide
- Browse [public/assets/README.md](public/assets/README.md) for asset guidelines
- Explore the source code in `src/` directory

## 🆘 Need Help?

1. Check the console (F12 in browser)
2. Read error messages carefully
3. Search for the error online
4. Open an issue on GitHub

## 💡 Pro Tips

- Press F12 to open browser DevTools
- Use `console.log()` for debugging
- Make small changes and test often
- Commit your code frequently
- Comment your code for future you

---

**Happy Game Development!** 🎮✨

[Back to README](README.md) | [Deployment Guide](DEPLOYMENT.md)
