SpriteButton = function (x, y, onClick, sprite1, sprite2) {
	if (x === undefined) {throw new Error('Argument missing: x'); }
	if (y === undefined) {throw new Error('Argument missing: y'); }
	if (sprite1 === undefined) {throw new Error('Argument missing: sprite1'); }
	if (onClick === undefined) {throw new Error('Argument missing: onClick'); }

	// Extend view
	View.Container.call(this);

	this.disabled = false;

	engine.currentRoom.loops.eachFrame.attachFunction(this, this.update);

	this.x = x;
	this.y = y;
	this.opacity = 1;
	this.direction = 0;

	this.onClick = onClick;
	this.bg = new View.Sprite(sprite1, x, y, 0);
	this.fg = sprite2 === undefined  ?  false : new View.Sprite(sprite2, x, y, 0);

	this.addChildren(this.bg);
	if (this.fg) {
		this.addChildren(this.fg);
	}
};

SpriteButton.prototype = Object.create(View.Container.prototype);
SpriteButton.import(Mixin.Animatable);

SpriteButton.prototype.enable = function () {
	this.disabled = false;
};

SpriteButton.prototype.disable = function () {
	this.disabled = true;
};

SpriteButton.prototype.update = function () {
	var sprX, sprY, pos, checkShape;

	this.bg.opacity = this.opacity;

	if (this.fg) {
		this.fg.opacity = this.opacity;
	}

	if (this.disabled) {
		return;
	}

	// Check for hover and click
	sprX = this.bg.x - this.bg.offset.x;
	sprY = this.bg.y - this.bg.offset.y;

	pos = this.bg.getRoomPosition().subtract(this.bg.offset);
	checkShape = new Math.Rectangle(pos.x, pos.y, this.bg.bm.width, this.bg.bm.height);

	if (pointer.shapeIsPressed(MOUSE_TOUCH_ANY, checkShape)) {
		this.onClick();
	}
};
