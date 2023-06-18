import * as THREE from 'three';

import { TerrainEntity, TerrainEntityType } from '../TerrainEntity';

export class RockBuilder {
	private m_terrainEntityType: TerrainEntityType = 'rock';
	private m_terrainEntityName: string = 'Rock';
	private m_rockGeometry = new THREE.IcosahedronGeometry();
	private m_rockMaterial = new THREE.MeshStandardMaterial({ color: 'gray', flatShading: true });

	constructor() {}

	public createSingleRock(position: { x: number; y: number; z: number }, scale: number) {
		const rock = new THREE.Group();

		const rockMesh = new THREE.Mesh(this.m_rockGeometry, this.m_rockMaterial);

		rock.add(rockMesh);
		rock.scale.set(scale, scale, scale);

		return new TerrainEntity(rock, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}

	public createDoubleRock(position: { x: number; y: number; z: number }, scale: number) {
		const rock = new THREE.Group();

		const rockMesh1 = new THREE.Mesh(this.m_rockGeometry, this.m_rockMaterial);
		rock.add(rockMesh1);

		const rockMesh2 = new THREE.Mesh(this.m_rockGeometry, this.m_rockMaterial);
		rockMesh2.position.x = 0.75;
		rockMesh2.scale.set(0.75, 0.75, 0.75);
		rock.add(rockMesh2);

		rock.scale.set(scale, scale, scale);

		return new TerrainEntity(rock, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}

	public createTripleRock(position: { x: number; y: number; z: number }, scale: number) {
		const rock = new THREE.Group();

		const rockMesh1 = new THREE.Mesh(this.m_rockGeometry, this.m_rockMaterial);
		rock.add(rockMesh1);

		const rockMesh2 = new THREE.Mesh(this.m_rockGeometry, this.m_rockMaterial);
		rockMesh2.position.x = 0.75;
		rockMesh2.scale.set(0.75, 0.75, 0.75);
		rock.add(rockMesh2);

		const rockMesh3 = new THREE.Mesh(this.m_rockGeometry, this.m_rockMaterial);
		rockMesh2.position.z = 1.5;
		rockMesh2.scale.set(1.5, 1.5, 1.5);
		rock.add(rockMesh3);

		rock.scale.set(scale, scale, scale);

		return new TerrainEntity(rock, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}
}
