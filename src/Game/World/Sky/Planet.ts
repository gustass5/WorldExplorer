import * as THREE from 'three';
import { Random } from '../../../Gravity/Random';

import planetVertexShader from '../../shaders/Planet/vertex.glsl';
import planetFragmentShader from '../../shaders/Planet/fragment.glsl';

export class Planet {
	private m_mesh: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
	public get mesh() {
		return this.m_mesh;
	}

	private m_distance = 0;
	private m_height = 0;
	private m_radius = 0;

	private m_pointCount = 50000;

	constructor(distance: number, height: number, radius: number) {
		this.m_distance = distance;
		this.m_height = height;
		this.m_radius = radius;

		const positionArray = new Float32Array(this.m_pointCount * 3);

		for (let i = 0; i < this.m_pointCount; i++) {
			const iStep = i * 3;

			const a = Random.getPseudoRandomNumber() * Math.PI * 2;
			const r =
				this.m_radius *
				(1 -
					Random.getPseudoRandomNumber() *
						Random.getPseudoRandomNumber() *
						Random.getPseudoRandomNumber() *
						Random.getPseudoRandomNumber());
			positionArray[iStep + 0] = Math.sin(a) * r;
			positionArray[iStep + 1] = this.m_height + Math.cos(a) * r;

			positionArray[iStep + 2] = this.m_distance;
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3));

		const material = new THREE.ShaderMaterial({
			vertexShader: planetVertexShader,
			fragmentShader: planetFragmentShader
		});

		this.m_mesh = new THREE.Points(geometry, material);
	}
}
