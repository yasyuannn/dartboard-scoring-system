/* Class Lang. */

function Lang(iso) {
	this.iso = iso == null ? 'en' : iso;

	this.lang = new Array();
	this.setLang(this.iso);
}

// Define the language strings.
Lang.prototype.setLang = function setLang(iso) {	
	if (iso == null) iso = this.iso;

	// language strings
	switch (iso) {
		default:
			this.lang = Array(
		/*0*/	'Now playing: ',
				'Bust!!! You lost your turn.',
				'Good arrow!',
				'Congratulations, you won!!!',
				'Are you sure you want to start a new game?',
		/*5*/	'Last arrow should be a double or 50.',
				'Darts',
				'turn',
				'Enter the player\'s new name.',
				'The game is paused. Press <Enter> to resume.',
		/*10*/	'Player 1',
				'Player 2',
				'No winner after 30 turns. Game is a draw.'
			);
	}
}

// Returns a language strings.
Lang.prototype.str = function str(id) {
	return this.lang[id];
}