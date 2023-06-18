import * as THREE from 'three';
import { TerrainEntity, TerrainEntityType } from '../TerrainEntity';

export class TreeBuilder {
	private m_terrainEntityType: TerrainEntityType = 'tree';
	private m_terrainEntityName: string = 'Tree';
	private m_leavesGeometry = new THREE.IcosahedronGeometry(1, 1);
	private m_leavesMaterial = new THREE.MeshStandardMaterial({ color: 'green' });

	private m_trunkGeometry = new THREE.CylinderGeometry();
	private m_trunkMaterial = new THREE.MeshStandardMaterial({ color: 'brown' });

	constructor() {}

	public createBasicTree(position: { x: number; y: number; z: number }, scale: number) {
		const tree = new THREE.Group();

		const leaves = new THREE.Mesh(this.m_leavesGeometry, this.m_leavesMaterial);

		leaves.material.flatShading = true;
		leaves.position.y = 6;
		leaves.scale.set(5, 5, 5);
		tree.add(leaves);

		const trunk = new THREE.Mesh(this.m_trunkGeometry, this.m_trunkMaterial);
		trunk.position.y = 1;
		trunk.scale.y = 2;
		tree.add(trunk);
		tree.scale.set(scale, scale, scale);
		return new TerrainEntity(tree, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}

	public createTallTree(position: { x: number; y: number; z: number }, scale: number) {
		const tree = new THREE.Group();

		const leaves = new THREE.Mesh(this.m_leavesGeometry, this.m_leavesMaterial);
		leaves.material.flatShading = true;
		leaves.position.y = 8;
		leaves.scale.set(3, 6, 3);
		tree.add(leaves);

		const trunk = new THREE.Mesh(this.m_trunkGeometry, this.m_trunkMaterial);
		trunk.position.y = 2;
		trunk.scale.y = 4;
		tree.add(trunk);
		tree.scale.set(scale, scale, scale);

		return new TerrainEntity(tree, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}

	public createShortTree(position: { x: number; y: number; z: number }, scale: number) {
		const tree = new THREE.Group();

		const leaves = new THREE.Mesh(this.m_leavesGeometry, this.m_leavesMaterial);
		leaves.material.flatShading = true;
		leaves.position.y = 2;
		leaves.scale.set(3, 2, 3);
		tree.add(leaves);
		leaves.material.flatShading = true;

		const trunk = new THREE.Mesh(this.m_trunkGeometry, this.m_trunkMaterial);
		trunk.position.y = 1;
		trunk.scale.set(0.5, 2, 0.5);
		tree.add(trunk);
		tree.scale.set(scale, scale, scale);

		return new TerrainEntity(tree, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}
}
