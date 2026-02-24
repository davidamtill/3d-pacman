/**
 * Deployment script for GitHub Pages
 * This script automates the deployment process
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting deployment to GitHub Pages...\n');

// Check if dist directory exists
if (!fs.existsSync('./dist')) {
    console.error('❌ Error: dist directory not found. Run "npm run build" first.');
    process.exit(1);
}

// Check if gh-pages branch exists
try {
    execSync('git show-ref --verify --quiet refs/heads/gh-pages');
    console.log('✅ gh-pages branch found');
} catch (e) {
    console.log('📝 Creating gh-pages branch...');
    try {
        execSync('git checkout --orphan gh-pages', { stdio: 'inherit' });
        execSync('git reset --hard', { stdio: 'inherit' });
        execSync('git commit --allow-empty -m "Initial gh-pages commit"', { stdio: 'inherit' });
        execSync('git checkout main || git checkout master', { stdio: 'inherit' });
        console.log('✅ gh-pages branch created');
    } catch (err) {
        console.error('❌ Error creating gh-pages branch:', err.message);
        process.exit(1);
    }
}

// Deploy to gh-pages
try {
    console.log('\n📦 Deploying to gh-pages...');
    
    // Save current branch
    const currentBranch = execSync('git branch --show-current').toString().trim();
    
    // Copy dist contents to a temp directory
    const tempDir = path.join(__dirname, '.temp-deploy');
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir);
    
    // Copy dist contents
    execSync(`cp -r dist/* ${tempDir}/`, { stdio: 'inherit' });
    
    // Switch to gh-pages branch
    execSync('git checkout gh-pages', { stdio: 'inherit' });
    
    // Remove old files (except .git)
    const files = fs.readdirSync('.');
    files.forEach(file => {
        if (file !== '.git' && file !== '.temp-deploy') {
            fs.rmSync(file, { recursive: true, force: true });
        }
    });
    
    // Move new files from temp
    execSync(`cp -r ${tempDir}/* .`, { stdio: 'inherit' });
    execSync(`cp -r ${tempDir}/.[!.]* . 2>/dev/null || true`, { stdio: 'inherit' });
    
    // Clean up temp
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    // Commit and push
    execSync('git add -A', { stdio: 'inherit' });
    
    try {
        execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
        console.log('\n📤 Pushing to GitHub...');
        execSync('git push origin gh-pages', { stdio: 'inherit' });
        console.log('\n✅ Deployment successful!');
    } catch (e) {
        console.log('\nℹ️  No changes to deploy');
    }
    
    // Switch back to original branch
    execSync(`git checkout ${currentBranch}`, { stdio: 'inherit' });
    
    console.log('\n🎉 Deployment complete!');
    console.log('Your game will be available at: https://[username].github.io/[repo-name]/');
    
} catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    // Try to switch back to original branch
    try {
        const currentBranch = execSync('git branch --show-current').toString().trim();
        if (currentBranch === 'gh-pages') {
            execSync('git checkout main || git checkout master', { stdio: 'inherit' });
        }
    } catch (e) {
        // Ignore
    }
    process.exit(1);
}
