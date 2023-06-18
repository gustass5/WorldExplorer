import * as THREE from 'three';
import ServiceProvider from '../Game/Core/ServiceProvider';

export default class Renderer {
	// Reference to ThreeJs WebGL renderer
	private m_WebGLRenderer!: THREE.WebGLRenderer;
	public get WebGLRenderer() {
		return this.m_WebGLRenderer;
	}

	constructor() {
		this.createWebGLRenderer();
	}

	public update() {
		this.m_WebGLRenderer.render(ServiceProvider.game.scene, ServiceProvider.game.camera.perspectiveCamera);
	}

	public resize() {
		this.m_WebGLRenderer.setSize(ServiceProvider.game.viewport.width, ServiceProvider.game.viewport.height);
		this.m_WebGLRenderer.setPixelRatio(ServiceProvider.game.viewport.pixelRatio);
	}

	private createWebGLRenderer() {
		this.m_WebGLRenderer = new THREE.WebGLRenderer({
			canvas: ServiceProvider.game.canvas,
			antialias: true
		});

		// [NOTE]: Typescript shows an error that this property does not exist
		// this.m_WebGLRenderer.physicallyCorrectLights = true;
		this.m_WebGLRenderer.outputEncoding = THREE.sRGBEncoding;
		this.m_WebGLRenderer.toneMapping = THREE.CineonToneMapping;
		this.m_WebGLRenderer.toneMappingExposure = 1.75;
		this.m_WebGLRenderer.shadowMap.enabled = true;
		this.m_WebGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.m_WebGLRenderer.setSize(ServiceProvider.game.viewport.width, ServiceProvider.game.viewport.height);
		this.m_WebGLRenderer.setPixelRatio(ServiceProvider.game.viewport.pixelRatio);
		// this.m_WebGLRenderer.setClearColor('#2e89ff');
	}
}
