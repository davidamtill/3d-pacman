import * as THREE from 'three';

import { InputController } from '../input/InputController';
import { MazeRenderer } from '../rendering/MazeRenderer';
import { HUD } from '../ui/HUD';
import { Maze } from './Maze';
import { PelletField } from './PelletField';
import { Player } from './Player';

interface GameEngineOptions {
  container: HTMLElement;
  hud: HUD;
}

export class GameEngine {
  private readonly scene = new THREE.Scene();
  private readonly renderer: THREE.WebGLRenderer;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly maze: Maze;
  private readonly mazeRenderer: MazeRenderer;
  private readonly player: Player;
  private readonly pellets: PelletField;
  private readonly input: InputController;
  private readonly hud: HUD;
  private readonly container: HTMLElement;
  private readonly clock = new THREE.Clock();
  private animationHandle = 0;
  private score = 0;

  constructor(options: GameEngineOptions) {
    this.container = options.container;
    this.hud = options.hud;

    this.scene.background = new THREE.Color(0x020409);

    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100,
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.maze = new Maze(21, 21, 1);
    this.mazeRenderer = new MazeRenderer(this.maze);
    this.scene.add(this.mazeRenderer.group);

    const startPosition = this.maze.cellToWorld(this.maze.start);
    this.player = new Player(startPosition, this.maze);
    this.scene.add(this.player.mesh);

    this.pellets = new PelletField(this.maze, [this.maze.start]);
    this.scene.add(this.pellets.group);

    this.input = new InputController();

    this.configureCamera();
    this.configureLights();
    this.hud.updateScore(0);
    this.hud.updatePellets(0, this.pellets.totalPellets);
    this.hud.setStatus('Collect all pellets!');

    window.addEventListener('resize', this.handleResize);
  }

  public start(): void {
    this.clock.start();
    const loop = () => {
      const delta = this.clock.getDelta();
      this.update(delta);
      this.renderer.render(this.scene, this.camera);
      this.animationHandle = requestAnimationFrame(loop);
    };

    this.animationHandle = requestAnimationFrame(loop);
  }

  public dispose(): void {
    cancelAnimationFrame(this.animationHandle);
    window.removeEventListener('resize', this.handleResize);
    this.input.dispose();
    this.renderer.dispose();
  }

  private update(delta: number): void {
    this.player.update(delta, this.input.getDirection());

    if (this.pellets.tryCollect(this.player.getPosition())) {
      const collected = this.pellets.getCollected();
      this.score = collected * 10;
      this.hud.updateScore(this.score);
      this.hud.updatePellets(collected, this.pellets.totalPellets);

      if (this.pellets.getRemaining() === 0) {
        this.hud.setStatus('Maze cleared! Refresh to regenerate.');
      }
    }
  }

  private configureCamera(): void {
    const centerCell = { row: Math.floor(this.maze.rows / 2), col: Math.floor(this.maze.cols / 2) };
    const center = this.maze.cellToWorld(centerCell);
    this.camera.position.set(center.x, 14, center.z + 8);
    this.camera.lookAt(center.x, 0, center.z);
  }

  private configureLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 10, 5);
    directional.castShadow = true;
    directional.shadow.mapSize.set(2048, 2048);
    this.scene.add(directional);

    const fill = new THREE.PointLight(0x3a86ff, 0.4, 30, 2);
    fill.position.set(-4, 6, -2);
    this.scene.add(fill);
  }

  private handleResize = (): void => {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / Math.max(1, clientHeight);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  };
}
