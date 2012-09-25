/*
Sprite:
A drawn bitmap with rotation and size.
Usually all graphical objects in a game extends a sprite.

Requirements:
	Animation
	Animator
*/

jseCreateClass('Sprite');
jseExtend(Sprite, ObjectContainer);
jseExtend(Sprite, Animation);

Sprite.prototype.sprite = function (_src, _x, _y, _dir, _addOpt) {
	// Load default options
	this.x = _x  ?  _x : 0;
	this.y = _y  ?  _y : 0;
	this.dir = _dir  ?  _dir : 0;

	engine.registerObject(this);

	this.bmSize  = 1;
	this.opacity = 1;
	this.composite = 'source-over';

	// Load additional options
	copyVars(_addOpt, this);

	this.source = _src;
	this.refreshSource();

	if (!this.bm) {
		console.log(this.source);
		return;
	}
	this.bmWidth = this.bm.width;
	this.bmHeight = this.bm.height;
	this.xOff = this.xOff !== undefined  ?  this.xOff : this.bmWidth / 2;
	this.yOff = this.yOff !== undefined  ?  this.yOff : this.bmHeight / 2;
};

Sprite.prototype.refreshSource = function () {
	this.bm = loader.getImage(this.source);
};

Sprite.prototype.setSource = function (source) {
	if (this.source === source) {return; }
	this.source = source;
	this.refreshSource();
};

Sprite.prototype.cols = function () {};

Sprite.prototype.drawCanvas = function () {
	// Draw Sprite on canvas
	var c = this.ctx;
	c.save();
	c.translate(this.x, this.y);
	c.globalAlpha = this.opacity;
	c.rotate(this.dir);
	c.globalCompositeOperation = this.composite;
	try {
		c.drawImage(this.bm, - this.xOff * this.bmSize, - this.yOff * this.bmSize, this.bmWidth * this.bmSize, this.bmHeight * this.bmSize);
	} catch (e) {
		console.log(this.source);
		console.log(this.bm);
		engine.stopLoop();
		throw new Error(e);
	}
	c.restore();
};