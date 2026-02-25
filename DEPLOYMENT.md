# 🚀 Deployment Guide - GitHub Pages

This guide will walk you through deploying your Space Shooter game to GitHub Pages.

## Prerequisites

- Git installed and configured
- GitHub account
- Repository created on GitHub
- Node.js and npm installed

## Quick Deploy

```bash
# 1. Build the game
npm run build

# 2. Deploy to GitHub Pages
npm run deploy
```

That's it! Your game will be live at `https://[username].github.io/[repo-name]/`

## Detailed Setup Instructions

### First-Time Setup

1. **Initialize Git Repository (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (public)
   - Don't initialize with README, .gitignore, or license

3. **Link Local Repository to GitHub**
   ```bash
   git remote add origin https://github.com/[username]/[repo-name].git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** > **Pages**
   - Under "Source", select branch: `gh-pages`
   - Click **Save**

### Deploy Process

The `npm run deploy` command does the following:

1. ✅ Checks if `dist` directory exists
2. 📝 Creates `gh-pages` branch (if it doesn't exist)
3. 📦 Copies built files to `gh-pages` branch
4. 📤 Pushes to GitHub
5. 🎉 Your game is live!

### Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# Navigate to dist directory
cd dist

# Initialize git and push to gh-pages
git init
git add -A
git commit -m "Deploy"
git push -f https://github.com/[username]/[repo-name].git main:gh-pages

# Go back to project root
cd ..
```

## Troubleshooting

### Issue: Pages not showing up

**Solution:** Wait 2-3 minutes after first deploy. GitHub Pages takes time to build.

### Issue: 404 errors for assets

**Solution:** Check that `base: './'` is set in `vite.config.js`

### Issue: Deploy script fails

**Solutions:**
- Ensure you've committed all changes: `git status`
- Make sure you have push access to the repository
- Try running `npm run build` separately first

### Issue: White screen after deployment

**Solutions:**
- Check browser console for errors
- Verify all paths are relative in `vite.config.js`
- Clear browser cache and hard reload (Ctrl+Shift+R)

## Custom Domain (Optional)

To use a custom domain:

1. Create a `CNAME` file in the `public` directory:
   ```
   yourdomain.com
   ```

2. Configure your domain's DNS:
   - Add a CNAME record pointing to `[username].github.io`

3. In GitHub repository settings:
   - Go to **Settings** > **Pages**
   - Enter your custom domain
   - Enable **Enforce HTTPS**

## Continuous Deployment

For automatic deployment on every push:

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

Now every push to `main` will automatically deploy!

## Performance Tips

- Optimize images and audio files
- Enable gzip compression (automatic with GitHub Pages)
- Minify code (already configured in Vite)
- Use WebP for images
- Lazy load assets

## Monitoring

- Check deployment status: Repository > Actions tab
- View live site: `https://[username].github.io/[repo-name]/`
- Check Google Lighthouse for performance metrics

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

Happy Deploying! 🎮✨
