/* Class Timer. */

function Timer() {
	this.id = 0;		// timer identifier
	this.func = null;	// timer call-back function
}

Timer.prototype.is_active = function() {
	return (this.id ? true : false);
}

Timer.prototype.start = function(func, time) {
	// stop any active timer before starting a new one
	if (this.is_active()) this.stop();

	this.id = setInterval((this.func = func), time);
}

Timer.prototype.stop = function() {
	clearInterval(this.id);
	this.id = 0;
}

Timer.prototype.change = function(time) {
	this.start(this.func, time);
}