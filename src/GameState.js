export class GameState {
    constructor() {
        this.state = 'menu'; // menu, playing, paused, gameover
        this.score = 0;
        this.lives = 3;
        this.maxLives = 3;
    }
    
    start() {
        this.state = 'playing';
        this.score = 0;
        this.lives = this.maxLives;
    }
    
    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
        }
    }
    
    resume() {
        if (this.state === 'paused') {
            this.state = 'playing';
        }
    }
    
    gameOver() {
        this.state = 'gameover';
    }
    
    reset() {
        this.state = 'menu';
        this.score = 0;
        this.lives = this.maxLives;
    }
    
    addScore(points) {
        this.score += points;
    }
    
    loseLife() {
        this.lives = Math.max(0, this.lives - 1);
    }
    
    getScore() {
        return this.score;
    }
    
    getLives() {
        return this.lives;
    }
}
