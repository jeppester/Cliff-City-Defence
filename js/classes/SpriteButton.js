jseCreateClass('SpriteButton');
jseExtend(SpriteButton, ObjectContainer);
jseExtend(SpriteButton, Animation);

SpriteButton.prototype.spriteButton = function (x, y, onClick, sprite1, sprite2) {
	if (x === undefined) {throw new Error('Argument missing: x'); }
	if (y === undefined) {throw new Error('Argument missing: y'); }
	if (sprite1 === undefined) {throw new Error('Argument missing: sprite1'); }
	if (onClick === undefined) {throw new Error('Argument missing: onClick'); }

	this.disabled = false;

	engine.addActivityToLoop(this, this.update, 'eachFrame');

	this.x = x;
	this.y = y;
	this.opacity = 1;

	this.onClick = onClick;
	this.bg = this.addChild(new Sprite(sprite1, x, y, 0));
	this.fg = sprite2 === undefined  ?  false : this.addChild(new Sprite(sprite2, x, y, 0));
};

SpriteButton.prototype.enable = function () {
	this.disabled = false;
};

SpriteButton.prototype.disable = function () {
	this.disabled = true;
};

SpriteButton.prototype.update = function () {
	this.bg.x = this.x;
	this.bg.y = this.y;
	this.bg.opacity = this.opacity;

	if (this.fg) {
		this.fg.x = this.x;
		this.fg.y = this.y;
		this.fg.opacity = this.opacity;
	}

	if (this.disabled) {
		return;
	}

	// Check for hover and click
	var sprX = this.bg.x - this.bg.xOff,
		sprY = this.bg.y - this.bg.yOff;

	if (mouse.squareIsPressed(sprX, sprY, this.bg.bmWidth, this.bg.bmHeight)) {
		this.onClick(1);
	}
};