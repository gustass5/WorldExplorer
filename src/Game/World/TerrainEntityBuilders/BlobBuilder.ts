import * as THREE from 'three';
import { Random } from '../../../Gravity/Random';
import { TerrainEntity, TerrainEntityType } from '../TerrainEntity';

export class BlobBuilder {
	private m_terrainEntityType: TerrainEntityType = 'blob';
	private m_terrainEntityName: string = 'Flying blob mass';
	private m_blobGeometry: THREE.CapsuleGeometry = new THREE.CapsuleGeometry(1, 0.1, 2);
	private m_blobMaterial = new THREE.MeshStandardMaterial({
		color: 'yellow',
		flatShading: true,
		transparent: true,
		opacity: 0.65
	});

	constructor() {}

	public createBasicBlob(position: { x: number; y: number; z: number }, scale: number) {
		const blob = new THREE.Group();

		const blobMesh = new THREE.Mesh(this.m_blobGeometry, this.m_blobMaterial);
		blob.add(blobMesh);
		blob.scale.set(scale, scale, scale);
		blob.rotateY(Random.getPseudoRandomNumber() * Math.PI * 2);

		return new TerrainEntity(blob, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}
}
