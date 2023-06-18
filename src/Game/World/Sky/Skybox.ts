import * as THREE from 'three';
import skyVertexShader from '../../shaders/Skybox/vertex.glsl';
import skyFragmentShader from '../../shaders/Skybox/fragment.glsl';

export class Skybox {
	private m_mesh!: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
	public get mesh() {
		return this.m_mesh;
	}

	constructor() {
		const geometry = new THREE.SphereGeometry(1000, 128, 64);

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uSunPosition: { value: new THREE.Vector3() },
				uAtmosphereElevation: { value: 0.5 },
				uAtmospherePower: { value: 10 },
				uColorDayCycleLow: { value: new THREE.Color('#f0fff9') },
				uColorDayCycleHigh: { value: new THREE.Color('#2e89ff') },
				uColorNightLow: { value: new THREE.Color('#004794') },
				uColorNightHigh: { value: new THREE.Color('#001624') },
				uDawnAngleAmplitude: { value: 1 },
				uDawnElevationAmplitude: { value: 0.2 },
				uColorDawn: { value: new THREE.Color('#ff1900') },
				uSunAmplitude: { value: 0.75 },
				uSunMultiplier: { value: 1 },
				uColorSun: { value: new THREE.Color('#ff531a') },
				uDayCycleProgress: { value: 0 }
			},
			vertexShader: skyVertexShader,
			fragmentShader: skyFragmentShader
		});

		material.side = THREE.BackSide;

		// material.wireframe = true;
		this.m_mesh = new THREE.Mesh(geometry, material);
	}

	public update(sunPosition: { x: number; y: number; z: number }, sunProgress: number) {
		this.m_mesh.material.uniforms.uSunPosition.value.set(
			// Reducing position values removed black sun effect. I have no idea what the effect happens and why this solution "fixes" it...
			sunPosition.x * 0.83,
			sunPosition.y * 0.83,
			sunPosition.z * 0.83
		);
		this.m_mesh.material.uniforms.uDayCycleProgress.value = sunProgress;
	}
}
