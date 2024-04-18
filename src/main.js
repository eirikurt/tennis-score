/**
 * @typedef {"player1" | "player2"} PlayerID
 */

const pointSequence = [0, 15, 30, 40, "ADV"];

export class Match {
	player1 = "Player 1";
	player2 = "Player 2";
	/** @type {PlayerID[]} */
	#pointsWon = [];
	/** @type {(string | number)[]} */
	#points = [0, 0];
	#games = [0, 0];
	#sets = [0, 0];
	#playAdvantage;

	constructor({ playAdvantage = false }) {
		this.#playAdvantage = playAdvantage;
	}

	/**
	 * @param {PlayerID} player
	 */
	registerPoint(player) {
		this.registerPoints(player, 1);
	}

	/**
	 * @param {PlayerID} player
	 * @param {number} howMany
	 */
	registerPoints(player, howMany) {
		for (let i = 0; i < howMany; i++) {
			this.#pointsWon.push(player);
		}
		this.#updateScore();
	}

	#updateScore() {
		const points = [0, 0];
		const games = [0, 0];
		const sets = [0, 0];
		for (const pid of this.#pointsWon) {
			const index = pid === "player1" ? 0 : 1;
			const opponentIndex = (index + 1) % 2;
			const wasDeuce = points[0] >= 3 && points[1] >= 3;
			if (wasDeuce && points[opponentIndex] > points[index]) {
				points[opponentIndex] -= 1;
			} else {
				points[index] += 1;
			}
			const gameWon =
				points[index] > 3 &&
				(!this.#playAdvantage || points[index] > points[opponentIndex] + 1);
			if (gameWon) {
				games[index] += 1;
				points[0] = points[1] = 0;
			}
			const setWon =
				games[index] >= 6 && games[index] > games[opponentIndex] + 1;
			if (setWon) {
				sets[index] += 1;
				games[0] = games[1] = 0;
			}
		}
		this.#sets = sets;
		this.#games = games;
		this.#points = points.map((p) => pointSequence[p]);
	}

	get games() {
		return [...this.#games];
	}

	get points() {
		return [...this.#points];
	}

	get sets() {
		return [...this.#sets];
	}
}
