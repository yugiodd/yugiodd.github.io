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

function calculateProbability(nStarters, deckSize, handSize, minCopies, maxCopies) {
	// result is the probability of having at least minCopies starter cards in hand
	let result = 0.0;
	// // brickOnceInDuels is the average number of duels until you brick once
	let brickOnceInDuels = 88888888;

	// autocorrect inputs
	if (isNaN(maxCopies) || maxCopies === '') {
		// if maxCopies is not set, set it to handSize
		maxCopies = handSize;
	}
	if (maxCopies > handSize) {
		// if maxCopies is larger than handSize, set it to handSize
		maxCopies = handSize;
	}
	if (maxCopies > nStarters) {
		// if maxCopies is larger than nStarters, set it to nStarters
		maxCopies = nStarters;
	}

	// calculate the probability by summing the probabilities of
	// having exactly i starters in hand, where minCopies <= i <= maxCopies
	let nAllCases = combination(deckSize, handSize);
	if (nAllCases === 0) {
		return [0, brickOnceInDuels];
	}
	for (let i = minCopies; i <= maxCopies; i++) {
		result += combination(nStarters, i) * combination(deckSize - nStarters, handSize - i) / nAllCases;
	}
	if (result < 1) {
		brickOnceInDuels = 1 / (1 - result);
	}
	let roundedBrickRate = brickOnceInDuels.toFixed(1);

	// round the result to percent with 2 decimal places for human readability
	let roundedGoodHandPercent = Math.round(result * 10000) / 100;
	let logURLQuery =
		`?result=${roundedGoodHandPercent.toFixed(2)}` +
		`&brickOnceInDuels=${roundedBrickRate}` +
		`&nStarters=${nStarters}` +
		`&deckSize=${deckSize}` +
		`&handSize=${handSize}` +
		`&min=${minCopies}` +
		`&max=${maxCopies}`;
	console.log(logURLQuery);
	fetch(`https://log.daominah.uk/log${logURLQuery}`, {method: 'GET'})
		.then(response => console.log('log sent successfully'))
		.catch(error => console.error('error sending log:', error));
	return [roundedGoodHandPercent, roundedBrickRate];
}

document.addEventListener('DOMContentLoaded', function () {
	const nStartersInput = document.getElementById('nStarters');
	if (nStartersInput.value === '') {
		nStartersInput.classList.add('highlight-empty');
	}

	nStartersInput.addEventListener('input', function () {
		if (this.value === '') {
			this.classList.add('highlight-empty');
		} else {
			this.classList.remove('highlight-empty');
		}
	});

	document.getElementById('handSize').addEventListener('input', function () {
		const handSize = parseInt(this.value);
		const maxCopiesInput = document.getElementById('maxCopies');
		const maxCopies = parseInt(maxCopiesInput.value);

		if (handSize < maxCopies) {
			maxCopiesInput.value = handSize;
		}
	});

	document.getElementById('calculatorForm').addEventListener('submit', function (event) {
		event.preventDefault();
		const nStarters = parseInt(document.getElementById('nStarters').value);
		const deckSize = parseInt(document.getElementById('deckSize').value);
		const handSize = parseInt(document.getElementById('handSize').value);
		const minCopies = parseInt(document.getElementById('minCopies').value);
		const maxCopies = parseInt(document.getElementById('maxCopies').value);

		const probability = calculateProbability(nStarters, deckSize, handSize, minCopies, maxCopies);
		document.getElementById('result').innerHTML = `
		    The chance to have at least ${minCopies} starters is
		        <strong>${probability[0].toFixed(2)}%</strong>.
		    <br>
		    So, on average, play <strong>${probability[1]}</strong> duels, you will brick once.
		`;
	});
});
