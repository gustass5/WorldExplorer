export class InputManager {
	private m_inputState: Record<string, boolean> = {};
	public get inputState() {
		return this.m_inputState;
	}

	private m_mouseState: { mouseX: number; mouseY: number } = {
		mouseX: 0,
		mouseY: 0
	};
	public get mouseState() {
		return this.m_mouseState;
	}

	private m_mouseInputState: { mouseLeft: boolean; mouseRight: boolean } = {
		mouseLeft: false,
		mouseRight: false
	};
	public get mouseInputState() {
		return this.m_mouseInputState;
	}

	constructor() {
		window.addEventListener('mousedown', event => {
			if (event.button === 0) {
				this.m_mouseInputState.mouseLeft = true;
			}

			if (event.button === 2) {
				this.m_mouseInputState.mouseRight = true;
			}
		});
		window.addEventListener('mouseup', event => {
			if (event.button === 0) {
				this.m_mouseInputState.mouseLeft = false;
			}

			if (event.button === 2) {
				this.m_mouseInputState.mouseRight = false;
			}
		});

		window.addEventListener('keydown', event => {
			this.m_inputState[event.code] = true;
		});

		window.addEventListener('keyup', event => {
			this.m_inputState[event.code] = false;
		});

		// window.addEventListener("pointerdown", (event) => {
		// });

		// window.addEventListener("pointerup", () => {});

		window.addEventListener('pointermove', event => {
			this.m_mouseState['mouseX'] = event.movementX;
			this.m_mouseState['mouseY'] = event.movementY;
		});
	}

	public resetMouseState() {
		this.m_mouseState['mouseX'] = 0;
		this.m_mouseState['mouseY'] = 0;
	}

	private resetInputs() {
		for (const key in this.m_inputState) {
			this.m_inputState[key] = false;
		}
	}
}
