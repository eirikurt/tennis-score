import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Match } from "./main.js";

describe("match", () => {
	it("can be instantiated", () => {
		const match = new Match({});

		// There are default player names
		assert.equal(match.player1, "Player 1");
		assert.equal(match.player2, "Player 2");

		// The player names are mutable
		match.player1 = "John McEnroe";
		match.player2 = "Björn Borg";

		// To begin with, scores are all zeros
		assert.deepEqual(match.points, [0, 0]);
		assert.deepEqual(match.games, [0, 0]);
		assert.deepEqual(match.sets, [0, 0]);
	});

	it("updates the points", () => {
		const match = new Match({});

		// OK, let's start playing
		match.registerPoint("player1");
		assert.deepEqual(match.points, [15, 0]);
		match.registerPoint("player1");
		assert.deepEqual(match.points, [30, 0]);
		match.registerPoint("player2");
		assert.deepEqual(match.points, [30, 15]);
		match.registerPoint("player1");
		assert.deepEqual(match.points, [40, 15]);
	});

	it("resets the points when a game is won", () => {
		const match = new Match({});

		// OK, let's start playing
		match.registerPoints("player1", 3);
		assert.deepEqual(match.points, [40, 0]);
		match.registerPoint("player1");
		assert.deepEqual(match.points, [0, 0]);
		assert.deepEqual(match.games, [1, 0]);
	});

	// next up: advantage, which should be configurable
	it("must be won by two points if advantage is played", () => {
		const match = new Match({ playAdvantage: true });

		// OK, let's start playing
		match.registerPoints("player1", 3);
		match.registerPoints("player2", 3);
		assert.deepEqual(match.points, [40, 40]);
		match.registerPoint("player1");
		assert.deepEqual(match.points, ["ADV", 40]);
		match.registerPoint("player2");
		assert.deepEqual(match.points, [40, 40]);
		match.registerPoint("player2");
		assert.deepEqual(match.points, [40, "ADV"]);
		match.registerPoint("player2");
		assert.deepEqual(match.points, [0, 0]);
		assert.deepEqual(match.games, [0, 1]);
	});

	it("takes 6 games to win a set", () => {
		const match = new Match({});

		match.registerPoints("player1", 4 * 5 + 3);
		assert.deepEqual(match.points, [40, 0]);
		assert.deepEqual(match.games, [5, 0]);
		assert.deepEqual(match.sets, [0, 0]);
		match.registerPoint("player1");
		assert.deepEqual(match.points, [0, 0]);
		assert.deepEqual(match.games, [0, 0]);
		assert.deepEqual(match.sets, [1, 0]);
	});

	it("takes a two game difference to win a set", () => {
		const match = new Match({});

		match.registerPoints("player1", 4 * 5);
		match.registerPoints("player2", 4 * 5);
		assert.deepEqual(match.games, [5, 5]);

		match.registerPoints("player1", 4);
		assert.deepEqual(match.games, [6, 5]);
		assert.deepEqual(match.sets, [0, 0]);

		match.registerPoints("player1", 4);
		assert.deepEqual(match.games, [0, 0]);
		assert.deepEqual(match.sets, [1, 0]);
	});
});
