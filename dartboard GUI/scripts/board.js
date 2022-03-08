/* Class Board. */

Board.prototype = new Layer;			// define sub-class of Layer

Board.prototype.constructor = Board;
function Board(name) {
	this.WIDTH = 496;
	this.HEIGHT = 496;
	this.CENTER_X = this.WIDTH / 2;
	this.CENTER_Y = this.HEIGHT / 2;
	this.MARGIN = 30;

	this.IMAGE = 'images/board.gif';

	this.calcXY();

	// call the super-class constructor
	Layer.call(
		this,
		name,		// board layer's name
		this.x,
		this.y,
		this.WIDTH,
		this.HEIGHT,
		'<img border="0" src="' + this.IMAGE +
			'" width="' + this.WIDTH +
			'" height="' + this.HEIGHT +
			'" />'
	);
}

// Calculate the board's layer base coords.
Board.prototype.calcXY = function() {
	if (typeof(window.innerWidth) == 'number') {
		this.x = Math.floor((window.innerWidth - this.WIDTH) / 2);
		this.y = Math.floor((window.innerHeight - this.HEIGHT) / 2);
	}

	// set the minimum left and top margins allowed for the board
	if (this.x < this.MARGIN) this.x = this.MARGIN;
	if (this.y < this.MARGIN) this.y = this.MARGIN;
}
