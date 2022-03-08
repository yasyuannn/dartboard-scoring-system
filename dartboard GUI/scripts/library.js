/* A library of generic Javascript functions. */

var isIE = document.all;
var isNN = !document.all && document.getElementById;
var isN4 = document.layers;

var DOM = {
	get: function(el) {
		if (typeof el === 'string') {
			return document.getElementById(el);
		} else {
			return el;
		}
	},
	add: function(el, dest) {
		var el = this.get(el);
		var dest = this.get(dest);

		dest.appendChild(el);
	},
	remove: function(el) {
		var el = this.get(el);

		el.parentNode.removeChild(el);
	}
};

var Event = {
	add: function() {
		if (window.addEventListener) {
			return function(el, type, fn) {
				DOM.get(el).addEventListener(type, fn, false);
			};
		} else if (window.attachEvent) {
			return function(el, type, fn) {
				var f = function() {
					fn.call(DOM.get(el), window.event);
				};
				DOM.get(el).attachEvent('on' + type, f);
			};
		}
	}()
};

function setText(id, txt) {	// id - the object identifier
	DOM.get(id).innerHTML = txt;
	
	return txt;
}

// Gets a triangle's hypotenuse using the Pythagoras's theorem
// a - triangle's base; c - triangle's height
function hypotenuse(a, c) {
	return Math.sqrt(Math.pow(a, 2) + Math.pow(c, 2));
}

// blocking function in Javascript.
function sleep(delay) {
	var start = new Date().getTime();

	while (new Date().getTime() < start + delay);
}

// Check if the received argument is empty.
function is_empty(arg) {
	return (arg == null || (typeof(arg) == 'string' && arg == ''));
}
