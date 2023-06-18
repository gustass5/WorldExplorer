import * as THREE from 'three';

import terrainVertexShader from '../shaders/Terrain/vertex.glsl';
import terrainFragmentShader from '../shaders/Terrain/fragment.glsl';
import { Random } from '../../Gravity/Random';
import { TerrainEntityFactory } from './TerrainEntityFactory';
import { TerrainEntity } from './TerrainEntity';
import ServiceProvider from '../Core/ServiceProvider';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

export default class Chunk {
	private static m_textureLoader = new THREE.TextureLoader();
	private static m_fireflyParticles: {
		texture: THREE.Texture | null;
		geometry: THREE.BufferGeometry | null;
		material: THREE.PointsMaterial | null;
	} = { texture: null, geometry: null, material: null };

	private m_fireFlyParticlesMesh!: THREE.Points;

	private static m_risingParticles: {
		texture: THREE.Texture | null;
		geometry: THREE.BufferGeometry | null;
		material: THREE.PointsMaterial | null;
	} = { texture: null, geometry: null, material: null };

	private m_risingParticlesMesh!: THREE.Points;

	private static m_elevationModifier = 0.05;

	private static m_cutomUniforms = {
		uTime: { value: 0 }
	};

	private m_terrainEntityFactory: TerrainEntityFactory;

	private m_mesh!: THREE.Mesh;
	public get mesh() {
		return this.m_mesh;
	}

	private m_terrainEntities: TerrainEntity[] = [];
	public get terrainEntities() {
		return this.m_terrainEntities;
	}

	private m_butterflyName = '';
	private m_cloudName = '';
	private m_slimeName = '';
	private m_blobName = '';

	private m_blobYDirection: 'up' | 'down' = Math.random() < 0.5 ? 'up' : 'down';

	private m_grassMesh?: THREE.InstancedMesh;

	constructor(terrainEntityFactory: TerrainEntityFactory, position: { x: number; z: number }) {
		if (!Chunk.m_fireflyParticles.texture) {
			Chunk.m_fireflyParticles.texture = Chunk.m_textureLoader.load('textures/particles/1.png');
		}

		if (!Chunk.m_risingParticles.texture) {
			Chunk.m_risingParticles.texture = Chunk.m_textureLoader.load('textures/particles/12.png');
		}

		this.m_terrainEntityFactory = terrainEntityFactory;

		const size = 50;

		const geometry = new THREE.PlaneGeometry(1, 1, size, size);

		const planeVertices = geometry.attributes.position;

		for (let i = 0; i < (size + 1) * (size + 1); i++) {
			const i3 = i * 3;

			const planeVertexX = (planeVertices as THREE.BufferAttribute).array[i3 + 0];
			const planeVertexZ = (planeVertices as THREE.BufferAttribute).array[i3 + 1];
			const y = Chunk.getElevation({ x: position.x + planeVertexX, z: position.z + planeVertexZ });

			((planeVertices as THREE.BufferAttribute).array as any)[i3 + 2] += y;
		}

		geometry.rotateX(-Math.PI * 0.5);

		const material = new THREE.ShaderMaterial({
			vertexShader: terrainVertexShader,
			fragmentShader: terrainFragmentShader
			// wireframe: true
		});

		this.m_mesh = new THREE.Mesh(geometry, material);
		this.m_mesh.position.x += position.x;
		this.m_mesh.position.z -= position.z;

		this.addTrees();

		this.addRocks();

		this.addClouds();

		// this.addGrass();

		this.addInstancedGrass();

		this.addButterflies();

		this.addSlimes();

		this.addBlobs();

		this.createFireflyParticles();

		this.addFireflies();

		this.createRisingParticles();

		this.addRisingParticles();
	}

	public update() {
		Chunk.m_cutomUniforms.uTime.value = ServiceProvider.game.time.elapsedTime;

		this.m_terrainEntities.forEach(entity => entity.update());
		const butterfly = this.m_terrainEntities.find(e => e.identifier === this.m_butterflyName);
		butterfly?.mesh.translateZ(ServiceProvider.game.time.deltaTime * 0.0001);
		const cloud = this.m_terrainEntities.find(e => e.identifier === this.m_cloudName);
		cloud?.mesh.translateX(ServiceProvider.game.time.deltaTime * 0.00001);

		const slime = this.m_terrainEntities.find(e => e.identifier === this.m_slimeName);
		slime?.mesh.translateX(ServiceProvider.game.time.deltaTime * 0.00001);
		if (slime) {
			slime.mesh.position.y = Chunk.getElevation({
				x: slime?.mesh.position.x,
				z: -slime?.mesh.position.z
			});
		}

		const blob = this.m_terrainEntities.find(e => e.identifier === this.m_blobName);
		blob?.mesh.translateX(ServiceProvider.game.time.deltaTime * 0.00001);
		blob?.mesh.translateY(
			(this.m_blobYDirection === 'up' ? 1 : -1) * ServiceProvider.game.time.deltaTime * 0.00001
		);
		if (blob) {
			const currentBlobElevation = blob.mesh.position.y - blob.mesh.scale.y / 2;
			if (currentBlobElevation > 1) {
				this.m_blobYDirection = 'down';
			}

			if (
				currentBlobElevation <
				Chunk.getElevation({
					x: blob?.mesh.position.x,
					z: -blob?.mesh.position.z
				})
			) {
				this.m_blobYDirection = 'up';
			}
		}
	}

	public unload() {
		if (this.m_mesh) {
			this.m_mesh.geometry.dispose();

			this.m_terrainEntities.forEach(entity => {
				ServiceProvider.game.scene.remove(entity.mesh);
				entity.unload();
			});
		}

		if (this.m_fireFlyParticlesMesh) {
			ServiceProvider.game.scene.remove(this.m_fireFlyParticlesMesh);
		}

		if (this.m_risingParticlesMesh) {
			ServiceProvider.game.scene.remove(this.m_risingParticlesMesh);
		}

		if (this.m_grassMesh) {
			ServiceProvider.game.scene.remove(this.m_grassMesh);
		}
	}

	public static getElevation({ x, z }: { x: number; z: number }) {
		return Random.getNoiseValue(x, z) * Chunk.m_elevationModifier;
	}

	private addTrees() {
		const posX = this.m_mesh.position.x + Math.random() * 0.25;
		const posZ = this.m_mesh.position.z + Math.random() * 0.25;
		const tree = this.m_terrainEntityFactory.createTree({
			x: posX,
			y: Chunk.getElevation({ x: posX, z: -posZ }) - 0.01,
			z: posZ
		});

		this.m_terrainEntities.push(tree);
		ServiceProvider.game.scene.add(tree.mesh);
	}

	private addRocks() {
		const rock = this.m_terrainEntityFactory.createRock({
			x: this.m_mesh.position.x + 0.5,
			y: Chunk.getElevation({ x: this.m_mesh.position.x + 0.5, z: -(this.m_mesh.position.z + 0.5) }),
			z: this.m_mesh.position.z + 0.5
		});

		this.m_terrainEntities.push(rock);
		ServiceProvider.game.scene.add(rock.mesh);
	}

	private addClouds() {
		if (Math.random() < 0.5) {
			const cloud = this.m_terrainEntityFactory.createCloud({
				x: this.m_mesh.position.x + 0.5,
				y: Math.random() * 2 + 0.8,
				z: this.m_mesh.position.z + 0.5
			});

			this.m_terrainEntities.push(cloud);
			this.m_cloudName = cloud.identifier;
			ServiceProvider.game.scene.add(cloud.mesh);
		}
	}

	private addGrass() {
		for (let i = 0; i <= 10; i++) {
			for (let j = 0; j <= 10; j++) {
				const posX = this.m_mesh.position.x + 0.1 * i * Math.random();
				const posZ = this.m_mesh.position.z + 0.1 * j * Math.random();
				const grass = this.m_terrainEntityFactory.createGrass({
					x: posX,
					y: Chunk.getElevation({
						x: posX,
						z: -posZ
					}),
					z: posZ
				});

				this.m_terrainEntities.push(grass);
				ServiceProvider.game.scene.add(grass.mesh);
			}
		}
	}

	private addInstancedGrass() {
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

		const grassGeometry = BufferGeometryUtils.mergeBufferGeometries([stem1, stem2, stem3]);

		// grassGeometry.scale(0.01, 0.01, 0.01);
		const count = 30;
		const grassMaterial = new THREE.MeshLambertMaterial({ color: 'green' });

		grassMaterial.onBeforeCompile = shader => {
			shader.uniforms.uTime = Chunk.m_cutomUniforms.uTime;
			shader.vertexShader = shader.vertexShader.replace(
				'#include <common>',
				`
			#include <common>

			uniform float uTime;

			mat4 rotationMatrix(vec3 axis, float angle) {
				axis = normalize(axis);
				float s = sin(angle);
				float c = cos(angle);
				float oc = 1.0 - c;
			
				return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
						oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
						oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
						0.0,                                0.0,                                0.0,                                1.0);
			}

			vec3 rotate(vec3 v, vec3 axis, float angle) {
				mat4 m = rotationMatrix(axis, angle);
				return (m * vec4(v, 1.0)).xyz;
			}

			const vec3 rotationAxis = vec3(0.0, 0.0, 1.0);
			`
			);

			shader.vertexShader = shader.vertexShader.replace(
				'#include <begin_vertex>',
				`
				#include <begin_vertex>

				// Calculate the scaled rotation angle based on time
				float angle = sin(uTime * 0.001) * 0.3;
		
				transformed = rotate(transformed, rotationAxis, angle);
			`
			);
		};

		this.m_grassMesh = new THREE.InstancedMesh(grassGeometry, grassMaterial, count * count);

		this.m_grassMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
		for (let i = 0; i < count; i++) {
			for (let j = 0; j < count; j++) {
				const posX = this.m_mesh.position.x + i * 0.04 + 0.1 * Math.random();
				const posZ = this.m_mesh.position.z + j * 0.04 + 0.05 * Math.random();

				const position = new THREE.Vector3(
					posX,
					Chunk.getElevation({
						x: posX,
						z: -posZ
					}),
					posZ
				);

				const quaternion = new THREE.Quaternion();
				quaternion.setFromEuler(new THREE.Euler(0, (Math.random() - 0.5) * Math.PI * 1, 0));

				const matrix = new THREE.Matrix4();
				matrix.makeRotationFromQuaternion(quaternion);
				matrix.setPosition(position);
				matrix.scale(new THREE.Vector3(0.008, 0.0075 * Math.random() + 0.005, 0.008));
				this.m_grassMesh.setMatrixAt(i * count + j, matrix);
			}
		}

		ServiceProvider.game.scene.add(this.m_grassMesh);
	}

	private addButterflies() {
		if (Math.random() < 0.2) {
			const butterfly = this.m_terrainEntityFactory.createButterfly({
				x: this.m_mesh.position.x + 0.5,
				y: Math.random() + 3,
				z: this.m_mesh.position.z + 0.5
			});
			this.m_terrainEntities.push(butterfly);
			this.m_butterflyName = butterfly.identifier;
			ServiceProvider.game.scene.add(butterfly.mesh);
		}
	}

	private addSlimes() {
		if (Math.random() < 0.05) {
			const slime = this.m_terrainEntityFactory.createSlime({
				x: this.m_mesh.position.x + 0.5,
				y: Chunk.getElevation({
					x: this.m_mesh.position.x + 0.5,
					z: -(this.m_mesh.position.y + 0.5)
				}),
				z: this.m_mesh.position.z + 0.5
			});
			this.m_terrainEntities.push(slime);
			this.m_slimeName = slime.identifier;
			ServiceProvider.game.scene.add(slime.mesh);
		}
	}

	private addBlobs() {
		if (Math.random() < 0.1) {
			const blob = this.m_terrainEntityFactory.createBlob({
				x: this.m_mesh.position.x + 0.5,
				y: Math.random() * 0.75,
				z: this.m_mesh.position.z + 0.5
			});
			this.m_terrainEntities.push(blob);
			this.m_blobName = blob.identifier;
			ServiceProvider.game.scene.add(blob.mesh);
		}
	}

	private createFireflyParticles() {
		if (!Chunk.m_fireflyParticles.geometry) {
			const count = 10;
			Chunk.m_fireflyParticles.geometry = new THREE.BufferGeometry();

			const positions = new Float32Array(count * 3);
			const colors = new Float32Array(count * 3);
			const directions = new Float32Array(count);

			for (let i = 0; i < count; i++) {
				const i3 = i * 3;
				positions[i3 + 0] = Math.random();
				positions[i3 + 1] = Math.random();
				positions[i3 + 2] = Math.random();

				colors[i3 + 0] = 1;
				colors[i3 + 1] = 1;
				colors[i3 + 2] = 0;

				directions[i] = Math.random() < 0.5 ? 1 : -1;
			}

			Chunk.m_fireflyParticles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

			Chunk.m_fireflyParticles.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
			Chunk.m_fireflyParticles.geometry.setAttribute('aDirection', new THREE.BufferAttribute(directions, 1));
		}

		if (!Chunk.m_fireflyParticles.material) {
			Chunk.m_fireflyParticles.material = new THREE.PointsMaterial({
				size: 0.1 * Math.random() + 0.05,
				sizeAttenuation: true,
				transparent: true,
				alphaMap: Chunk.m_fireflyParticles.texture,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				vertexColors: true
			});

			Chunk.m_fireflyParticles.material.onBeforeCompile = shader => {
				shader.uniforms.uTime = Chunk.m_cutomUniforms.uTime;
				shader.vertexShader = shader.vertexShader.replace(
					'#include <common>',
					`
				#include <common>

				uniform float uTime;
				
				attribute float aDirection;

				`
				);

				shader.vertexShader = shader.vertexShader.replace(
					'#include <begin_vertex>',
					`
				#include <begin_vertex>

				transformed.x +=  abs(2.0 * ((uTime * 0.00001) - floor((uTime * 0.00001) + 0.5))) - 0.5 * aDirection;
				transformed.y +=  abs(2.0 * ((uTime * 0.00001) - floor((uTime * 0.00001) + 0.5))) - 0.5 * aDirection;
				transformed.z +=  abs(2.0 * ((uTime * 0.00001) - floor((uTime * 0.00001) + 0.5))) - 0.5 * aDirection;
				
				`
				);
				shader.vertexShader = shader.vertexShader.replace(
					'gl_PointSize = size;',
					`
				float duration = 1000.0;
				float wait = 2000.0;
				

				float newScale;

				float intervalIndex = floor(uTime / (2.0 * (duration + wait)));

				// Calculate the time within the current interval
				float intervalTime = mod(uTime, 2.0 * (duration + wait));
			
				// If intervalTime is within the wait time, set scale to 1.0
				if (intervalTime < wait) {
					newScale = 1.0;
				} else if (intervalTime < duration + wait) {
					// If intervalTime is within the transition from 1.0 to 0.0

					float transitionTime = intervalTime - wait;
					newScale = 1.0 - smoothstep(0.0, duration, transitionTime);
				} else if (intervalTime < 2.0 * duration + wait) {
					// If intervalTime is within the wait time after the transition, set scale to 0.0

					newScale = 0.0;
				} else {
					// If intervalTime is within the transition from 0.0 to 1.0
					
					float transitionTime = intervalTime - (2.0 * duration + wait);
					newScale = smoothstep(0.0, duration, transitionTime);
				}

				gl_PointSize = size * newScale;
				
				`
				);
			};
		}
	}

	private addFireflies() {
		// Points
		if (!Chunk.m_fireflyParticles.geometry || !Chunk.m_fireflyParticles.material) {
			console.warn('Error when creating particles');
			return;
		}

		this.m_fireFlyParticlesMesh = new THREE.Points(
			Chunk.m_fireflyParticles.geometry,
			Chunk.m_fireflyParticles.material
		);

		this.m_fireFlyParticlesMesh.position.x += this.m_mesh.position.x;
		this.m_fireFlyParticlesMesh.position.y += (Math.random() - 0.5) * 0.4;
		this.m_fireFlyParticlesMesh.position.z += this.m_mesh.position.z;

		ServiceProvider.game.scene.add(this.m_fireFlyParticlesMesh);
	}

	private createRisingParticles() {
		if (!Chunk.m_risingParticles.geometry) {
			const count = 8;
			Chunk.m_risingParticles.geometry = new THREE.BufferGeometry();

			const positions = new Float32Array(count * 3);
			const colors = new Float32Array(count * 3);
			const offset = new Float32Array(count);

			for (let i = 0; i < count; i++) {
				const i3 = i * 3;
				positions[i3 + 0] = Math.random();
				positions[i3 + 1] = Math.random();
				positions[i3 + 2] = Math.random();

				colors[i3 + 0] = 41 / 255;
				colors[i3 + 1] = 230 / 255;
				colors[i3 + 2] = 135 / 255;

				offset[i] = Math.random() * 3;
			}

			Chunk.m_risingParticles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

			Chunk.m_risingParticles.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

			Chunk.m_risingParticles.geometry.setAttribute('aOffset', new THREE.BufferAttribute(offset, 1));
		}

		if (!Chunk.m_risingParticles.material) {
			Chunk.m_risingParticles.material = new THREE.PointsMaterial({
				size: 0.1 * Math.random() + 0.1,
				sizeAttenuation: true,
				transparent: true,
				alphaMap: Chunk.m_risingParticles.texture,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				vertexColors: true
			});

			Chunk.m_risingParticles.material.onBeforeCompile = shader => {
				shader.uniforms.uTime = Chunk.m_cutomUniforms.uTime;
				shader.vertexShader = shader.vertexShader.replace(
					'#include <common>',
					`
					#include <common>
	
					uniform float uTime;

					attribute float aOffset;
					
					`
				);

				shader.vertexShader = shader.vertexShader.replace(
					'#include <begin_vertex>',
					`
					#include <begin_vertex>
	
					// transformed.y += sin((uTime) * 0.00001);
					transformed.y = abs(2.0*((uTime * 0.00004 ) - floor(uTime * 0.00004))) + aOffset;
					// transformed.y += abs(2.0 * (uTime * 0.00001 - floor(uTime * 0.00001 + 0.5)));
					
					`
				);
				shader.vertexShader = shader.vertexShader.replace(
					'gl_PointSize = size;',
					`
					gl_PointSize = size;
					
					`
				);
			};
		}
	}

	private addRisingParticles() {
		// Points
		if (!Chunk.m_risingParticles.geometry || !Chunk.m_risingParticles.material) {
			console.warn('Error when creating particles');
			return;
		}

		this.m_risingParticlesMesh = new THREE.Points(
			Chunk.m_risingParticles.geometry,
			Chunk.m_risingParticles.material
		);

		this.m_risingParticlesMesh.position.x += this.m_mesh.position.x;
		this.m_risingParticlesMesh.position.y -= Math.random() * 0.5;
		this.m_risingParticlesMesh.position.z += this.m_mesh.position.z;

		ServiceProvider.game.scene.add(this.m_risingParticlesMesh);
	}
}
