import * as THREE from 'three';
import ServiceProvider from '../../Core/ServiceProvider';

export class Sun {
	private m_position = { x: 0, y: 0, z: 0 };
	public get position() {
		return this.m_position;
	}

	private m_mesh!: THREE.Mesh;
	public get mesh() {
		return this.m_mesh;
	}

	// Spherical coordinates
	private m_theta = Math.PI * 0.8; // All around the sphere
	private m_phi = Math.PI * 0.45; // Elevation

	private m_timeProgress = 0;
	private m_progress = 0;
	public get progress() {
		return this.m_progress;
	}

	private m_distance = 0;

	constructor(distance: number) {
		this.m_distance = distance;
		const geometry = new THREE.CircleGeometry(0.02 * this.m_distance, 32);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		this.m_mesh = new THREE.Mesh(geometry, material);
	}

	public update() {
		// Update sun position in spherical coordinates
		this.m_timeProgress += ServiceProvider.game.time.deltaTime / (30 * 1000); // 30 = Duration

		this.m_progress = this.m_timeProgress % 1;
		const angle = -(this.m_progress + 0.25) * Math.PI * 2;
		this.m_phi = (Math.sin(angle) * 0.3 + 0.5) * Math.PI;
		this.m_theta = (Math.cos(angle) * 0.3 + 0.5) * Math.PI;

		const sinPhiRadius = Math.sin(this.m_phi);

		this.m_position.x = sinPhiRadius * Math.sin(this.m_theta);
		this.m_position.y = Math.cos(this.m_phi);
		this.m_position.z = sinPhiRadius * Math.cos(this.m_theta);

		this.m_mesh.position.set(
			this.position.x * this.m_distance,
			this.position.y * this.m_distance,
			this.position.z * this.m_distance
		);

		// Face the mesh of the sun to the player
		const playerTransform = ServiceProvider.game.world.player.transform;
		this.m_mesh.lookAt(
			playerTransform.getPosition().x,
			playerTransform.getPosition().y,
			playerTransform.getPosition().z
		);
	}
}
