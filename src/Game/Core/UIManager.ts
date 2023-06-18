import TypeIt from 'typeit';

const lines = [
	'Exo 436-B2',
	'Distance: 33 Light years',
	'Mass: ~21x Earth',
	'Age: 7.4 - 11 Billion years',
	'Contains alien lifeforms: Unknown',
	'Temperature: 22 ℃'
];

export class UIManager {
	private m_overlayElement!: Element;
	private m_startScreenElement!: Element;
	private m_startButtonElement!: Element;
	public get startButtonElement() {
		return this.m_startButtonElement;
	}
	private m_pauseScreenElement!: Element;
	private m_pauseButtonElement!: Element;
	public get pauseButtonElement() {
		return this.m_pauseButtonElement;
	}
	private m_alertElement!: Element;
	private m_databookContainer!: Element;
	private m_databookContentContainer!: Element;
	private m_objectivesContainer!: Element;
	private m_descriptionContainer: Element;
	private m_controlsContainers: NodeList;
	private m_pointer: Element;

	constructor() {
		const overlayElement = document.querySelector('.overlay');
		const startScreenElement = document.querySelector('.start-screen');
		const startButtonElement = document.querySelector('.start-button');
		const pauseScreenElement = document.querySelector('.pause-screen');
		const pauseButtonElement = document.querySelector('.pause-button');
		const alertElement = document.querySelector('.alert');
		const objectivesElement = document.querySelector('.objectives');
		const databookElement = document.querySelector('.databook-container');
		const databookContentElement = document.querySelector('.databook-content');
		const descriptionElement = document.querySelector('.description-container');
		const controlsContainers = document.querySelectorAll('.controls-container');
		const pointer = document.querySelector('.pointer');

		if (
			!overlayElement ||
			!descriptionElement ||
			!pointer ||
			!controlsContainers ||
			!startScreenElement ||
			!startButtonElement ||
			!pauseScreenElement ||
			!pauseButtonElement ||
			!alertElement ||
			!objectivesElement ||
			!databookElement ||
			!databookContentElement
		) {
			throw new Error('Overlay element was not found');
		}

		this.m_overlayElement = overlayElement;
		this.m_startScreenElement = startScreenElement;
		this.m_startButtonElement = startButtonElement;
		this.m_pauseScreenElement = pauseScreenElement;
		this.m_pauseButtonElement = pauseButtonElement;
		this.m_alertElement = alertElement;
		this.m_databookContainer = databookElement;
		this.m_databookContentContainer = databookContentElement;
		this.m_objectivesContainer = objectivesElement;
		this.m_descriptionContainer = descriptionElement;
		this.m_controlsContainers = controlsContainers;
		this.m_pointer = pointer;
	}

	public loadDescription() {
		Array.from(this.m_startScreenElement.children).forEach(node =>
			(node as HTMLDivElement).classList.add('hidden')
		);
		this.m_descriptionContainer.classList.remove('hidden');
		Array.from(this.m_descriptionContainer.children).forEach((line, index) => {
			// @ts-ignore
			new TypeIt(line, {
				strings: lines[index],
				speed: 45,
				lifeLike: false,
				cursor: false
			})
				.pause(3000)
				.delete()
				.go();
		});
	}

	public blurOutOverlay() {
		this.m_overlayElement.classList.add('transparent');
	}

	public removeOverlay() {
		this.m_overlayElement.classList.add('hidden');
		this.m_controlsContainers.forEach(node => (node as HTMLDivElement).classList.remove('hidden'));
		this.m_pointer.classList.remove('hidden');
	}

	public showPauseScreen() {
		this.m_pauseScreenElement.classList.remove('hidden');
		this.m_pauseScreenElement.classList.add('flex');
		Array.from(this.m_pauseScreenElement.children).forEach(node =>
			(node as HTMLDivElement).classList.remove('hidden')
		);
	}

	public hidePauseScreen() {
		this.m_pauseScreenElement.classList.add('hidden');
		this.m_pauseScreenElement.classList.remove('flex');
		Array.from(this.m_pauseScreenElement.children).forEach(node =>
			(node as HTMLDivElement).classList.add('hidden')
		);
	}

	// [TODO]: Implement que for events
	public showAlert(message?: string) {
		const messageElement = this.m_alertElement.querySelector('span');
		if (!messageElement) {
			console.error('Message element was not found');
			return;
		}

		messageElement.innerHTML = message || 'Success';

		this.m_alertElement.classList.add('flex');
		this.m_alertElement.classList.remove('hidden');

		setTimeout(() => {
			this.hideAlert();
		}, 3000);
	}

	public hideAlert() {
		this.m_alertElement.classList.add('hidden');
		this.m_alertElement.classList.remove('flex');
	}

	public updateObjectivesTitle(title: string) {
		this.m_objectivesContainer.querySelector('div')!.innerHTML = title;
	}
	public updateObjectives(objectives: string[]) {
		const objectivesElements = objectives.map(objective => `<li>${objective}</li>`).join('');
		this.m_objectivesContainer.querySelector('ul')!.innerHTML = objectivesElements;
	}

	public showDatabook() {
		this.m_databookContainer.classList.add('flex');
		this.m_databookContainer.classList.remove('hidden');
	}

	public hideDatabook() {
		this.m_databookContainer.classList.add('hidden');
		this.m_databookContainer.classList.remove('flex');
	}

	public updateDatabook(items: { title: string; imageURL: string; count: number }[]) {
		const databookItem = (item: { title: string; imageURL: string; count: number }) => `
			<div class="databook-item">
				<div class="databook-item-content">
					<div>${item.title}</div>
					<div class="image" style="background-image: url(${item.imageURL});"></div>
					<div>Samples collected: ${item.count}</div>
				</div>
			</div>
			`;

		let databookContent = '';
		for (let i = 0; i < 9; i++) {
			const item = items[i] ? databookItem(items[i]) : `<div class="databook-item">EMPTY</div>`;
			databookContent += item;
		}

		this.m_databookContentContainer.innerHTML = databookContent;
	}

	public showCrosshair() {
		this.m_pointer.classList.remove('hidden');
	}

	public hideCrosshair() {
		this.m_pointer.classList.add('hidden');
	}
}
