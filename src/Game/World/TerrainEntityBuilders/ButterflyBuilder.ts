import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import { Random } from '../../../Gravity/Random';
import { TerrainEntity, TerrainEntityType } from '../TerrainEntity';

import butterflyVertexShader from '../../shaders/Butterfly/vertex.glsl';
import butterflyFragmentShader from '../../shaders/Butterfly/fragment.glsl';

export class ButterflyBuilder {
	private m_terrainEntityType: TerrainEntityType = 'butterfly';
	private m_terrainEntityName: string = 'Butterfly';
	private m_butterflyGeometry: THREE.BufferGeometry;
	private m_butterflyMaterial = new THREE.ShaderMaterial({
		vertexShader: butterflyVertexShader,
		fragmentShader: butterflyFragmentShader,
		uniforms: {
			uTime: { value: 0 }
		}
	});

	constructor() {
		const body = new THREE.BoxGeometry(0.1, 0.1, 1);
		const wing1 = new THREE.BoxGeometry(1, 0.1, 1);
		const wing2 = new THREE.BoxGeometry(1, 0.1, 1);

		wing1.rotateY(Math.PI * 0.25);
		wing1.translate(-0.75, 0, 0);
		wing2.rotateY(Math.PI * 0.25);
		wing2.translate(0.75, 0, 0);

		this.m_butterflyGeometry = BufferGeometryUtils.mergeBufferGeometries([body, wing1, wing2]);
	}

	public createBasicButterfly(position: { x: number; y: number; z: number }, scale: number) {
		const butterfly = new THREE.Group();

		const butterflyMesh = new THREE.Mesh(this.m_butterflyGeometry, this.m_butterflyMaterial);
		butterfly.add(butterflyMesh);
		butterfly.scale.set(scale, scale, scale);
		butterfly.rotateY(Random.getPseudoRandomNumber() * Math.PI * 2);

		return new TerrainEntity(butterfly, position, this.m_terrainEntityType, this.m_terrainEntityName);
	}
}
