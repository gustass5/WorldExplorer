import Chunk from './Chunk';
import Player from '../Player/Player';
import ServiceProvider from '../Core/ServiceProvider';
import * as THREE from 'three';
import { Sky } from './Sky/Sky';
import { TerrainEntityFactory } from './TerrainEntityFactory';

export default class World {
	private m_chunks: Record<string, Chunk> = {};

	private m_player: Player;
	public get player() {
		return this.m_player;
	}

	private m_playerPositionX!: number;
	private m_playerPositionZ!: number;

	private m_offsetInChunks = 4;

	private m_sky: Sky;

	private m_terrainEntityFactory: TerrainEntityFactory;

	private m_currentFogColor = new THREE.Color('white');
	private m_dayFogColor = new THREE.Color('white');
	private m_nightFogColor = new THREE.Color('black');

	constructor() {
		this.m_terrainEntityFactory = new TerrainEntityFactory();
		this.m_player = new Player();

		const playerCartesianPosition = this.m_player.transform.getCartesianPosition();
		this.m_playerPositionX = playerCartesianPosition.x;
		this.m_playerPositionZ = playerCartesianPosition.z;

		this.createWorld(this.m_playerPositionX, this.m_playerPositionZ);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
		ServiceProvider.game.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
		ServiceProvider.game.scene.add(directionalLight);

		this.m_sky = new Sky();

		ServiceProvider.game.scene.fog = new THREE.Fog(this.m_currentFogColor, 1, 6);
	}

	public update() {
		Object.values(this.m_chunks).forEach(chunk => chunk.update());

		const currentPLayerPositionX = this.m_player.transform.getPosition().x;
		const currentPLayerPositionZ = this.m_player.transform.getPosition().z;

		this.m_player.setElevation(
			Chunk.getElevation({
				x: currentPLayerPositionX,
				z: -currentPLayerPositionZ
			})
		);
		this.m_player.update();

		const posX = Math.floor(currentPLayerPositionX);
		const posZ = Math.floor(currentPLayerPositionZ);

		if (posX !== this.m_playerPositionX || posZ !== this.m_playerPositionZ) {
			this.createWorld(posX, posZ);
			this.m_playerPositionX = posX;
			this.m_playerPositionZ = posZ;
		}

		this.m_sky.update();

		if (ServiceProvider.game.scene.fog) {
			// Brighten the fog if the sun is coming up
			if (this.m_sky.sun.progress < 0.5) {
				this.m_currentFogColor.lerpColors(this.m_dayFogColor, this.m_nightFogColor, this.m_sky.sun.progress);
			} else {
				// Dim the fog if the sun is coming down
				this.m_currentFogColor.lerpColors(this.m_nightFogColor, this.m_dayFogColor, this.m_sky.sun.progress);
			}

			ServiceProvider.game.scene.fog.color = this.m_currentFogColor;
		}
	}

	public getChunks(parameters: { x: number; z: number; radius: number }) {
		// Clamp values between 0 and current offset
		const chunkRadius = parameters.radius < 0 ? 0 : Math.min(parameters.radius, this.m_offsetInChunks);

		const chunks = [];

		for (let x = parameters.x - chunkRadius; x <= parameters.x + chunkRadius; x++) {
			for (let z = parameters.z - chunkRadius; z <= parameters.z + chunkRadius; z++) {
				const key = this.getChunkKey(x, z);

				if (this.m_chunks[key] !== undefined) {
					chunks.push(this.m_chunks[key]);
				}
			}
		}

		return chunks;
	}

	private createWorld(posX: number, posZ: number) {
		// Create/Update chunks
		const newChunks: Record<string, Chunk> = {};
		for (let x = posX - this.m_offsetInChunks; x <= posX + this.m_offsetInChunks; x++) {
			for (let z = posZ - this.m_offsetInChunks; z <= posZ + this.m_offsetInChunks; z++) {
				// If already existing chunks are in range, set them again, no need to recreate them
				const key = this.getChunkKey(x, z);

				if (this.m_chunks[key] !== undefined) {
					newChunks[key] = this.m_chunks[key];
				} else {
					// Otherwise, create new chunk
					newChunks[key] = new Chunk(this.m_terrainEntityFactory, { x, z: z * -1 });
					ServiceProvider.game.scene.add(newChunks[key].mesh);
				}
			}
		}

		// Clear out of range chunks that were not included in current surrounding chunk object
		for (const key in this.m_chunks) {
			if (newChunks[key] === undefined) {
				ServiceProvider.game.scene.remove(this.m_chunks[key].mesh);
				this.m_chunks[key].unload();
			}
		}

		// Set new chunk object
		this.m_chunks = newChunks;
	}

	private getChunkKey(x: number, z: number) {
		return `${x}-${z}`;
	}
}
