import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import ServiceProvider from '../Game/Core/ServiceProvider';
import { Transform } from './Components/Transform';

export default class Camera {
	// Reference to ThreeJs perspective camera
	private m_perspectiveCamera!: THREE.PerspectiveCamera;
	public get perspectiveCamera() {
		return this.m_perspectiveCamera;
	}

	// Reference to ThreeJs orbit controls
	private m_orbitControls!: OrbitControls;
	public get orbitControls() {
		return this.m_orbitControls;
	}

	private m_transform!: Transform;
	public get transform() {
		return this.m_transform;
	}

	constructor() {
		this.createPerspectiveCamera();
		// this.createOrbitControls();
	}

	public update() {
		// this.m_orbitControls.update();
	}

	public resize() {
		this.m_perspectiveCamera.aspect = ServiceProvider.game.viewport.width / ServiceProvider.game.viewport.height;

		this.m_perspectiveCamera.updateProjectionMatrix();
	}

	private createPerspectiveCamera() {
		this.m_perspectiveCamera = new THREE.PerspectiveCamera(
			45,
			ServiceProvider.game.viewport.width / ServiceProvider.game.viewport.height,
			0.001,
			5000
		);

		this.m_transform = new Transform(this.m_perspectiveCamera);
	}

	private createOrbitControls() {
		this.m_orbitControls = new OrbitControls(this.m_perspectiveCamera, ServiceProvider.game.canvas as HTMLElement);

		this.m_orbitControls.enableDamping = true;
	}
}
