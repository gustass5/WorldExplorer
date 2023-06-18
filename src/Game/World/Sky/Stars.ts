import * as THREE from 'three';

import starsVertexShader from '../../shaders/Stars/vertex.glsl';
import starsFragmentShader from '../../shaders/Stars/fragment.glsl';
import ServiceProvider from '../../Core/ServiceProvider';

export class Stars {
	private m_mesh: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
	public get mesh() {
		return this.m_mesh;
	}

	private m_distance = 0;

	private m_starsCount = 1000;

	constructor(distance: number) {
		this.m_distance = distance;

		const positionArray = new Float32Array(this.m_starsCount * 3);
		const sizeArray = new Float32Array(this.m_starsCount);
		const colorArray = new Float32Array(this.m_starsCount * 3);

		for (let i = 0; i < this.m_starsCount; i++) {
			const iStride3 = i * 3;

			// Position
			const position = new THREE.Vector3();
			position.setFromSphericalCoords(this.m_distance, Math.acos(Math.random()), 2 * Math.PI * Math.random());

			positionArray[iStride3] = position.x;
			positionArray[iStride3 + 1] = position.y;
			positionArray[iStride3 + 2] = position.z;

			// Size
			sizeArray[i] = Math.pow(Math.random() * 0.9, 10) + 0.1;

			// Color
			const color = new THREE.Color();
			color.setHSL(Math.random(), 1, 0.5 + Math.random() * 0.5);
			colorArray[iStride3] = color.r;
			colorArray[iStride3 + 1] = color.g;
			colorArray[iStride3 + 2] = color.b;
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3));
		geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizeArray, 1));
		geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colorArray, 3));

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uSunPosition: { value: new THREE.Vector3() },
				uSize: { value: 0.01 },
				uBrightness: { value: 0.5 },
				uHeightFragments: { value: null }
			},
			vertexShader: starsVertexShader,
			fragmentShader: starsFragmentShader
		});

		material.uniforms.uHeightFragments.value =
			ServiceProvider.game.viewport.height * ServiceProvider.game.viewport.pixelRatio;

		this.m_mesh = new THREE.Points(geometry, material);
	}

	public update(sunPosition: { x: number; y: number; z: number }) {
		this.m_mesh.material.uniforms.uSunPosition.value.set(sunPosition.x, sunPosition.y, sunPosition.z);

		this.m_mesh.material.uniforms.uHeightFragments.value =
			ServiceProvider.game.viewport.height * ServiceProvider.game.viewport.pixelRatio;
	}
}
