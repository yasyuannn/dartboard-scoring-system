// game object
var oGame;

// game events
Event.add(window, 'load', function() {
	oGame = new Game();
});

Event.add(window, 'resize', function() {
	oGame.resize();
});

Event.add(document, 'keydown', function(key, x, y) {
	return oGame.keyDown(key.which, x, y);
});