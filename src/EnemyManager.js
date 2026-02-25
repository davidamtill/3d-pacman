import * as THREE from 'three';

class Enemy {
    constructor(scene, position) {
        this.scene = scene;
        this.health = 3;
        this.maxHealth = 3;
        
        // Create enemy mesh (simple cube/octahedron)
        const geometry = new THREE.OctahedronGeometry(0.4);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        
        scene.add(this.mesh);
        
        this.speed = 2 + Math.random() * 2;
        this.rotationSpeed = Math.random() * 2;
        this.active = true;
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        // Move down
        this.mesh.position.y -= this.speed * deltaTime;
        
        // Rotate
        this.mesh.rotation.x += this.rotationSpeed * deltaTime;
        this.mesh.rotation.y += this.rotationSpeed * deltaTime;
        
        // Remove if off screen
        if (this.mesh.position.y < -6) {
            this.destroy();
        }
    }
    
    hit() {
        this.health--;
        
        // Visual feedback - flash
        this.mesh.material.emissive.setHex(0xffffff);
        setTimeout(() => {
            if (this.mesh.material) {
                this.mesh.material.emissive.setHex(0x000000);
            }
        }, 100);
    }
    
    isDead() {
        return this.health <= 0;
    }
    
    destroy() {
        this.active = false;
        this.scene.remove(this.mesh);
    }
}

export class EnemyManager {
    constructor(scene, audioManager) {
        this.scene = scene;
        this.audioManager = audioManager;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1.5; // seconds
        this.difficulty = 1;
        this.difficultyTimer = 0;
        this.difficultyInterval = 10; // increase difficulty every 10 seconds
    }
    
    update(deltaTime) {
        // Spawn enemies
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy();
        }
        
        // Update difficulty
        this.difficultyTimer += deltaTime;
        if (this.difficultyTimer >= this.difficultyInterval) {
            this.difficultyTimer = 0;
            this.difficulty += 0.1;
            this.spawnInterval = Math.max(0.5, this.spawnInterval - 0.1);
        }
        
        // Update all enemies
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.active) {
                enemy.update(deltaTime);
                return true;
            }
            return false;
        });
    }
    
    spawnEnemy() {
        const x = (Math.random() - 0.5) * 8;
        const y = 6;
        const position = new THREE.Vector3(x, y, 0);
        
        const enemy = new Enemy(this.scene, position);
        this.enemies.push(enemy);
    }
    
    getEnemies() {
        return this.enemies;
    }
    
    removeEnemy(enemy) {
        enemy.destroy();
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }
    
    destroy() {
        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];
    }
}
