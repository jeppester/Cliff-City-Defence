/*
Button:
A simple button with a custom function for handling a click

Requires:
	Sprite
	Mouse
	TextBlock
*/

jseCreateClass('Button');
jseExtend(Button, Sprite);
jseExtend(Button, ObjectContainer);

// Constructor
Button.prototype.button = function (_x, _y, _dir, _text, _onClick, _addOpt) {
	// Extend Sprite
	this.sprite('Dialog.Button', _x, _y, _dir, _addOpt);

	this.disabled = false;

	if (!_onClick || !_text) {return false; }
	this.onClick = _onClick;
	this.textBlock = this.addChild(new TextBlock(_text, this.x - 108, this.y - 13, 217, {'font': '16px Verdana', 'lineHeight': 20, 'align': 'center', opacity: this.opacity}));

	engine.addActivityToLoop(this, this.update, 'onPaused');
	engine.addActivityToLoop(this, this.update, 'onRunning');
};

Button.prototype.enable = function () {
	this.disabled = false;
};

Button.prototype.disable = function () {
	this.disabled = true;
};

Button.prototype.update = function () {
	this.textBlock.x = this.x - 108;
	this.textBlock.y = this.y - 13;
	this.textBlock.opacity = this.opacity;

	if (this.disabled) {
		this.setSource('Dialog.ButtonDisabled');
		return;
	}

	// Check for hover
	if (Math.abs(mouse.x - this.x) < 84 && Math.abs(mouse.y - this.y) < 27) {
		this.setSource('Dialog.ButtonSelected');
	}
	else {
		this.setSource('Dialog.Button');
	}

	// Check for pressed
	if (mouse.squareIsPressed(this.x - 84, this.y - 27, 168, 54)) {
		this.onClick();
	}
};