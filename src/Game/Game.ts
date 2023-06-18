import * as THREE from 'three';

import Camera from '../Gravity/Camera';
import ServiceProvider from './Core/ServiceProvider';
import World from './World/World';
import { InputManager } from '../Gravity/InputManager';
import { UIManager } from './Core/UIManager';
import { GameStateManager } from './Core/GameStateManager';
import Viewport from '../Gravity/Viewport';
import Time from '../Gravity/Time';
import Renderer from '../Gravity/Renderer';
import { ObjectiveManager } from './Core/ObjectiveManager';

import Stats from 'stats.js';
import { AudioManager } from './Core/AudioManager';
import { Random } from '../Gravity/Random';

export default class Game {
	// Reference to HTML canvas element on which the game will be displayed
	private m_canvas: Element;
	public get canvas() {
		return this.m_canvas;
	}

	private m_viewport: Viewport;
	public get viewport() {
		return this.m_viewport;
	}

	private m_inputManager: InputManager;
	public get inputManager() {
		return this.m_inputManager;
	}

	private m_time: Time;
	public get time() {
		return this.m_time;
	}

	private m_scene: THREE.Scene;
	public get scene() {
		return this.m_scene;
	}

	private m_camera: Camera;
	public get camera() {
		return this.m_camera;
	}

	private m_renderer: Renderer;
	public get renderer() {
		return this.m_renderer;
	}

	private m_world: World;
	public get world() {
		return this.m_world;
	}

	private m_UIManager: UIManager;
	public get UIManager() {
		return this.m_UIManager;
	}

	private m_gameStateManager: GameStateManager;
	public get gameStateManager() {
		return this.m_gameStateManager;
	}

	private m_objectiveManager: ObjectiveManager;
	public get objectivesManager() {
		return this.m_objectiveManager;
	}

	private m_stats = new Stats();

	private m_audioManager: AudioManager;
	public get audioManager() {
		return this.m_audioManager;
	}

	constructor(canvas: Element | null) {
		if (canvas === null) {
			throw new Error('Null canvas provided to Game class');
		}

		Random.setSeed(Math.random().toString());

		ServiceProvider.game = this;

		this.m_canvas = canvas;

		this.m_viewport = new Viewport();

		this.m_inputManager = new InputManager();

		this.m_time = new Time();

		this.m_scene = new THREE.Scene();

		this.m_camera = new Camera();

		this.m_renderer = new Renderer();

		this.m_world = new World();

		this.m_UIManager = new UIManager();

		this.m_gameStateManager = new GameStateManager();

		this.m_objectiveManager = new ObjectiveManager();

		this.m_audioManager = new AudioManager();

		this.m_viewport.on('resize', () => {
			this.resize();
		});

		this.m_time.on('tick', () => {
			this.update();
			this.render();
		});

		this.m_stats.showPanel(0);
		document.body.appendChild(this.m_stats.dom);
	}

	// [TODO]: Probably create private load method and public start method

	private update() {
		if (!this.m_gameStateManager.gameStarted) {
			return;
		}
		this.m_stats.begin();

		this.m_camera.update();
		this.m_renderer.update();
		this.m_world.update();

		this.m_stats.end();
	}

	private render() {}

	private resize() {
		this.m_camera.resize();
		this.renderer.resize();
	}
}
