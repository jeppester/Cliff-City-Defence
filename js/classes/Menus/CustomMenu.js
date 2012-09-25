/*
CustomMenu:
An object for creating a simple menu with a custom number of buttons with custom functionality

Requires:
	Button
*/

jseCreateClass('CustomMenu');
jseExtend(CustomMenu, Animation);
jseExtend(CustomMenu, ObjectContainer);

CustomMenu.prototype.customMenu = function (_x, _y, _buttons, _addOpt) {
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

	this.x = _x;
	this.y = _y;
	this.opacity = 1;

	// Load additional options
	copyVars(_addOpt, this);

	engine.registerObject(this);
	engine.addActivityToLoop(this, this.update, 'onRunning');
	engine.addActivityToLoop(this, this.update, 'onPaused');

	var i,
		b;
	for (i = 0; i < _buttons.length; i ++) {
		b = _buttons[i];

		this.addChild(
			new Button(this.x, this.y - 62 * (_buttons.length - 1) / 2 + i * 62, 0, b.text, b.onClick, {opacity: this.opacity})
		);
	}
};

CustomMenu.prototype.enable = function () {
	for (var i = 0; i < this.children.length; i ++) {
		this.children[i].enable();
	}
};

CustomMenu.prototype.disable = function () {
	for (var i = 0; i < this.children.length; i ++) {
		this.children[i].disable();
	}
};

CustomMenu.prototype.update = function () {
	var i,
		btn;
	for (i = 0; i < this.children.length; i ++) {
		btn = this.children[i];
		btn.x = this.x;
		btn.y = this.y - 62 * (this.children.length - 1) / 2 + i * 62;
		btn.opacity = this.opacity;
	}
};