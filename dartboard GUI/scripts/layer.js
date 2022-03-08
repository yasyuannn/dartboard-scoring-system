/* Class Layer. */

function Layer(name, x, y, width, height, html, zindex, visible) {
	// at least the layer's name is mandatory
	if (name == null) return;

	this.name = name;									// the layer's name
	this.x = x;									 		// the layer's coords
	this.y = y;
	this.width = width;									// the layer's size
	this.height = height;
	this.zindex = zindex == null ? 0 : zindex;			// the layer's zindex
	this.visible = visible == null ? true : visible;	// true/false to show/hide the layer

	this.html =
		'<div id="' + this.name +
		'" style="position:absolute' +
		';top:' + this.y +
		';left:' + this.x +
		';width:' + this.width +
		';height:' + this.height +
		';z-index:' + this.zindex +
		';visibility:' + (this.visible ? 'visible' : 'hidden') +
		';">' + (html == null ? '' : html) +
		'</div>';
}

// Show the layer.
Layer.prototype.show = function() {
	if (!this.visible) {
		this.visible = true;
		DOM.get(this.name).style.visibility = 'visible';
	}
}

// Hide the layer.
Layer.prototype.hide = function() {
	if (this.visible) {
		this.visible = false;
		DOM.get(this.name).style.visibility = 'hidden';
	}
}

// Puts HTML code into a layer.
Layer.prototype.setHTML = function(html) {
	DOM.get(this.name).innerHTML = html;
}

// Moves a layer by (x,y) from the layer's current position.
Layer.prototype.moveBy = function(x, y) {
	this.moveTo(this.x + x, this.y + y)
}

// Moves a layer to a specified position.
Layer.prototype.moveTo = function(x, y) {
	DOM.get(this.name).style.left = (this.x = x);
	DOM.get(this.name).style.top = (this.y = y);
}

// Sets the layer code and makes it visible.
Layer.prototype.create = function() {
	var el = document.createElement('div');

	el.innerHTML = this.html;
	DOM.add(el, document.body);
}