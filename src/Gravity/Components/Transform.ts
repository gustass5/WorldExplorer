import * as THREE from 'three';

export class Transform {
	private m_object3D!: THREE.Object3D;
	public get object3D() {
		return this.m_object3D;
	}

	constructor(object3D: THREE.Object3D) {
		this.m_object3D = object3D;
	}

	public getPosition() {
		return this.m_object3D.position;
	}

	public getCartesianPosition() {
		return new THREE.Vector3(
			Math.floor(this.m_object3D.position.x),
			Math.floor(this.m_object3D.position.y),
			Math.floor(this.m_object3D.position.z)
		);
	}

	public updatePosition({ x, y, z }: { x: number; y: number; z: number }) {
		this.m_object3D.position.x += x;
		this.m_object3D.position.y += y;
		this.m_object3D.position.z += z;
	}

	public setPosition({ x, y, z }: { x: number; y: number; z: number }) {
		this.m_object3D.position.set(x, y, z);
	}

	public getRotation() {
		return this.m_object3D.rotation;
	}

	public updateRotation({ x, y, z }: { x: number; y: number; z: number }) {
		this.m_object3D.rotation.x += x;
		this.m_object3D.rotation.y += y;
		this.m_object3D.rotation.z += z;
	}

	public setRotation({ x, y, z }: { x: number; y: number; z: number }) {
		this.m_object3D.rotation.set(x, y, z);
	}
}
