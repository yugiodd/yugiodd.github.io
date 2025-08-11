/**
 * Calculates the number of combinations (n choose r).
 * @param {number} n - Total number of items.
 * @param {number} r - Number of items to choose.
 * @returns {number} Number of combinations (order does not matter), also known as nCr or C(n, r).
 */
function combination(n, r) {
	if (r > n || r < 0) {
		return 0;
	}
	let result = 1;
	for (let i = 0; i < r; i++) {
		result *= (n - i);
		result /= (i + 1);
	}
	return result;
}

/**
 * Calculates the probability of having at least minCopies starter cards in hand.
 * @param {number} nStarters - Number of starter cards in the deck.
 * @param {number} deckSize - Total number of cards in the deck. Usually 40. Sometimes 60.
 * @param {number} handSize - Number of cards drawn in hand. Usually 5. Can be 6 if going second.
 * @param {number} minCopies - Minimum number of starter cards required in hand. Usually 1.
 * @param {number} maxCopies - Maximum number of starter cards considered in hand. Not important.
 * @returns {number} Probability of having at least minCopies starters in hand (real number between 0 and 1).
 */
function calculateProbability(
	nStarters,
	deckSize, handSize,
	minCopies, maxCopies) {
	// Calculate the probability of having at least minCopies starter cards in hand
	let result = 0.0;
	// autocorrect inputs
	if (isNaN(maxCopies)) {
		maxCopies = handSize;
	}
	if (maxCopies > handSize) {
		maxCopies = handSize;
	}
	if (maxCopies > nStarters) {
		maxCopies = nStarters;
	}
	// console.log(`debug inputs: nStarters=${nStarters}, deckSize=${deckSize}, handSize=${handSize}, minCopies=${minCopies}, maxCopies=${maxCopies}`);

	let nAllCases = combination(deckSize, handSize);
	if (nAllCases === 0) {
		return 0;
	}
	for (let i = minCopies; i <= maxCopies; i++) {
		result += combination(nStarters, i) * combination(deckSize - nStarters, handSize - i) / nAllCases;
	}
	// console.log(`debug result=${result}`);
	return result;
}

/**
 * Rounds the probability and number of duels until you brick once.
 * @param {number} probability - Probability value between 0 and 1.
 * @returns {[string, string]} Array of human-friendly strings:
 * - Percentage of good hands.
 * - Average number of duels until you brick once.
 */
function roundResult(probability) {
	// brickOnceInDuels is the average number of duels until you brick once
	let brickOnceInDuels = 88888888;
	if (probability < 1) {
		brickOnceInDuels = 1 / (1 - probability);
	}
	let roundedBrickRate = brickOnceInDuels.toFixed(1);
	let roundedGoodHandPercent = (Math.round(probability * 10000) / 100).toFixed(2)
	return [roundedGoodHandPercent, roundedBrickRate];
}


// for testing purposes, works when running with Node, not in browser
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {combination, calculateProbability, roundResult};
}
