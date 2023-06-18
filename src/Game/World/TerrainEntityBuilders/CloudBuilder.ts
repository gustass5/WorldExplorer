import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import { Random } from '../../../Gravity/Random';
import { TerrainEntity, TerrainEntityType } from '../TerrainEntity';

export class CloudBuilder {
	private m_terrainEntityType: TerrainEntityType = 'cloud';
	private m_terrainEntityName: string = 'Cloud';
	private m_cloudGeometry: THREE.BufferGeometry;
	private m_cloudMaterial = new THREE.MeshStandardMaterial({ flatShading: true });

	constructor() {
		const puff1 = new THREE.SphereGeometry(1.2, 7, 7);
		const puff2 = new THREE.SphereGeometry(1.5, 7, 7);
		const puff3 = new THREE.SphereGeometry(0.9, 7, 7);

		puff1.translate(-1.85, Random.getPseudoRandomNumber() * 0.3, 0);
		puff2.translate(0, Random.getPseudoRandomNumber() * 0.3, 0);
		puff3.translate(1.85, Random.getPseudoRandomNumber() * 0.3, 0);

		this.m_cloudGeometry = BufferGeometryUtils.mergeBufferGeometries([puff1, puff2, puff3]);
	}

	public createBasicCloud(position: { x: number; y: number; z: number }, scale: number) {
		const cloud = new THREE.Group();

		const cloudMesh = new THREE.Mesh(this.m_cloudGeometry, this.m_cloudMaterial);
		cloud.add(cloudMesh);
		cloud.scale.set(scale, scale, scale);
		cloud.rotateY(Random.getPseudoRandomNumber() * Math.PI * 2);

		return new TerrainEntity(cloud, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}
}
