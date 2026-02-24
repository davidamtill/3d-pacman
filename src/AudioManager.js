export class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.audioContext = null;
        
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
        
        // Create placeholder sounds
        this.createPlaceholderSounds();
    }
    
    createPlaceholderSounds() {
        // These are simple synthesized sounds using Web Audio API
        // Replace with actual audio files when available
        
        this.sounds = {
            shoot: () => this.playTone(440, 0.1, 'square'),
            hit: () => this.playTone(220, 0.15, 'sawtooth'),
            explosion: () => this.playNoise(0.3),
            playerHit: () => this.playTone(110, 0.5, 'sawtooth'),
            gameOver: () => this.playGameOverSound()
        };
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playNoise(duration) {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        noise.buffer = buffer;
        noise.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        noise.start(this.audioContext.currentTime);
    }
    
    playGameOverSound() {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        // Play descending tones
        const frequencies = [440, 392, 349, 311, 262];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'triangle');
            }, index * 150);
        });
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    playMusic() {
        // Placeholder - would play background music loop
        // In a real implementation, load and play an audio file
        if (!this.musicEnabled || !this.audioContext) return;
        
        // Simple ambient drone
        if (this.musicOscillator) return; // Already playing
        
        this.musicOscillator = this.audioContext.createOscillator();
        this.musicGain = this.audioContext.createGain();
        
        this.musicOscillator.connect(this.musicGain);
        this.musicGain.connect(this.audioContext.destination);
        
        this.musicOscillator.type = 'sine';
        this.musicOscillator.frequency.value = 110;
        this.musicGain.gain.value = 0.05;
        
        this.musicOscillator.start();
    }
    
    pauseMusic() {
        if (this.musicGain) {
            this.musicGain.gain.value = 0;
        }
    }
    
    resumeMusic() {
        if (this.musicGain) {
            this.musicGain.gain.value = 0.05;
        }
    }
    
    stopMusic() {
        if (this.musicOscillator) {
            this.musicOscillator.stop();
            this.musicOscillator = null;
            this.musicGain = null;
        }
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopMusic();
        }
    }
    
    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
    }
}
