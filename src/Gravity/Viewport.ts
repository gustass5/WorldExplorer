import ServiceProvider from '../Game/Core/ServiceProvider';
import { EventEmitter } from '../Utilities/EventEmitter';

export default class Viewport extends EventEmitter {
	// Playable area width
	private m_width: number = 0;
	public get width(): number {
		return this.m_width;
	}

	// Playable area height
	private m_height: number = 0;
	public get height(): number {
		return this.m_height;
	}

	// Virtual pixel ratio to actual pixels of the screen
	private m_pixelRatio: number = 1;
	public get pixelRatio(): number {
		return this.m_pixelRatio;
	}

	constructor() {
		super();
		this.setSize();

		window.addEventListener('resize', () => {
			this.setSize();
			this.trigger('resize');
		});
	}

	public setPointerLock() {
		ServiceProvider.game.canvas.requestPointerLock();
	}

	// Setting size its assumed that game screen fills the whole viewport
	private setSize() {
		// Get viewport parameters
		this.m_width = window.innerWidth;
		this.m_height = window.innerHeight;

		// Set pixel ratio, between 1 and 2, because more than that is bad for performance and is not really impactful
		this.m_pixelRatio = Math.min(window.devicePixelRatio, 2);
	}

	private setFullScreen() {}
}
