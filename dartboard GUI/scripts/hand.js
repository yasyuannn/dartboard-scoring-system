/* Class Hand. */

Hand.prototype = new Layer;			// define sub-class of Layer

Hand.prototype.constructor = Hand;
function Hand(name, boardX, boardY, boardWidth, boardHeight) { // name - layer's name;
	this.WIDTH = 41;
	this.HEIGHT = 51;
	this.STEP = 4;
	this.MARGIN = 10;
	this.MARGIN_RIGHT = boardWidth - this.WIDTH - this.MARGIN;
	this.MARGIN_BOTTOM = boardHeight - this.HEIGHT - this.MARGIN;
	this.CENTER_X = boardWidth / 2 - this.WIDTH / 2;
	this.CENTER_Y = boardHeight / 2 - this.HEIGHT / 2;

	// call the super-class constructor
	Layer.call(this, name, this.boardX, this.boardY, this.WIDTH, this.HEIGHT);
}

Hand.prototype.move = function() {
	// pull (x, y)
}