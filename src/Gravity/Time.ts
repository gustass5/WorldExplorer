import { EventEmitter } from '../Utilities/EventEmitter';

// [NOTE]: This is not specific to this ThreeJs project, this should become either utility or a part of a package?
export default class Time extends EventEmitter {
	// Time start date in milliseconds
	private m_startTime: number = 0;
	// Current time in milliseconds
	private m_currentTime: number = 0;
	public get currentTime() {
		return this.m_currentTime;
	}
	// Amount of milliseconds since the time started
	private m_elapsedTime: number = 0;
	public get elapsedTime() {
		return this.m_elapsedTime;
	}
	// Time in milliseconds since the last frame, 16 milliseconds is approximate time between frames when fps = 60. This is set as initial value instead of 0 to avoid potential bugs
	private m_deltaTime: number = 16;
	public get deltaTime() {
		return this.m_deltaTime;
	}

	constructor() {
		super();

		this.m_startTime = Date.now();
		this.m_currentTime = this.m_startTime;

		// Start the game loop
		requestAnimationFrame(() => {
			this.tick();
		});
	}

	tick() {
		const currentTime = Date.now();
		this.m_deltaTime = currentTime - this.m_currentTime;
		this.m_currentTime = currentTime;
		this.m_elapsedTime = this.m_currentTime - this.m_startTime;

		this.trigger('tick');

		requestAnimationFrame(() => {
			this.tick();
		});
	}
}
