import alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { v4 } from 'uuid';

export class Random {
	private static m_seed = 'seed';
	public static get seed() {
		return Random.m_seed;
	}

	private static m_randomGenerator = alea(Random.m_seed);
	public static get randomGenerator() {
		return Random.m_randomGenerator;
	}

	private static m_noise2D = createNoise2D(Random.m_randomGenerator);
	public static get noise2D() {
		return Random.m_noise2D;
	}

	public static setSeed(seed: string) {
		Random.m_seed = seed;
		Random.m_randomGenerator = alea(Random.m_seed);
		Random.m_noise2D = createNoise2D(Random.m_randomGenerator);
	}

	public static getPseudoRandomNumber() {
		return Random.m_randomGenerator();
	}

	public static getRandomNumber() {
		return Math.random();
	}

	public static getId() {
		return v4();
	}

	public static getNoiseValue(x: number, y: number) {
		return Random.m_noise2D(x, y);
	}
}
