export class UI {
    constructor(gameState) {
        this.gameState = gameState;
        this.events = {};
        
        // Get UI elements
        this.mainMenu = document.getElementById('mainMenu');
        this.hud = document.getElementById('hud');
        this.pauseMenu = document.getElementById('pauseMenu');
        this.gameOver = document.getElementById('gameOver');
        
        this.scoreValue = document.getElementById('scoreValue');
        this.livesContainer = document.getElementById('livesContainer');
        this.finalScore = document.getElementById('finalScore');
        
        this.instructions = document.getElementById('instructions');
        
        // Bind events
        this.bindEvents();
        
        // Initial state
        this.showMainMenu();
    }
    
    bindEvents() {
        document.getElementById('startButton').addEventListener('click', () => {
            this.hideMainMenu();
            this.showHUD();
            this.trigger('start');
        });
        
        document.getElementById('instructionsButton').addEventListener('click', () => {
            document.getElementById('startButton').style.display = 'none';
            document.getElementById('instructionsButton').style.display = 'none';
            this.instructions.style.display = 'block';
        });
        
        document.getElementById('backButton').addEventListener('click', () => {
            document.getElementById('startButton').style.display = 'block';
            document.getElementById('instructionsButton').style.display = 'block';
            this.instructions.style.display = 'none';
        });
        
        document.getElementById('restartButton').addEventListener('click', () => {
            this.hideGameOver();
            this.showHUD();
            this.trigger('restart');
        });
        
        document.getElementById('menuButton').addEventListener('click', () => {
            this.hideGameOver();
            this.showMainMenu();
            this.trigger('quit');
        });
        
        document.getElementById('resumeButton').addEventListener('click', () => {
            this.hidePauseMenu();
            this.trigger('resume');
        });
        
        document.getElementById('quitButton').addEventListener('click', () => {
            this.hidePauseMenu();
            this.hideHUD();
            this.showMainMenu();
            this.trigger('quit');
        });
    }
    
    update() {
        // Update HUD
        this.scoreValue.textContent = this.gameState.score;
        this.updateLives();
        
        // Check for state changes
        if (this.gameState.state === 'paused') {
            this.showPauseMenu();
        }
        
        if (this.gameState.state === 'gameover') {
            this.hideHUD();
            this.showGameOver();
        }
    }
    
    updateLives() {
        this.livesContainer.innerHTML = '';
        for (let i = 0; i < this.gameState.lives; i++) {
            const life = document.createElement('div');
            life.className = 'life-icon';
            this.livesContainer.appendChild(life);
        }
    }
    
    showMainMenu() {
        this.mainMenu.style.display = 'flex';
        document.getElementById('startButton').style.display = 'block';
        document.getElementById('instructionsButton').style.display = 'block';
        this.instructions.style.display = 'none';
    }
    
    hideMainMenu() {
        this.mainMenu.style.display = 'none';
    }
    
    showHUD() {
        this.hud.classList.add('active');
    }
    
    hideHUD() {
        this.hud.classList.remove('active');
    }
    
    showPauseMenu() {
        this.pauseMenu.classList.add('active');
    }
    
    hidePauseMenu() {
        this.pauseMenu.classList.remove('active');
    }
    
    showGameOver() {
        this.finalScore.textContent = `Final Score: ${this.gameState.score}`;
        this.gameOver.classList.add('active');
    }
    
    hideGameOver() {
        this.gameOver.classList.remove('active');
    }
    
    on(event, callback) {
        this.events[event] = callback;
    }
    
    trigger(event) {
        if (this.events[event]) {
            this.events[event]();
        }
    }
}
