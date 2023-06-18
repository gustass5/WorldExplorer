import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import { Random } from '../../../Gravity/Random';
import { TerrainEntity, TerrainEntityType } from '../TerrainEntity';

export class GrassBuilder {
	private m_terrainEntityType: TerrainEntityType = 'grass';
	private m_terrainEntityName: string = 'Grass stem';
	private m_grassGeometry: THREE.BufferGeometry;
	private m_grassMaterial = new THREE.MeshLambertMaterial({ color: 'green' });

	constructor() {
		const stem1 = new THREE.ConeGeometry(0.3, 2, 3);
		const stem2 = new THREE.ConeGeometry(0.6, 2, 3);
		const stem3 = new THREE.ConeGeometry(0.4, 2, 3);

		stem1.translate(-0.5, 0, Random.getPseudoRandomNumber() * 0.6);
		stem1.rotateX(Random.getPseudoRandomNumber() * 0.3);
		stem2.translate(0, 0, Random.getPseudoRandomNumber() * 0.6);
		stem2.rotateZ(Random.getPseudoRandomNumber() * 0.3);
		stem3.translate(0.5, 0, Random.getPseudoRandomNumber() * 0.6);
		stem3.rotateX(Random.getPseudoRandomNumber() * 0.3);
		stem3.rotateZ(Random.getPseudoRandomNumber() * 0.3);

		this.m_grassGeometry = BufferGeometryUtils.mergeBufferGeometries([stem1, stem2, stem3]);
	}

	public createBasicGrass(position: { x: number; y: number; z: number }, scale: number) {
		const grass = new THREE.Group();

		const grassMesh = new THREE.Mesh(
			this.m_grassGeometry,
			// new THREE.MeshStandardMaterial({ color: 'darkgreen' })
			// new THREE.MeshBasicMaterial({ color: 0x001900 })
			// new THREE.MeshLambertMaterial({ color: 'green' })
			this.m_grassMaterial
		);
		grass.add(grassMesh);
		grass.scale.set(scale, scale, scale);
		grass.rotateY(Random.getPseudoRandomNumber() * Math.PI * 2);

		return new TerrainEntity(grass, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}
}
