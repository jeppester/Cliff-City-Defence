GunShot = function (_x, _y, _dir, _speed, _damage, _blastRange, _bmSource, _target, _gun) {

	this.target = _target !== undefined ? _target: false;

	this.speed = _speed;
	this.dmg = _damage;
	this.blastRange = _blastRange;
	this.gun = _gun;

	// Extend View.GameObject
	_x = _x ? _x: 0;
	_y = _y ? _y: 0;

	_speed = new Math.Vector().setFromDirection(_dir, this.speed);

	View.GameObject.call(this, _bmSource, _x, _y, _dir, {speed: _speed, loop: main.runningLoop, offset: new Math.Vector(17, 1)});
	if (this.gun.type==1) {
		engine.currentRoom.loops.eachFrame.attachFunction(this, this.cols);
	}
	else {
		engine.currentRoom.loops.collisionChecking.attachFunction(this, this.cols);
	}
};

GunShot.prototype = Object.create(View.GameObject.prototype);

GunShot.prototype.cols = function () {
	var rocks, i, cObj, cDist;

	// If not alive, do nothing
	if (!this.alive) {return; }

	// Destroy the bullet if it's outside the level
	this.doBorders();

	// If this is an exploding bullet, do explosion when the height is above the targets height
	if (this.blastRange) {
		if (this.y < this.target.y) {
			engine.purge(this);
			this.explode();
			return;
		}
	}

	// Check for collisions with rocks
	rocks = main.depths[5].getChildren();
	for (i = 0; i < rocks.length; i ++) {
		cObj = rocks[i];
		if (!cObj.alive) {continue; }

		cDist = cObj.bm.width / 2;

		if (Math.sqrt(Math.pow(cObj.x - this.x, 2) + Math.pow(cObj.y - this.y, 2)) < cDist) {
			engine.purge(this);
			this.explode();
			break;
		}
	}
};

GunShot.prototype.doBorders = function () {
	if (this.x < 40 || this.x > engine.arena.offsetWidth - 40) {
		engine.purge(this);
	}

	if (this.y > engine.arena.offsetHeight - 200 && this.speed.y > 0) {
		engine.purge(this);
	}
	if (this.y < - 17) {
		engine.purge(this);
	}
};

GunShot.prototype.explode = function () {
	var rocks, i, bObj, bDist, objDist, blastDist, dmg;

	main.depths[7].addChildren(
		new Explosion('Effects.BlastWave', this.x, this.y, this.blastRange * 2 + this.bm.width, 400)
	);

	rocks = main.depths[5].getChildren();
	for (i = 0; i < rocks.length; i ++) {
		bObj = rocks[i];
		if (!bObj.alive) {continue; }

		// Calculate the distance between the objects
		objDist = Math.sqrt(Math.pow(bObj.x - this.x, 2) + Math.pow(bObj.y - this.y, 2));
		blastDist = objDist - bObj.bm.width / 2;

		if (blastDist <= 0) {
			dmg = this.dmg;
		}
		else if (blastDist < this.blastRange) {
			dmg = this.dmg - Math.min(blastDist / this.blastRange, 1) * this.dmg;
		}
		else {
			continue;
		}

		// Damage the rock according to the distance
		//console.log('Range: ' + blastDist + ' / ' + this.blastRange + ', Damage: ' + dmg + ' / ' + this.dmg);
		bObj.damage(dmg, this.gun);
		if (!bObj.alive && this.gun) {
			this.gun.addKill();
		}
	}
};
