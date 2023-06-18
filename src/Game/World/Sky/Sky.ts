import ServiceProvider from '../../Core/ServiceProvider';
import * as THREE from 'three';

import { Sun } from './Sun';
import { Skybox } from './Skybox';
import { Stars } from './Stars';
import { Planet } from './Planet';

export class Sky {
	private m_skyGroup: THREE.Group = new THREE.Group();

	private m_sun: Sun;
	public get sun() {
		return this.m_sun;
	}

	private m_skybox: Skybox;

	private m_stars: Stars;

	private m_planet: Planet;

	private m_outerDistance = 300;

	constructor() {
		this.m_sun = new Sun(this.m_outerDistance - 100);
		this.m_skyGroup.add(this.m_sun.mesh);

		this.m_skybox = new Skybox();
		this.m_skyGroup.add(this.m_skybox.mesh);

		this.m_stars = new Stars(this.m_outerDistance - 250);
		this.m_skyGroup.add(this.m_stars.mesh);

		this.m_planet = new Planet(this.m_outerDistance - 50, 50, 100);
		this.m_skyGroup.add(this.m_planet.mesh);

		ServiceProvider.game.scene.add(this.m_skyGroup);
	}

	public update() {
		this.m_sun.update();

		this.m_skybox.update(this.m_sun.position, this.m_sun.progress);

		this.m_stars.update(this.m_sun.position);
	}
}
