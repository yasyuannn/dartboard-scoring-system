/* Class Score. */

function Score(index, name) {
	this.index = index;   		// player's counter
	this.name = name;			// player's name

	this.lblPlayer = 'lblPlayer' + this.index;
	this.rowDart = 'rowDart' + this.index;
	this.lblTurn = 'lblTurn' + this.index;
	this.lblDart = 'lblDart' + this.index;
	this.lblScore = 'lblScore' + this.index;

	this.reset();

	setText(this.lblPlayer, this.name);

	this.dartNum = 0;
}

// Clear the player dart scores.
Score.prototype.clear = function() {
	for (var n = 0; n < 3; n++)
		setText(this.lblDart + n, '-');
}

// Clear the player dart scores.
Score.prototype.reset = function() {
	this.clear();

	this.darts = new Array(0, 0, 0);
	this.turns = 0;
	this.total = 501;
	this.total_prev = 501;

	setText(this.lblScore, this.total);
	setText(this.lblTurn, 'Darts');
}

//	Turn on and off the light on the dart.
Score.prototype.lightHigh = function(dart) {  // dart - the dart number
	DOM.get('rowDart' + this.index + dart).style.backgroundColor = '#ffff00';
}
Score.prototype.lightLow = function(dart) {
	DOM.get('rowDart' + this.index + dart).style.backgroundColor = '#ffffff';
}

// Set the score of a dart for the player.
Score.prototype.setDart = function(dart, score) {	// dart - the dart number; score - score value
	this.darts[dart] = score;
	setText(this.lblDart + dart, score);

	this.setTotal(this.total - score);
}

// Set the total score for the player.
Score.prototype.setTotal = function(score) {
	this.total = score;
	setText(this.lblScore, score);
}

// Set the score for a new turn.
Score.prototype.newTurn = function() {
	// record the current score before a new turn
	this.total_prev = this.total;
	
	// increment the player's turn counter
	setText(
		this.lblTurn,
		`Darts (turn ${++this.turns})`
	);

	this.clear();
}