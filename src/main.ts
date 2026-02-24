import './style.css';

import { GameEngine } from './game/GameEngine';
import { HUD } from './ui/HUD';

const mount = document.querySelector<HTMLDivElement>('#app');

if (!mount) {
  throw new Error('Unable to find #app element.');
}

mount.innerHTML = '';

const stage = document.createElement('div');
stage.className = 'game-stage';
mount.appendChild(stage);

const hud = new HUD();
stage.appendChild(hud.element);

const engine = new GameEngine({ container: stage, hud });
engine.start();
