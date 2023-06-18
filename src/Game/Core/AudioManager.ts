import * as THREE from 'three';

export class AudioManager {
	private m_listener = new THREE.AudioListener();

	private m_backgroundMusic = new THREE.Audio(this.m_listener);
	public get backgroundMusic() {
		return this.m_backgroundMusic;
	}

	private m_scanSound = new THREE.Audio(this.m_listener);
	public get scanSound() {
		return this.m_scanSound;
	}
	private m_scannedSound = new THREE.Audio(this.m_listener);
	public get scannedSound() {
		return this.m_scannedSound;
	}

	private m_textSound = new THREE.Audio(this.m_listener);
	public get textSound() {
		return this.m_textSound;
	}

	private m_textSoundSpedUp = new THREE.Audio(this.m_listener);
	public get textSoundSpedUp() {
		return this.m_textSoundSpedUp;
	}

	private m_walkingSound = new THREE.Audio(this.m_listener);
	public get walkingSound() {
		return this.m_walkingSound;
	}

	private m_menuSound = new THREE.Audio(this.m_listener);
	public get menuSound() {
		return this.m_menuSound;
	}

	private m_audioLoader = new THREE.AudioLoader();

	constructor() {
		this.m_audioLoader.load('sounds/background_music.mp3', buffer => {
			this.m_backgroundMusic.setBuffer(buffer);
			this.m_backgroundMusic.setLoop(true);
			this.m_backgroundMusic.setVolume(0.3);
		});

		this.m_audioLoader.load('sounds/text_sound_cut.mp3', buffer => {
			this.m_textSound.setBuffer(buffer);
			this.m_textSound.setLoop(false);
		});

		this.m_audioLoader.load('sounds/text_sound_sped_up_2.mp3', buffer => {
			this.textSoundSpedUp.setBuffer(buffer);
			this.textSoundSpedUp.setLoop(false);
		});

		this.m_audioLoader.load('sounds/scan_sound_cut.mp3', buffer => {
			this.m_scanSound.setBuffer(buffer);
			this.m_scanSound.setLoop(false);
		});

		this.m_audioLoader.load('sounds/scanned_sound_cut.mp3', buffer => {
			this.m_scannedSound.setBuffer(buffer);
			this.m_scannedSound.setLoop(false);
		});
		this.m_audioLoader.load('sounds/walking_sound.mp3', buffer => {
			this.m_walkingSound.setBuffer(buffer);
			this.m_walkingSound.setLoop(true);
			this.m_walkingSound.setVolume(0.4);
		});
		this.m_audioLoader.load('sounds/menu_sound.mp3', buffer => {
			this.m_menuSound.setBuffer(buffer);
			this.m_menuSound.setLoop(false);
		});
	}
}
