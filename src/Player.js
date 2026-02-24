import * as THREE from 'three';

class Bullet {
    constructor(scene, position) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.3 
        });
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.mesh.add(this.glow);
        
        scene.add(this.mesh);
        this.scene = scene;
        this.speed = 15;
        this.active = true;
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        this.mesh.position.y += this.speed * deltaTime;
        
        // Remove if off screen
        if (this.mesh.position.y > 10) {
            this.destroy();
        }
    }
    
    destroy() {
        this.active = false;
        this.scene.remove(this.mesh);
    }
}

export class Player {
    constructor(scene, audioManager) {
        this.scene = scene;
        this.audioManager = audioManager;
        this.bullets = [];
        this.lastShootTime = 0;
        this.shootCooldown = 0.2; // seconds
        
        // Create player mesh (simple spaceship)
        const geometry = new THREE.ConeGeometry(0.3, 1, 4);
        const material = new THREE.MeshPhongMaterial({ color: 0x00d4ff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI;
        this.mesh.position.y = -3;
        
        scene.add(this.mesh);
        
        this.speed = 5;
        this.bounds = { x: 4, y: 4 };
    }
    
    update(deltaTime, moveX, moveY) {
        // Move player
        this.mesh.position.x += moveX * this.speed * deltaTime;
        this.mesh.position.y += moveY * this.speed * deltaTime;
        
        // Clamp to bounds
        this.mesh.position.x = Math.max(-this.bounds.x, Math.min(this.bounds.x, this.mesh.position.x));
        this.mesh.position.y = Math.max(-this.bounds.y, Math.min(this.bounds.y, this.mesh.position.y));
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            if (bullet.active) {
                bullet.update(deltaTime);
                return true;
            }
            return false;
        });
    }
    
    shoot() {
        const currentTime = performance.now() / 1000;
        if (currentTime - this.lastShootTime < this.shootCooldown) {
            return;
        }
        
        this.lastShootTime = currentTime;
        
        const bulletPos = this.mesh.position.clone();
        bulletPos.y += 0.5;
        
        const bullet = new Bullet(this.scene, bulletPos);
        this.bullets.push(bullet);
        
        this.audioManager.playSound('shoot');
    }
    
    getBullets() {
        return this.bullets;
    }
    
    destroy() {
        this.scene.remove(this.mesh);
        this.bullets.forEach(bullet => bullet.destroy());
        this.bullets = [];
    }
}
