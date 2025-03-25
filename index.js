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
	let result = 0.0;
	if (maxCopies > handSize) {
		maxCopies = handSize;
	}
	if (maxCopies > nStarters) {
		maxCopies = nStarters;
	}
	let nAllCases = combination(deckSize, handSize);
	if (nAllCases === 0) {
		return 0;
	}
	for (let i = minCopies; i <= maxCopies; i++) {
		result += combination(nStarters, i) * combination(deckSize - nStarters, handSize - i) / nAllCases;
	}
	let rounded2Percent = Math.round(result * 10000) / 100;
	console.log(`result: ${rounded2Percent} % (nStarters: ${nStarters}, deckSize: ${deckSize}, handSize: ${handSize}, min: ${minCopies}, max: ${maxCopies})`);
	return rounded2Percent;
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
        <strong>${probability.toFixed(2)}%</strong>`
	});
});
