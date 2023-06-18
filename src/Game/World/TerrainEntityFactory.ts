import * as THREE from 'three';

import { TreeBuilder } from './TerrainEntityBuilders/TreeBuilder';
import { RockBuilder } from './TerrainEntityBuilders/RockBuilder';
import { Random } from '../../Gravity/Random';
import { CloudBuilder } from './TerrainEntityBuilders/CloudBuilder';
import { GrassBuilder } from './TerrainEntityBuilders/GrassBuilder';
import { ButterflyBuilder } from './TerrainEntityBuilders/ButterflyBuilder';
import { SlimeBuilder } from './TerrainEntityBuilders/SlimeBuilder';
import { BlobBuilder } from './TerrainEntityBuilders/BlobBuilder';

export class TerrainEntityFactory {
	private m_treeBuilder = new TreeBuilder();
	private m_rockBuilder = new RockBuilder();
	private m_cloudBuilder = new CloudBuilder();
	private m_grassBuilder = new GrassBuilder();
	private m_butterflyBuilder = new ButterflyBuilder();
	private m_slimeBuilder = new SlimeBuilder();
	private m_blobBuilder = new BlobBuilder();

	// [TODO]: Provide world configuration
	constructor() {}

	public createTree(position: { x: number; y: number; z: number }) {
		const n = Random.getPseudoRandomNumber();
		const scale = Math.random() * 0.08;

		if (n < 0.3) {
			return this.m_treeBuilder.createBasicTree(position, scale);
		}

		if (n < 0.6) {
			return this.m_treeBuilder.createTallTree(position, scale);
		}

		return this.m_treeBuilder.createShortTree(position, scale);
	}

	public createRock(position: { x: number; y: number; z: number }) {
		const n = Random.getPseudoRandomNumber();
		const scale = Math.max(0.01, n * 0.05);

		if (n < 0.3) {
			return this.m_rockBuilder.createSingleRock(position, scale);
		}

		if (n < 0.6) {
			return this.m_rockBuilder.createDoubleRock(position, scale);
		}

		return this.m_rockBuilder.createTripleRock(position, scale);
	}

	public createCloud(position: { x: number; y: number; z: number }) {
		return this.m_cloudBuilder.createBasicCloud(position, Math.random() * 0.06 + 0.04);
	}

	public createGrass(position: { x: number; y: number; z: number }) {
		return this.m_grassBuilder.createBasicGrass(position, 0.01);
	}

	public createButterfly(position: { x: number; y: number; z: number }) {
		return this.m_butterflyBuilder.createBasicButterfly(position, 0.1);
	}

	public createSlime(position: { x: number; y: number; z: number }) {
		return this.m_slimeBuilder.createBasicSlime(position, 0.1);
	}

	public createBlob(position: { x: number; y: number; z: number }) {
		return this.m_blobBuilder.createBasicBlob(position, 0.1);
	}
}
