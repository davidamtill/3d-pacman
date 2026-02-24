# 🤝 Contributing to Space Shooter Game

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🎯 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🎨 Add assets (models, sounds, textures)
- 🔧 Fix issues
- ✨ Add new features

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/space-shooter-game.git
cd space-shooter-game

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/space-shooter-game.git
```

### 2. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 3. Make Changes

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Make your changes...
# Test thoroughly!
```

### 4. Commit

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add laser beam weapon"
```

### 5. Push & Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create a Pull Request
```

## 📋 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Examples

```bash
feat: add shield power-up
fix: collision detection not working on Safari
docs: update deployment guide
style: format code with prettier
refactor: extract enemy AI to separate class
perf: optimize starfield rendering
test: add unit tests for GameState
chore: update dependencies
```

## 🎨 Code Style

### JavaScript
- Use ES6+ features
- Use `const` by default, `let` when needed
- Use arrow functions for callbacks
- Add JSDoc comments for functions
- Keep functions small and focused

```javascript
/**
 * Spawns a new enemy at a random position
 * @returns {Enemy} The newly created enemy
 */
spawnEnemy() {
    const x = (Math.random() - 0.5) * 8;
    const y = 6;
    return new Enemy(this.scene, new THREE.Vector3(x, y, 0));
}
```

### CSS
- Use meaningful class names
- Follow BEM methodology when appropriate
- Use CSS variables for colors
- Mobile-first responsive design

### File Organization
- One class per file
- Related files in same directory
- Clear, descriptive file names

## 🐛 Reporting Bugs

### Before Submitting
1. Check if bug already reported
2. Verify it's reproducible
3. Check browser console for errors

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen?

**Screenshots**
If applicable.

**Environment:**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96]
- Node: [e.g., 18.0.0]

**Additional context**
Any other information.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature related to a problem?**
Describe the problem.

**Describe the solution**
What do you want to happen?

**Describe alternatives**
Other solutions you've considered.

**Additional context**
Mockups, examples, etc.
```

## 🎨 Contributing Assets

### 3D Models
- Format: `.glb` (preferred) or `.gltf`
- Polygon count: < 5k triangles
- Include textures if applicable
- License: CC0 or CC-BY preferred

### Sounds
- Format: `.mp3` (< 1MB)
- Sample rate: 44100 Hz
- Normalize audio levels
- License: CC0 or CC-BY preferred

### Textures
- Format: `.png` or `.jpg`
- Resolution: Power of 2 (512x512, 1024x1024)
- Optimize file size
- License: CC0 or CC-BY preferred

### Asset Checklist
- [ ] Asset is optimized for web
- [ ] License allows commercial use
- [ ] Attribution added to CREDITS.md
- [ ] Asset follows project style
- [ ] Tested in game

## ✅ Pull Request Checklist

Before submitting a PR:

- [ ] Code follows project style
- [ ] Commit messages follow convention
- [ ] All tests pass (`npm run dev` works)
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers
- [ ] CREDITS.md updated if adding assets
- [ ] README.md updated if adding features

## 🔍 Code Review Process

1. **Automated checks** run on PR
2. **Maintainer review** - Usually within 48 hours
3. **Feedback** - Address any comments
4. **Approval** - Once all checks pass
5. **Merge** - Maintainer merges PR

## 🎯 Priority Areas

We especially welcome contributions in:

1. **Assets** - High-quality 3D models and sounds
2. **Mobile support** - Touch controls
3. **Performance** - Optimization
4. **Accessibility** - Better a11y
5. **Tests** - Unit and integration tests

## 📚 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)

## ❓ Questions?

- Check [README.md](README.md) first
- Search existing issues
- Open a discussion on GitHub
- Ask in PR comments

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution helps make this project better. We appreciate your time and effort! ❤️

---

**Happy Contributing!** 🎮✨
