/* Class Game. */

function Game() {
	// dart
	this.DART_SHOTMAX = 14;
	this.DART_SHOWMAXANGLE = 10;

	// game speed
	this.SPEED_HAND = 20;					// hand movement
	this.SPEED_DART = 35;					// dart throw movement
	this.SPEED_THROW = this.SPEED_DART * 3;	// hand throw movement

	// key codes
	this.KEYCODE_THROW = 32;	// Space bar
	this.KEYCODE_NEW = 78;		// (N)ew
	this.KEYCODE_PAUSE = 83;	// (S)top

	// throw types
	this.IS_OUTSIDE = 0;	// outside the board
	this.IS_SINGLE = 1;		// single
	this.IS_DOUBLE = 2;		// double
	this.IS_TREBLE = 3;		// treble
	this.IS_ROUNDM = 4;		// 25
	this.IS_MIDDLE = 5;		// 50
	this.throwType = 0;

	// game timer
	this.oTimer = new Timer();

	// language object (game strings)
	this.oLang = new Lang('en');

	// score objects for both players
	this.aScores = new Array();
	this.aScores[0] = new Score(0, this.oLang.str(10));
	this.aScores[1] = new Score(1, this.oLang.str(11));

	// board object layer
	this.oBoard = new Board('Board');
	this.oBoard.create();

	// darts object layers array
	this.aDarts = new Array();
	for (var m = 0; m < 2; m++) {
		this.aDarts[m] = new Array();

		for (var n = 0; n < 3; n++) {
			this.aDarts[m][n] = new Dart('Dart' + m + n, m, n, this.oBoard.WIDTH, this.oBoard.HEIGHT);
			this.aDarts[m][n].create();
		}
	}

	// hand object layer
	this.oHand = new Hand('Hand', this.oBoard.x, this.oBoard.y, this.oBoard.WIDTH, this.oBoard.HEIGHT);
	this.oHand.create();

	this.reset();			// reset the game environment
}

// Process a window resize event.
Game.prototype.resize = function() {
	var oldX = this.oBoard.x;
	var oldY = this.oBoard.y;

	this.oBoard.calcXY();

	// after re-calculating all values, move the board layer
	this.oBoard.moveTo(this.oBoard.x, this.oBoard.y);

	// move the darts only the difference from their previous position
	for (var m = 0; m < 2; m++) 
		for (var n = 0; n < 3; n++) 
			this.aDarts[m][n].moveBy(this.oBoard.x - oldX, this.oBoard.y - oldY);
}

var x_cor, y_cor;

// Processes a key down event.
Game.prototype.keyDown = function(keyCode, x, y) {
	switch (keyCode) {
		case this.KEYCODE_THROW:	// fire
			x_cor = x;
			y_cor = y;
			this.throwStart();
			break;
		case this.KEYCODE_NEW:		// new game
			this.start();
			break;
		case this.KEYCODE_PAUSE:	// pause game
			this.pause();
	}

	return false;		// KEEP THIS!!
}

// Start a new game.
Game.prototype.start = function() {
	// confirm to start a new game, if another game is already running
	if (!this.oTimer.is_active() || confirm(this.oLang.str(4))) {
		// turn off the light on the current player/dart
		this.aScores[this.playerId].lightLow(this.dartId);

		this.reset();
		this.newTurn();
		this.newDart();
	}
}

// Pause a running game.
Game.prototype.pause = function() {
	// pause only if a game is running
	if (this.oTimer.is_active()) alert(this.oLang.str(9));
}

// Change the player's name.
Game.prototype.playerChangeName = function(player) {
	var name = prompt(this.oLang.str(8), this.aScores[player].name);

	if (!is_empty(name)) {
		this.aScores[player].name = name;

		// truncate the name if too long
		setText('lblPlayer' + player, (name.length > 15 ? name.substr(0, 15) + '...' : name));
	}
}

// Reset the game environment before starting a new game.
Game.prototype.reset = function() {
	this.aScores[0].reset();
	this.aScores[1].reset();

	this.throwCount = 0;	// dart throw counter
	this.playerId = 1;		// player id
	this.dartId = 0;		// dart id
}

// Setup the game space before a player's new turn.
Game.prototype.newTurn = function() {
	this.dartId = 0;
	this.playerId = (this.playerId ? 0 : 1);		// change player

	// total score before turn is the current total score
	this.aScores[this.playerId].newTurn();

	for (var m = 0; m < 2; m++)
		for (var n = 0; n < 3; n++)
			this.aDarts[m][n].showByPlayer(this.oBoard.x, this.oBoard.y);
}

// Setup the game space before a player's new dart.
Game.prototype.newDart = function() {
	setText('lblFeed', this.oLang.str(0) + this.aScores[this.playerId].name);

	this.aDarts[this.playerId][this.dartId].hide();		// hide the next dart

	this.aScores[this.playerId].lightHigh(this.dartId);

	sleep(500);

	this.oTimer.start('oGame.oHand.move()', this.SPEED_HAND);
}

// The throw animation.
Game.prototype.throwStart = function(){
	this.oTimer.start('oGame.throwHand()', this.SPEED_THROW);
}

// The throw hand animation.
Game.prototype.throwHand = function() {
	// set the dart layer
	this.aDarts[this.playerId][this.dartId].moveTo(x_cor, y_cor);
	
	// start the dart throw animation
	this.aDarts[this.playerId][this.dartId].setImage(0);
	this.aDarts[this.playerId][this.dartId].show();
	this.oTimer.start('oGame.throwDart()', this.SPEED_DART);
}

// The throw dart animation.
Game.prototype.throwDart = function() {
	if (this.throwCount++ < this.DART_SHOTMAX) {		
		// shows the dart throw
	} else {
		this.throwCount = 0;
		this.aScores[this.playerId].lightLow(this.dartId);

		if (this.rules501()) this.newDart();
	}
}

// Implements the Darts 501 rules after a throw.
// Returns True if the game still runs; false if the game is over.
Game.prototype.rules501 = function() {
	var ret = true;

	var score = this.pieScore(
		this.aDarts[this.playerId][this.dartId].realX() - this.oBoard.x,
		this.aDarts[this.playerId][this.dartId].realY() - this.oBoard.y
	);

	this.aScores[this.playerId].setDart(this.dartId, score);

	if (this.aScores[this.playerId].total == 0) {
	// game ends (player reach 0) (current player wins)
		ret = this.finish(this.playerId);
	} else {
	// game is not yet over
		if (this.aScores[this.playerId].total < 1) {	
		// bust, so apply the rules
			alert(this.aScores[this.playerId].name + ': Bust!!! You lost your turn.');
			this.aScores[this.playerId].setTotal(this.aScores[this.playerId].total_prev);
			this.dartId = 2;		// force a change of player below
		} else if (this.playerId == 1 && this.aScores[1].turns >= 20 && this.dartId == 2) {	
		// if both players have reached 20+ turns
			if (this.aScores[0].total < this.aScores[1].total) { // player 1 wins if score's lower
				ret = this.finish(0);
			} else if (this.aScores[1].total < this.aScores[0].total) { // player 2 wins if score's lower
				ret = this.finish(1);
			} else if (this.aScores[1].turns == 30) {
				// if both players have reached 20+10 turns an their scores are the same we have a draw
				ret = this.finish();
			}
		}

		// check if the player needs to be changed
		if (ret && this.dartId++ == 2) this.newTurn();
	}

	return ret;
}

// Terminates the game and sets the winner (or a draw).
Game.prototype.finish = function(playerId) {
	this.oTimer.stop();

	alert(setText('lblFeed',
		(playerId == null ? 'No winner after 30 turns. Game is a draw.' : this.aScores[playerId].name + ': Congratulations, you won!!!')
	));

	return false;
}

// Gets the score from the dart throw.
Game.prototype.pieScore = function(x, y) {
	var quad;		// all calculations are reduced to the 1st quadrant
	var newx;		// the new (X,Y) values after the projection
	var newy;		// on the board's 1st quadrant

	var aScore = new Array(
		new Array( 6, 13,  4, 18,  1, 20),
		new Array(20,  5, 12,  9, 14, 11),
		new Array(11,  8, 16,  7, 19,  3),
		new Array( 3, 17,  2, 15, 10,  6)
	);

	if (x < this.oBoard.CENTER_X) {		// quad 2 or 3 ??
		if (y < this.oBoard.CENTER_Y) {	// quad 2
			quad = 2;
			newx = this.oBoard.CENTER_X - y;
			newy = this.oBoard.CENTER_Y - x;
		} else {						// quad 3
			quad = 3;
			newx = this.oBoard.CENTER_X - x;
			newy = this.oBoard.CENTER_Y - y;
		}
	} else {							// quad 1 or 4 ??
		if (y < this.oBoard.CENTER_Y) {	// quad 1
			quad = 1;
			newx = x - this.oBoard.CENTER_X;
			newy = this.oBoard.CENTER_Y - y;
		} else {						// quad 4
			quad = 4;
			newx = y - this.oBoard.CENTER_Y;
			newy = x - this.oBoard.CENTER_X;
		}
	}

	// An angle cosine calculated with cos=(a/h), where: (a=triangle's base) and (h=hypotenuse).
	var hypo = hypotenuse(newx, newy);	// Pythagoras's theorem hypotenuse
	var angle = Math.acos(newx / hypo);
	var pie = this.getPie(angle);

	return this.realScore(hypo, aScore[quad - 1][pie]);
}

// Gets the pie where the darts hits the board.
Game.prototype.getPie = function(angle) {
	var aRadians = new Array(0.157079633, 0.471238898, 0.785398163, 1.099557429, 1.413616694);

	for (var n = 0; n < 5 && (angle > aRadians[n]); n++);

	return n;
}

// Returns the real score because every pie is divided by different circles.
Game.prototype.realScore = function(hypo, score) {
	var real;
	var aCircle = new Array(5, 11, 67, 75, 131, 140);

	if (hypo < aCircle[0]) {
		real = 50;
		this.throwType = this.IS_MIDDLE;
	} else if (hypo < aCircle[1]) {
		real = 25;
		this.throwType = this.IS_ROUNDM;
	} else if (hypo > aCircle[2] && hypo < aCircle[3]) {
		real = score * 3;
		this.throwType = this.IS_TREBLE;
	} else if (hypo > aCircle[4] && hypo < aCircle[5]) {
		real = score * 2;
		this.throwType = this.IS_DOUBLE;
	} else if (hypo > aCircle[5]) {
		real = 0;
		this.throwType = this.IS_OUTSIDE;
	} else {
		real = score;
		this.throwType = this.IS_SINGLE;
	}

  return real;
}