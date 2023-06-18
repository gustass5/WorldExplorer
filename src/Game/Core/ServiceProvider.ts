import Game from '../Game';

// [NOTE]: This implementation is mostly for prototyping purposes and will probably change
export default class ServiceProvider {
	private static m_game: Game;
	public static get game() {
		if (!ServiceProvider.m_game) {
			throw new Error('Trying to access missing Game service');
		}

		return ServiceProvider.m_game;
	}

	static set game(game: Game) {
		if (ServiceProvider.m_game) {
			console.warn('Game service was set again. Be sure you know what you are doing.');
		}
		ServiceProvider.m_game = game;
	}

	private constructor() {}
}
