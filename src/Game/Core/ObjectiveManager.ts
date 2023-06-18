import { TerrainEntityType } from '../World/TerrainEntity';
import ServiceProvider from './ServiceProvider';

export class ObjectiveManager {
	private m_state: Record<TerrainEntityType, { title: string; imageURL: string; count: number }> = {
		slime: { title: 'Moving slime', imageURL: 'databook/slime.png', count: 0 },
		rock: { title: 'Alien Rock', imageURL: 'databook/rock.png', count: 0 },
		tree: { title: 'Tree', imageURL: 'databook/tree.png', count: 0 },
		blob: { title: 'Floating blob', imageURL: 'databook/blob.png', count: 0 },
		grass: { title: 'Grass stem', imageURL: 'databook/slime.png', count: 0 },
		cloud: { title: 'Cloud', imageURL: 'databook/slime.png', count: 0 },
		butterfly: { title: 'Butterfly', imageURL: 'databook/slime.png', count: 0 }
	};
	private m_scannedTotal = 0;

	private m_objectives = [
		{
			events: ['scanned'],
			completed: () => this.m_scannedTotal >= 5,
			title: () => `Scan ${this.m_scannedTotal}/5 objects`
		}
	];

	private m_objectivesCompleted = false;

	constructor() {
		ServiceProvider.game.UIManager.updateObjectives(this.getObjectivesTitles(this.m_objectives));

		ServiceProvider.game.world.player.on('scanned', ({ type, name }: { type: TerrainEntityType; name: string }) => {
			ServiceProvider.game.UIManager.showAlert(
				`Scan success. New sample has been added to your library - ${name}`
			);

			this.m_state[type].count += 1;

			this.m_scannedTotal += 1;

			if (this.m_objectivesCompleted) {
				return;
			}

			ServiceProvider.game.UIManager.updateObjectives(this.getObjectivesTitles(this.m_objectives));

			const listeners = this.m_objectives.filter(objective => objective.events.includes('scanned'));

			if (listeners.every(listener => listener.completed())) {
				// [TODO]: Fix this hack once UIManager has alert que or other solution to handle alerts
				this.m_objectivesCompleted = true;
				setTimeout(() => {
					ServiceProvider.game.UIManager.showAlert('Objective complete!');
					ServiceProvider.game.UIManager.updateObjectivesTitle('Demo complete! ');
					ServiceProvider.game.UIManager.updateObjectives([
						'Thank you for trying out world explorer. You can continue exploring or restart for a newly created world.'
					]);
				}, 3000);

				// ServiceProvider.game.world.player.off('scanned');
			}
		});

		ServiceProvider.game.world.player.on('databookOpen', () => {
			ServiceProvider.game.UIManager.updateDatabook(
				Object.values(this.m_state).filter(state => state.count !== 0)
			);
		});
	}

	private getObjectivesTitles(objectives: { events: string[]; completed: () => boolean; title: () => string }[]) {
		return objectives.map(objective => objective.title());
	}
}
