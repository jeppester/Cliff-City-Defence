/*
Sprite:
A drawn bitmap with rotation and size.
Usually all graphical objects in a game extends a sprite.

Requirements:
	Animation
	Animator
*/

function Sprite() {
	// Inherit classes
	importClass(this,ObjectContainer);
	importClass(this,Animation);

	// Enable creation with "new [Class]"
	constructIfNew(this,this.sprite,arguments);
}

Sprite.prototype.sprite=function(_src, _depth, _x, _y, _dir, _addOpt) {
	// Load default options
	this.x = _x ? _x : 0;
	this.y = _y ? _y : 0;
	this.dir = _dir ? _dir : 0;
	this.depth = _depth!==undefined ? _depth : 0;

	this.id = "obj" + curId;
	curId++

	this.bmSize  = 1;
	this.opacity = 1;

	// Load additional options
	copyVars(_addOpt,this);

	if (!useCanvas) {
		this.bm = new Image();
		this.bm.src = loader.images[_src].src;
		this.bm.style.position = "absolute";
	} else {
		this.bm = loader.images[_src];
	}
	
	if (this.bm==undefined) {
		console.log(_src);
	}
	this.bmWidth = this.bm.width;
	this.bmHeight= this.bm.height;
	this.xOff = this.xOff!=undefined ? this.xOff : this.bmWidth/2;
	this.yOff = this.yOff!=undefined ? this.yOff : this.bmHeight/2;
	
	// Add object in array
	depth[this.depth][this.id] = this;
}

Sprite.prototype.cols = function() {};

Sprite.prototype.drawCanvas=function() {
	// Draw Sprite on canvas
	var c=depthMap[this.depth];
	c.save();
	c.translate(this.x, this.y);
	c.globalAlpha = this.opacity;
	c.rotate(this.dir);
	c.drawImage(this.bm, -this.xOff*this.bmSize, -this.yOff*this.bmSize, this.bmWidth*this.bmSize, this.bmHeight*this.bmSize);
	c.restore();
}