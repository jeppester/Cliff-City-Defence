/*
GravityObject:
Test object affected by the (simplified) laws of gravity

Requires;
	GameObject
	Sprite
	Animator
	Loader
*/

jseCreateClass('GravityObject');
jseExtend(GravityObject, GameObject);

GravityObject.prototype.gravityObject = function (_src, _x, _y, _dir, _addOpt) {
	// Extend GameObject
	this.gameObject(_src, _x, _y, _dir, _addOpt);

	engine.addActivityToLoop(this, this.doGrav, this.loop);
	engine.addActivityToLoop(this, this.doBorders, this.loop);

	this.gravity = this.gravity  ?  this.gravity : 0;
	this.gravDir = this.gravity_direction  ?  this.gravity_direction : Math.PI / 2;
};

GravityObject.prototype.step = function () {
	this.doGrav();
	this.doBorders();
};

GravityObject.prototype.doGrav = function () {
	this.dX += Math.cos(this.gravDir) * this.gravity * (engine.now - engine.last) / 1000;
	this.dY += Math.sin(this.gravDir) * this.gravity * (engine.now - engine.last) / 1000;
};

GravityObject.prototype.doBorders = function () {
	if (this.x < this.bmSize / 2 || this.x > engine.canvasResX - this.bmSize / 2) {

		while (this.x < this.bmSize / 2 || this.x > engine.canvasResX - this.bmSize / 2) {
			this.x -= this.dX * (engine.now - engine.last) / 1000;
		}

		this.dX = -this.dX;
	}

	if (this.y > engine.canvasResY - this.bmSize / 2) {
		this.y = engine.canvasResY - this.bmSize / 2;
		if (Math.abs(this.dY) < 100) {
			this.dY *= -0.4;
			if (Math.abs(this.dY * (engine.now - engine.last) / 1000) < 1) {
				this.dY = 0;
			}
		} else {
			this.dY = -this.dY * 0.6;
		}

		this.dX *= 0.8;
	}
};