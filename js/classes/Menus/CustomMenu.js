/*
CustomMenu:
An object for creating a simple menu with a custom number of buttons with custom functionality

Requires:
	Button
*/

function CustomMenu(_depth,_x,_y,_buttons) {
	// Inherit animation
	importClass(this,Animation);

	if (_depth===undefined) {
		throw new Error('Missing argument: depth');
	}
	if (_x===undefined) {
		throw new Error('Missing argument: x');
	}
	if (_y===undefined) {
		throw new Error('Missing argument: y');
	}

	if (_buttons===undefined) {
		throw new Error('Missing argument: buttons');
	}
	/*if (typeof _buttons !== "Array") {
		throw new Error('Argument buttons not array');
	}*/
	if (_buttons.length===0) {
		throw new Error('Argument buttons is empty');
	}

	this.depth=_depth;
	this.x=_x;
	this.y=_y;
	this.opacity=1;
	this.buttons=[];

	this.id = "obj" + curId;
	curId++
	updateObjects.onRunning[this.id]=this;
	updateObjects.onPaused[this.id]=this;

	for (var i=0; i<_buttons.length; i++) {
		var b=_buttons[i];

		this.buttons.push(
			new Button(this.depth,this.x,this.y-62*(_buttons.length-1)/2+i*62,0,b.text,b.onClick)
		);

		this.buttons[i].parent=this;
	}
}

CustomMenu.prototype.enable = function() {
	for (var i=0; i<this.buttons.length; i++) {
		this.buttons[i].enable();
	}
}

CustomMenu.prototype.disable = function() {
	for (var i=0; i<this.buttons.length; i++) {
		this.buttons[i].disable();
	}
}

CustomMenu.prototype.update=function() {
	for (var i=0; i<this.buttons.length; i++) {
		var btn=this.buttons[i];
		btn.x=this.x;
		btn.y=this.y-62*(this.buttons.length-1)/2+i*62;
		btn.opacity=this.opacity;
	}
}

CustomMenu.prototype.remove=function() {
	for (var i=0; i<this.buttons.length; i++) {
		this.buttons[i].remove();
	}
	redrawStaticLayers();
}