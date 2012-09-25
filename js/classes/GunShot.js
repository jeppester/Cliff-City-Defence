jseCreateClass('GunShot');
jseExtend(GunShot, GameObject);

GunShot.prototype.gunShot = function (_x, _y, _dir, _speed, _damage, _blastRange, _bmSource, _target, _gun) {
	this.target = _target !== undefined ? _target: false;

	this.speed = _speed;
	this.dmg = _damage;
	this.blastRange = _blastRange;
	this.gun = _gun;

	// Extend gameObject
	_x = _x ? _x: 0;
	_y = _y ? _y: 0;

	var _dX = Math.cos(_dir) * this.speed,
		_dY = Math.sin(_dir) * this.speed;

	this.gameObject(_bmSource, _x, _y, _dir, {'dX': _dX, 'dY': _dY, 'loop': 'onRunning', 'xOff': 17, 'yOff': 1});
	engine.addActivityToLoop(this, this.cols, 'collisionChecking');
};

GunShot.prototype.cols = function () {
	var rocks, i, cObj, cDist;

	// If not alive, do nothing
	if (!this.alive) {return; }

	// Destroy the bullet if it's outside the level
	this.doBorders();

	// If this is an exploding bullet, do explosion when the height is above the targets height
	if (this.blastRange) {
		if (this.y < this.target.y) {
			this.remove();
			this.explode();
			return;
		}
	}

	// Check for collisions with rocks
	var rocks = engine.depth[5].getChildren();
	for (i = 0; i < rocks.length; i ++) {
		cObj = rocks[i];
		if (!cObj.alive) {continue; }

		cDist = cObj.bmWidth / 2;

		if (Math.sqrt(Math.pow(cObj.x - this.x, 2) + Math.pow(cObj.y - this.y, 2)) < cDist) {
			this.remove();
			this.explode();
			break;
		}
	}
};

GunShot.prototype.doBorders = function () {
	if (this.x < 40 || this.x > engine.arena.offsetWidth - 40) {
		this.remove();
	}

	if (this.y > engine.arena.offsetHeight - 200 && this.dY > 0) {
		this.remove();
	}
	if (this.y < - 17) {
		this.remove();
	}
};

GunShot.prototype.explode = function () {
	var rocks, i, bObj, bDist, objDist, blastDist, dmg;

	engine.depth[7].addChild(
		new Explosion('Effects.BlastWave', this.x, this.y, this.blastRange * 2 + this.bmWidth, 400)
	);

	rocks = engine.depth[5].getChildren();
	for (i = 0; i < rocks.length; i ++) {
		bObj = rocks[i];
		if (!bObj.alive) {continue; }

		// Calculate the distance between the objects
		objDist = Math.sqrt(Math.pow(bObj.x - this.x, 2) + Math.pow(bObj.y - this.y, 2));
		blastDist = objDist - bObj.bmWidth / 2;

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