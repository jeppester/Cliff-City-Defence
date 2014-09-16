/*
Button:
A simple button with a custom function for handling a click

Requires:
	Sprite
	Mouse
	TextBlock
*/

// Constructor
Button = function (_x, _y, _dir, _text, _onClick, _additionalProperties) {
	// Extend View.Sprite
	View.Sprite.call(this, 'Dialog.Button', _x, _y, _dir, _additionalProperties);

	this.disabled = false;

	if (!_onClick || !_text) {return false; }
	this.onClick = _onClick;
	this.text = new View.TextBlock(_text, -108, -13, 217, {'font': '16px Verdana', 'lineHeight': 20, 'alignment': 'center', opacity: this.opacity});
	this.addChildren(this.text);

	engine.currentRoom.loops.onPaused.attachFunction(this, this.update);
	engine.currentRoom.loops.onRunning.attachFunction(this, this.update);
};

Button.prototype = Object.create(View.Sprite.prototype);

Button.prototype.enable = function () {
	this.disabled = false;
};

Button.prototype.disable = function () {
	this.disabled = true;
};

Button.prototype.update = function () {
	var pos, checkShape;

	this.text.opacity = this.opacity;

	if (this.disabled) {
		this.setSource('Dialog.ButtonDisabled');
		return;
	}

	// Check for hover
	pos = this.getRoomPosition();
	checkShape = new Math.Rectangle(pos.x - 84, pos.y - 28, 168, 54);

	if (pointer.shapeIsHovered(checkShape)) {
		this.setSource('Dialog.ButtonSelected');
	}
	else {
		this.setSource('Dialog.Button');
	}

	// Check for pressed
	if (pointer.shapeIsPressed(MOUSE_TOUCH_ANY, checkShape)) {
		this.onClick();
	}
};
