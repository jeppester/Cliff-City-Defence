/*
CustomMenu:
An object for creating a simple menu with a custom number of buttons with custom functionality

Requires:
	Button
*/

CustomMenu = function (_x, _y, _buttons, _additionalProperties) {
	var i, b;

	if (_x === undefined) {
		throw new Error('Missing argument: x');
	}
	if (_y === undefined) {
		throw new Error('Missing argument: y');
	}
	if (_buttons === undefined) {
		throw new Error('Missing argument: buttons');
	}
	if (_buttons.length === 0) {
		throw new Error('Argument buttons is empty');
	}

	// Extend view
	View.Container.call(this);

	this.x = _x;
	this.y = _y;
	this.opacity = 1;

	// Load additional properties
	this.importProperties(_additionalProperties);

	engine.registerObject(this);
	engine.currentRoom.loops.onRunning.attachFunction(this, this.update);
	engine.currentRoom.loops.onPaused.attachFunction(this, this.update);

	for (i = 0; i < _buttons.length; i ++) {
		b = _buttons[i];

		this.addChildren(
			new Button(0, - 62 * (_buttons.length - 1) / 2 + i * 62, 0, b.text, b.onClick, {opacity: this.opacity})
		);
	}
};

CustomMenu.prototype = Object.create(View.Container.prototype);
CustomMenu.prototype.import(Mixin.Animatable);

CustomMenu.prototype.enable = function () {
	var i;

	for (i = 0; i < this.children.length; i ++) {
		this.children[i].enable();
	}
};

CustomMenu.prototype.disable = function () {
	var i;

	for (i = 0; i < this.children.length; i ++) {
		this.children[i].disable();
	}
};

CustomMenu.prototype.update = function () {
	var i,
		btn;
	for (i = 0; i < this.children.length; i ++) {
		btn = this.children[i];
		btn.opacity = this.opacity;
	}
};
