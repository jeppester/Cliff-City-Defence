/*
GravityObject:
Test object affected by the (simplified) laws of gravity

Requires;
	GameObject
	Sprite
	Animator
	Loader
*/

function GravityObject(_src, _depth, _x, _y, _dir, _addOpt) {
	//Extend GameObject
	GameObject.call(this, _src, _depth, _x, _y, _dir, _addOpt);

	this.gravity = this.gravity ? this.gravity : 0;
	this.gravDir = this.gravity_direction ? this.gravity_direction : Math.PI/2;

	this.step = function() {
		this.doGrav();
		this.doBorders();
	}

	this.doGrav = function() {
		this.dX += Math.cos(this.gravDir) * this.gravity * (now - last) / 1000;
		this.dY += Math.sin(this.gravDir) * this.gravity * (now - last) / 1000;
	}

	this.doBorders = function() {
		var border = false;
		if (this.x < this.bmSize / 2 || this.x > canvasResX - this.bmSize / 2) {

			while (this.x < this.bmSize / 2 || this.x > canvasResX - this.bmSize / 2) {
				this.x -= this.dX * (now - last) / 1000;
			}

			this.dX = -this.dX;
		}

		if (this.y > canvasResY - this.bmSize / 2) {
			this.y = canvasResY - this.bmSize / 2;
			if (Math.abs(this.dY) < 100) {
				this.dY *= -0.4;
				if (Math.abs(this.dY * (now - last) / 1000) < 1) {
					this.dY = 0;
				}
			} else {
				this.dY = -this.dY * 0.6;
			}

			this.dX *= 0.8;
		}
	}
}
