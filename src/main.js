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

	/**
	 * @param {PlayerID} player
	 */
	registerPoint(player) {
		this.#pointsWon.push(player);
		this.#updateScore();
	}

	#updateScore() {
		const points = [0, 0];
		const games = [0, 0];
		for (const pid of this.#pointsWon) {
			const index = pid === "player1" ? 0 : 1;
			points[index] += 1;
			if (points[index] > 3) {
				games[index] += 1;
				points[0] = points[1] = 0;
			}
		}
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
		return [[0, 0]];
	}
}
