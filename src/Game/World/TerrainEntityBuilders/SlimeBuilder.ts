import * as THREE from 'three';
import { Random } from '../../../Gravity/Random';
import { TerrainEntity, TerrainEntityType } from '../TerrainEntity';

export class SlimeBuilder {
	private m_terrainEntityType: TerrainEntityType = 'slime';
	private m_terrainEntityName: string = 'Moving slime';
	private m_slimeGeometry: THREE.CapsuleGeometry = new THREE.CapsuleGeometry(1, 0.1, 2);
	private m_slimeMaterial = new THREE.MeshStandardMaterial({
		color: 'purple',
		flatShading: true,
		transparent: true,
		opacity: 0.75
	});

	constructor() {}

	public createBasicSlime(position: { x: number; y: number; z: number }, scale: number) {
		const slime = new THREE.Group();

		const slimeMesh = new THREE.Mesh(this.m_slimeGeometry, this.m_slimeMaterial);
		slime.add(slimeMesh);
		slime.scale.set(scale, scale, scale);
		slime.rotateY(Random.getPseudoRandomNumber() * Math.PI * 2);

		return new TerrainEntity(slime, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}
}
