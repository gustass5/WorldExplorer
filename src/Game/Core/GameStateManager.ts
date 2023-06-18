import ServiceProvider from './ServiceProvider';

export class GameStateManager {
	private m_delayUntilBlur = 3000;
	private m_delayUntilControlUnlock = 3000;

	private m_gameStarted = false;
	public get gameStarted() {
		return this.m_gameStarted;
	}

	private m_gamePaused = false;
	public get gamePaused() {
		return this.m_gamePaused;
	}

	private m_controlsLocked = true;
	public get controlsLocked() {
		return this.m_controlsLocked;
	}

	constructor() {
		// To set pointer lock user has to do an action
		ServiceProvider.game.UIManager.startButtonElement.addEventListener('click', () => {
			this.startGame();
		});

		ServiceProvider.game.UIManager.pauseButtonElement.addEventListener('click', () => {
			this.unpauseGame();
		});

		document.addEventListener('keydown', event => {
			if (event.code === 'Escape') {
				this.pauseGame();
			}
		});

		document.addEventListener('pointerlockchange', () => {
			if (document.pointerLockElement === null) {
				this.pauseGame();
			}
		});
	}

	public startGame() {
		if (this.m_gameStarted) {
			console.warn('Trying to start the game when it is already started');
			return;
		}

		setTimeout(() => {
			ServiceProvider.game.audioManager.textSound.play();
			setTimeout(() => {
				ServiceProvider.game.audioManager.textSoundSpedUp.play();
			}, 3700);
		}, 200);

		ServiceProvider.game.viewport.setPointerLock();

		ServiceProvider.game.UIManager.loadDescription();

		setTimeout(() => {
			ServiceProvider.game.UIManager.blurOutOverlay();
			this.m_gameStarted = true;

			ServiceProvider.game.audioManager.backgroundMusic.play();

			setTimeout(() => {
				ServiceProvider.game.UIManager.removeOverlay();
				this.unlockControls();

				// Delay to let the world appear and settle until unlocking the controls
			}, this.m_delayUntilControlUnlock);

			// Delay to let description animation to finish while still having black background
		}, this.m_delayUntilBlur);
	}

	public pauseGame() {
		ServiceProvider.game.audioManager.backgroundMusic.pause();

		ServiceProvider.game.UIManager.showPauseScreen();

		this.m_gamePaused = true;
		this.lockControls();
	}

	public unpauseGame() {
		ServiceProvider.game.audioManager.backgroundMusic.play();

		ServiceProvider.game.viewport.setPointerLock();
		ServiceProvider.game.UIManager.hidePauseScreen();
		this.m_gamePaused = false;
		this.unlockControls();
	}

	public lockControls() {
		ServiceProvider.game.UIManager.hideCrosshair();
		this.m_controlsLocked = true;
	}

	public unlockControls() {
		ServiceProvider.game.UIManager.showCrosshair();
		this.m_controlsLocked = false;
	}
}
