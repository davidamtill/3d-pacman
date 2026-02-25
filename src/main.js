import * as THREE from 'three';
import { GameState } from './GameState.js';
import { Player } from './Player.js';
import { EnemyManager } from './EnemyManager.js';
import { AudioManager } from './AudioManager.js';
import { UI } from './UI.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        
        this.gameState = new GameState();
        this.audioManager = new AudioManager();
        this.ui = new UI(this.gameState);
        
        this.player = null;
        this.enemyManager = null;
        
        this.keys = {};
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Camera position
        this.camera.position.z = 5;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 10);
        this.scene.add(directionalLight);
        
        // Starfield background
        this.createStarfield();
        
        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // UI event listeners
        this.ui.on('start', () => this.startGame());
        this.ui.on('restart', () => this.restartGame());
        this.ui.on('resume', () => this.resumeGame());
        this.ui.on('pause', () => this.pauseGame());
        this.ui.on('quit', () => this.quitToMenu());
    }
    
    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    startGame() {
        this.gameState.start();
        
        // Create player
        this.player = new Player(this.scene, this.audioManager);
        
        // Create enemy manager
        this.enemyManager = new EnemyManager(this.scene, this.audioManager);
        
        // Start game loop
        this.lastTime = performance.now();
        this.animate();
        
        // Start background music
        this.audioManager.playMusic();
    }
    
    restartGame() {
        this.cleanup();
        this.startGame();
    }
    
    pauseGame() {
        this.gameState.pause();
        this.audioManager.pauseMusic();
    }
    
    resumeGame() {
        this.gameState.resume();
        this.audioManager.resumeMusic();
        this.lastTime = performance.now();
    }
    
    quitToMenu() {
        this.cleanup();
        this.gameState.reset();
        this.audioManager.stopMusic();
    }
    
    cleanup() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
        
        if (this.enemyManager) {
            this.enemyManager.destroy();
            this.enemyManager = null;
        }
    }
    
    onKeyDown(event) {
        this.keys[event.key.toLowerCase()] = true;
        
        // Pause
        if ((event.key === 'Escape' || event.key.toLowerCase() === 'p') && 
            this.gameState.state === 'playing') {
            this.pauseGame();
        }
        
        // Shoot
        if (event.key === ' ' && this.gameState.state === 'playing') {
            event.preventDefault();
            if (this.player) {
                this.player.shoot();
            }
        }
    }
    
    onKeyUp(event) {
        this.keys[event.key.toLowerCase()] = false;
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    update(deltaTime) {
        if (this.gameState.state !== 'playing') return;
        
        // Update player
        if (this.player) {
            const moveX = (this.keys['arrowright'] || this.keys['d'] ? 1 : 0) - 
                         (this.keys['arrowleft'] || this.keys['a'] ? 1 : 0);
            const moveY = (this.keys['arrowup'] || this.keys['w'] ? 1 : 0) - 
                         (this.keys['arrowdown'] || this.keys['s'] ? 1 : 0);
            
            this.player.update(deltaTime, moveX, moveY);
        }
        
        // Update enemies
        if (this.enemyManager) {
            this.enemyManager.update(deltaTime);
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Update UI
        this.ui.update();
    }
    
    checkCollisions() {
        if (!this.player || !this.enemyManager) return;
        
        const playerBullets = this.player.getBullets();
        const enemies = this.enemyManager.getEnemies();
        
        // Check bullet-enemy collisions
        playerBullets.forEach(bullet => {
            enemies.forEach(enemy => {
                if (this.checkCollision(bullet.mesh, enemy.mesh)) {
                    bullet.destroy();
                    enemy.hit();
                    
                    if (enemy.isDead()) {
                        this.gameState.addScore(100);
                        this.enemyManager.removeEnemy(enemy);
                        this.audioManager.playSound('explosion');
                    } else {
                        this.audioManager.playSound('hit');
                    }
                }
            });
        });
        
        // Check player-enemy collisions
        enemies.forEach(enemy => {
            if (this.checkCollision(this.player.mesh, enemy.mesh)) {
                this.gameState.loseLife();
                this.enemyManager.removeEnemy(enemy);
                this.audioManager.playSound('playerHit');
                
                if (this.gameState.lives <= 0) {
                    this.gameOver();
                }
            }
        });
    }
    
    checkCollision(obj1, obj2) {
        const distance = obj1.position.distanceTo(obj2.position);
        const minDistance = 0.5; // Collision threshold
        return distance < minDistance;
    }
    
    gameOver() {
        this.gameState.gameOver();
        this.audioManager.stopMusic();
        this.audioManager.playSound('gameOver');
    }
    
    animate() {
        if (this.gameState.state === 'playing') {
            requestAnimationFrame(() => this.animate());
        }
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
