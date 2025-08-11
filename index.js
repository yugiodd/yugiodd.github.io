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
		const roundedResults = roundResult(probability);
		document.getElementById('result').innerHTML = `
		    The chance to have at least ${minCopies} starters is
		        <strong>${roundedResults[0]}%</strong>.
		    <br>
		    So, on average, play <strong>${roundedResults[1]}</strong> duels, you will brick once.
		`;
	});
});
