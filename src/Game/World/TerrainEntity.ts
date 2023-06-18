import * as THREE from 'three';

import { Transform } from '../../Gravity/Components/Transform';
import { Random } from '../../Gravity/Random';

export type TerrainEntityType = 'tree' | 'rock' | 'grass' | 'cloud' | 'butterfly' | 'slime' | 'blob';

export class TerrainEntity {
	private m_type: TerrainEntityType;
	public get type() {
		return this.m_type;
	}
	private m_name: string;
	public get name() {
		return this.m_name;
	}

	private m_identifier;
	public get identifier() {
		return this.m_identifier;
	}

	private m_mesh!: THREE.Object3D;
	public get mesh() {
		return this.m_mesh;
	}

	private m_transform!: Transform;
	public get transform() {
		return this.m_transform;
	}

	private m_intersected = false;
	public get intersected() {
		return this.m_intersected;
	}
	public set intersected(_intersected: boolean) {
		this.m_intersected = _intersected;
	}

	private m_interacted = false;
	public get interacted() {
		return this.m_interacted;
	}
	public set interacted(_interacted: boolean) {
		this.m_interacted = _interacted;
	}

	private m_scanned = false;
	public get scanned() {
		return this.m_scanned;
	}
	public set scanned(_scanned: boolean) {
		this.m_scanned = _scanned;
	}

	private m_originalMaterials: THREE.Material[];
	private m_hoverMaterial = new THREE.MeshStandardMaterial({ color: 'yellow', flatShading: true });
	private m_scanMaterial = new THREE.MeshStandardMaterial({ color: 'cyan', flatShading: true });

	constructor(
		mesh: THREE.Object3D,
		position: { x: number; y: number; z: number },
		type: TerrainEntityType,
		name?: string
	) {
		this.m_type = type;
		this.m_name = name ?? type;
		this.m_identifier = Random.getId();
		this.m_mesh = mesh;
		this.m_mesh.name = this.m_identifier;
		this.m_transform = new Transform(this.m_mesh);
		this.m_transform.setPosition(position);

		this.m_originalMaterials = this.mesh.children.map(child => {
			if (child instanceof THREE.Mesh) {
				return child.material;
			}
			return null;
		});
	}

	public update() {
		this.handleIntersection();
	}

	private handleIntersection() {
		if (this.m_intersected) {
			if (this.m_interacted) {
				this.m_mesh.children.forEach(child => {
					if (child instanceof THREE.Mesh) {
						child.material = this.m_scanMaterial;
					}
				});
			} else {
				this.m_mesh.children.forEach((child, index) => {
					if (child instanceof THREE.Mesh && this.m_originalMaterials[index] !== null) {
						child.material = this.m_hoverMaterial;
					}
				});
			}
		} else {
			this.m_mesh.children.forEach((child, index) => {
				if (child instanceof THREE.Mesh && this.m_originalMaterials[index] !== null) {
					child.material = this.m_originalMaterials[index];
				}
			});
		}
	}

	public unload() {
		if (this.m_mesh) {
			this.m_mesh.children.forEach(child => {
				if (child instanceof THREE.Mesh) {
					child.material.dispose();
				}
			});
		}
	}
}
