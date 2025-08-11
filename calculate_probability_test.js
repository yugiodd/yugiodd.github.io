const {combination, calculateProbability, roundResult} = require('./calculate_probability');

function testCombination() {
	console.log("begin testCombination");
	const tests = [
		{args: [1, 0], expected: 1},
		{args: [1, 1], expected: 1},
		{args: [3, 3], expected: 1},
		{args: [3, 2], expected: 3},
		{args: [4, 2], expected: 6},
	];
	for (const {args, expected} of tests) {
		const result = combination(...args);
		if (result !== expected) {
			throw new Error(`combination(${args.join(',')}) expected ${expected}, got ${result}`);
		}
	}
	console.log(`passed testCombination ${tests.length} test cases`);
}

function testCalculateProbabilityAndRoundResult() {
	console.log("begin calculateProbabilityAndRoundResult");
	let tests = [
		{
			input: {nStarters: 1, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "12.50", nDuelsBrickOnce: "1.1"},
			// easy enough to calculate, 5/40 = 12.5% chance to have 1 starter in hand
		},
		{
			input: {nStarters: 2, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "23.72", nDuelsBrickOnce: "1.3"},
		},
		{
			input: {nStarters: 3, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "33.76", nDuelsBrickOnce: "1.5"},
			// run 3 copies of a card in a 40-card deck,
			// you will open it 1 out of 3 duels on average.
		},
		{
			input: {nStarters: 6, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "57.71", nDuelsBrickOnce: "2.4"},
			// e.g. if you have 6 answers to MaxxC, for every 2.4 duels,
			// you have an answer in 1.4 duels, the remaining 1.0 duel you do not.
		},

		{
			input: {nStarters: 12, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "85.06", nDuelsBrickOnce: "6.7"},
			// acceptable number of starters
		},
		{
			input: {nStarters: 13, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "87.73", nDuelsBrickOnce: "8.2"},
		},
		{
			input: {nStarters: 14, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "90.00", nDuelsBrickOnce: "10.0"},
			// happy number of starters
		},
		{
			input: {nStarters: 15, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "91.93", nDuelsBrickOnce: "12.4"},
		},
		{
			input: {nStarters: 16, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "93.54", nDuelsBrickOnce: "15.5"},
			// very consistent, adding more starters does not help much,
			// probably save space for non-engine cards to help going second
		},
		{
			input: {nStarters: 17, deckSize: 40, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "94.89", nDuelsBrickOnce: "19.6"},
		},

		{
			input: {nStarters: 12, deckSize: 40, handSize: 6, minCopies: 1},
			expected: {percentGoodHands: "90.18", nDuelsBrickOnce: "10.2"},
			// going second with 6 cards in hand, 12 starters is already very good
		},

		{
			input: {nStarters: 16, deckSize: 40, handSize: 5, minCopies: 2},
			expected: {percentGoodHands: "67.70", nDuelsBrickOnce: "3.1"},
			// with 16 hand traps, you will open 2 of them in 2/3 duels
		},
		{
			input: {nStarters: 20, deckSize: 40, handSize: 5, minCopies: 2},
			expected: {percentGoodHands: "82.92", nDuelsBrickOnce: "5.9"},
			// with 20 hand traps, you will open 2 of them in 5/6 duels
		},
		{
			input: {nStarters: 24, deckSize: 40, handSize: 5, minCopies: 2},
			expected: {percentGoodHands: "92.70", nDuelsBrickOnce: "13.7"},
			// to be consistent 2-cards combos, 24 starters is a good number
		},

		{
			input: {nStarters: 3, deckSize: 60, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "23.33", nDuelsBrickOnce: "1.3"},
			// run 3 copies of a card in a 60-card deck,
			// you will open it less than 1 out of 4 duels on average,
			// reduced from 1 out of 3 duels in a 40-card deck.
		},
		{
			input: {nStarters: 6, deckSize: 60, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "42.09", nDuelsBrickOnce: "1.7"},
			// reduced from 57.71% in a 40-card deck
		},
		{
			input: {nStarters: 20, deckSize: 60, handSize: 5, minCopies: 1},
			expected: {percentGoodHands: "87.95", nDuelsBrickOnce: "8.3"},
			// 20 starters in a 60-card deck
			// (equivalent to 13 starters in a 40-card deck)
		},
	];
	for (const test of tests) {
		const probability = calculateProbability(
			test.input.nStarters,
			test.input.deckSize,
			test.input.handSize,
			test.input.minCopies,
			test.input.maxCopies);
		const roundedResults = roundResult(probability);
		if (roundedResults.length !== 2) {
			throw new Error(`roundResult(${probability}) expected 2 results, got ${roundedResults.length}`);
		}
		let percentGoodHands = roundedResults[0];
		let nDuelsBrickOnce = roundedResults[1];
		if (percentGoodHands !== test.expected.percentGoodHands) {
			throw new Error(`calculateProbability(${test.input.nStarters}, ${test.input.deckSize}, ${test.input.handSize}, ${test.input.minCopies}) got percentGoodHands ${percentGoodHands}, expected ${test.expected.percentGoodHands}`);
		}
		if (nDuelsBrickOnce !== test.expected.nDuelsBrickOnce) {
			throw new Error(`calculateProbability(${test.input.nStarters}, ${test.input.deckSize}, ${test.input.handSize}, ${test.input.minCopies}) got nDuelsBrickOnce ${nDuelsBrickOnce}, expected ${test.expected.nDuelsBrickOnce}`);
		}
	}
	console.log(`passed calculateProbabilityAndRoundResult ${tests.length} test cases`);
}

	console.log("________________________________________");
	console.log("begin running tests");
	console.log("________________________________________");
	testCombination();
	console.log("________________________________________");
	testCalculateProbabilityAndRoundResult();
	console.log("________________________________________");
	console.log("passed all tests");
