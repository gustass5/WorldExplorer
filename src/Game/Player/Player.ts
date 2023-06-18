import ServiceProvider from '../Core/ServiceProvider';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { Transform } from '../../Gravity/Components/Transform';
import { EventEmitter } from '../../Utilities/EventEmitter';
import { TerrainEntity } from '../World/TerrainEntity';

export default class Player extends EventEmitter {
	private m_transform!: Transform;
	public get transform() {
		return this.m_transform;
	}

	private m_elevation = 0;

	private m_playerGroup: THREE.Group = new THREE.Group();

	private m_isSprintToggled = false;

	private m_isMoving = false;
	private m_isMovingSoundPlaying = false;
	private m_movementSpeed = 0.00025;
	private m_walkingSpeed = 0.00025;
	private m_sprintSpeed = 0.0001;
	private m_rotationSpeed = 0.0125;
	private m_rotationTopBound = -1.25;
	private m_rotationBottomBound = 1.5;

	private transformControls!: TransformControls;

	private m_raycaster!: THREE.Raycaster;
	private m_scanDistance = 0.06;
	private m_scanUI!: { scanIndicator: Element; scanCircleFill: Element; scanCircleProgress: Element };
	private m_currentIntersectName: string | null = null;
	private m_currentScanName: string | null = null;
	private m_scanStartTime: number = 0;
	private m_scanDuration = 3000;

	private m_isDatabookShown = false;
	private m_lastDatabookButtonState = false;

	constructor() {
		super();
		const mesh = new THREE.Mesh(
			new THREE.CapsuleGeometry(0.01, 0.02),
			new THREE.MeshBasicMaterial({ color: 'cyan' })
		);

		this.m_playerGroup.position.set(mesh.position.x, mesh.position.y, mesh.position.z);

		ServiceProvider.game.camera.transform.setRotation({
			x: 0,
			y: mesh.rotation.y + Math.PI,
			z: 0
		});

		this.m_transform = new Transform(this.m_playerGroup);
		this.m_transform.setRotation({
			x: mesh.rotation.x,
			y: mesh.rotation.y,
			z: mesh.rotation.z
		});

		this.m_playerGroup.add(ServiceProvider.game.camera.perspectiveCamera);
		this.m_playerGroup.add(mesh);

		ServiceProvider.game.scene.add(this.m_playerGroup);

		const scanIndicator = document.querySelector('.scan-indicator');
		const scanCircleFill = document.querySelector('.scan-circle-fill');
		const scanCircleProgress = document.querySelector('.scan-circle-progress');

		this.m_scanUI = {} as any;
		if (scanIndicator && scanCircleFill && scanCircleProgress) {
			this.m_scanUI.scanIndicator = scanIndicator;
			this.m_scanUI.scanCircleFill = scanCircleFill;
			this.m_scanUI.scanCircleProgress = scanCircleProgress;
		} else {
			console.error('Scan UI elements were not found');
		}

		this.m_raycaster = new THREE.Raycaster();
		this.m_raycaster.far = this.m_scanDistance;
	}

	public update() {
		if (!ServiceProvider.game.gameStateManager.gameStarted || ServiceProvider.game.gameStateManager.gamePaused) {
			ServiceProvider.game.audioManager.walkingSound.stop();
			this.m_isMovingSoundPlaying = false;
			return;
		}

		this.applyElevation();

		if (ServiceProvider.game.inputManager.inputState['KeyE'] !== this.m_lastDatabookButtonState) {
			if (ServiceProvider.game.inputManager.inputState['KeyE']) {
				if (!this.m_isDatabookShown) {
					this.trigger('databookOpen');
					ServiceProvider.game.UIManager.showDatabook();
					ServiceProvider.game.gameStateManager.lockControls();
				} else {
					ServiceProvider.game.UIManager.hideDatabook();
					ServiceProvider.game.gameStateManager.unlockControls();
				}
				// ServiceProvider.game.audioManager.menuSound.play();
				this.m_isDatabookShown = !this.m_isDatabookShown;
			}

			this.m_lastDatabookButtonState = ServiceProvider.game.inputManager.inputState['KeyE'];
		}

		if (ServiceProvider.game.gameStateManager.controlsLocked) {
			ServiceProvider.game.audioManager.walkingSound.stop();
			this.m_isMovingSoundPlaying = false;
			return;
		}

		this.updateCameraPosition();

		this.updateMovement();

		if (this.m_isMoving && !this.m_isMovingSoundPlaying) {
			ServiceProvider.game.audioManager.walkingSound.play();
			this.m_isMovingSoundPlaying = true;
		}

		if (!this.m_isMoving && this.m_isMovingSoundPlaying) {
			ServiceProvider.game.audioManager.walkingSound.stop();
			this.m_isMovingSoundPlaying = false;
		}

		this.updateActions();
	}

	public setElevation(elevation: number) {
		this.m_elevation = elevation;
	}

	private applyElevation() {
		const currentTransform = this.transform.getPosition();
		const elevation = this.m_elevation + 0.01;

		this.transform.setPosition({
			x: currentTransform.x,
			y: elevation + 0.01,
			z: currentTransform.z
		});
	}

	private setupTransformControls() {
		this.transformControls = new TransformControls(
			ServiceProvider.game.camera.perspectiveCamera,
			ServiceProvider.game.renderer.WebGLRenderer.domElement
		);

		this.transformControls.attach(this.m_playerGroup);

		ServiceProvider.game.scene.add(this.transformControls);

		this.transformControls.showY = false;

		this.transformControls.addEventListener('dragging-changed', event => {
			ServiceProvider.game.camera.orbitControls.enabled = !event.value;
		});
	}

	private updateCameraPosition() {
		const mouseMovementX = ServiceProvider.game.inputManager.mouseState['mouseX'];

		// Handle rotation on Y axis (Mouse moving on X axis), rotate the whole body with its child objects
		if (mouseMovementX !== 0) {
			// I only need the direction in which the mouse was moved, so I transform the value to either 1 or -1
			const normalizedMovementX = mouseMovementX / Math.abs(mouseMovementX);

			// Rotate the whole player and its child objects on y axis
			const rotationY = mouseMovementX !== 0 ? normalizedMovementX * this.m_rotationSpeed * -1 : 0;

			this.transform.updateRotation({
				x: 0,
				y: rotationY,
				z: 0
			});
		}

		// Handle rotation on X axis (Mouse moving on Y axis), rotate only camera
		const mouseMovementY = ServiceProvider.game.inputManager.mouseState['mouseY'];

		if (mouseMovementY !== 0) {
			const normalizedMovementY = mouseMovementY / Math.abs(mouseMovementY);

			const cameraTransform = ServiceProvider.game.camera.transform;

			// Apply rotation constraints
			if (mouseMovementY < 0 && cameraTransform.getRotation().x > this.m_rotationTopBound) {
				cameraTransform.updateRotation({
					x: normalizedMovementY * this.m_rotationSpeed,
					y: 0,
					z: 0
				});
			}

			if (mouseMovementY > 0 && cameraTransform.getRotation().x < this.m_rotationBottomBound) {
				cameraTransform.updateRotation({
					x: normalizedMovementY * this.m_rotationSpeed,
					y: 0,
					z: 0
				});
			}
		}

		ServiceProvider.game.inputManager.resetMouseState();
	}

	private updateMovement() {
		const inputState = ServiceProvider.game.inputManager.inputState;

		if (inputState['ControlLeft']) {
			this.m_isSprintToggled = !this.m_isSprintToggled;
			this.m_movementSpeed = this.m_isSprintToggled ? this.m_sprintSpeed : this.m_walkingSpeed;
		}

		if (inputState['KeyW']) {
			this.transform.object3D.translateZ(this.m_movementSpeed * ServiceProvider.game.time.deltaTime);
			this.m_isMoving = true;
		}

		if (inputState['KeyS']) {
			this.transform.object3D.translateZ(-this.m_movementSpeed * ServiceProvider.game.time.deltaTime);
			this.m_isMoving = true;
		}

		if (inputState['KeyA']) {
			this.transform.object3D.translateX(this.m_movementSpeed * ServiceProvider.game.time.deltaTime);
			this.m_isMoving = true;
		}

		if (inputState['KeyD']) {
			this.transform.object3D.translateX(-this.m_movementSpeed * ServiceProvider.game.time.deltaTime);
			this.m_isMoving = true;
		}

		if (!inputState['KeyW'] && !inputState['KeyS'] && !inputState['KeyA'] && !inputState['KeyD']) {
			this.m_isMoving = false;
		}
	}

	private updateActions() {
		const playerCartesianPosition = this.transform.getCartesianPosition();

		const chunks = ServiceProvider.game.world.getChunks({
			x: playerCartesianPosition.x,
			z: playerCartesianPosition.z,
			radius: 1
		});

		const terrainEntities = chunks.flatMap(chunk => chunk.terrainEntities);

		const terrainEntitiesMeshes = terrainEntities.map(entity => entity.mesh);

		// Shoot a ray in the middle of the screen (THREE.Vector2(0, 0)), from camera position/rotation
		this.m_raycaster.setFromCamera(new THREE.Vector2(0, 0), ServiceProvider.game.camera.perspectiveCamera);

		const intersects = this.m_raycaster.intersectObjects(terrainEntitiesMeshes);

		// If nothing is being intersected reset all intersection state
		if (intersects.length === 0) {
			this.resetTerrainEntitiesIntersections(terrainEntities);
			ServiceProvider.game.audioManager.scanSound.stop();
			this.m_currentIntersectName = null;
			this.m_currentScanName = null;
			this.m_scanUI.scanIndicator.classList.remove('scanning');
			this.m_scanUI.scanCircleFill.classList.remove('scanning-fill');
			this.m_scanUI.scanCircleProgress.classList.remove('scanning-progress');
			return;
		}

		const closestIntersectName = intersects[0]?.object.parent?.name;

		if (!closestIntersectName) {
			console.error('Intersected terrain entity without a name');
			return;
		}

		// Check if new object is being intersected
		if (closestIntersectName !== this.m_currentIntersectName) {
			this.resetTerrainEntitiesIntersections(terrainEntities);

			this.m_currentIntersectName = closestIntersectName;
			this.m_currentScanName = null;

			const intersectedTerrainEntity = terrainEntities.find(
				entity => entity.identifier === this.m_currentIntersectName
			);

			if (intersectedTerrainEntity) {
				intersectedTerrainEntity.intersected = true;
			} else {
				console.error('Terrain entity intersected, but not found in TerrainEntities array');
			}
		}

		const mouseInputState = ServiceProvider.game.inputManager.mouseInputState;

		const intersectedTerrainEntity = terrainEntities.find(
			entity => entity.identifier === this.m_currentIntersectName
		);

		if (!intersectedTerrainEntity) {
			console.error('Terrain entity intersected, but not found in TerrainEntities array');
			return;
		}

		if (mouseInputState.mouseLeft && !intersectedTerrainEntity.scanned) {
			ServiceProvider.game.audioManager.scanSound.play();
			// Refresh scan start time if started to scan a new object
			if (this.m_currentIntersectName !== this.m_currentScanName) {
				this.m_currentScanName = this.m_currentIntersectName;
				this.m_scanStartTime = ServiceProvider.game.time.currentTime;
			}
			intersectedTerrainEntity.interacted = true;
			this.m_scanUI.scanIndicator.classList.add('scanning');
			this.m_scanUI.scanCircleFill.classList.add('scanning-fill');
			this.m_scanUI.scanCircleProgress.classList.add('scanning-progress');
			const currentTime = ServiceProvider.game.time.currentTime;

			if (currentTime - this.m_scanStartTime > this.m_scanDuration) {
				if (intersectedTerrainEntity) {
					intersectedTerrainEntity.scanned = true;
					intersectedTerrainEntity.interacted = false;
					this.trigger('scanned', [
						{ type: intersectedTerrainEntity.type, name: intersectedTerrainEntity.name }
					]);
					ServiceProvider.game.audioManager.scannedSound.play();
				}

				this.m_currentScanName = null;
			}

			return;
		}

		// Reset scan name so the scanning process would have to start again if player stop pressing mouse button
		ServiceProvider.game.audioManager.scanSound.stop();
		intersectedTerrainEntity.interacted = false;
		this.m_currentScanName = null;
		this.m_scanUI.scanIndicator.classList.remove('scanning');
		this.m_scanUI.scanCircleFill.classList.remove('scanning-fill');
		this.m_scanUI.scanCircleProgress.classList.remove('scanning-progress');
	}

	private resetTerrainEntitiesIntersections(terrainEntities: TerrainEntity[]) {
		terrainEntities.forEach(entity => {
			entity.intersected = false;
			entity.interacted = false;
		});
	}
}
