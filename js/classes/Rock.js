jseCreateClass('Rock');
jseExtend(Rock, GravityObject);

Rock.prototype.rock = function (_spr, _dmgSpr, _x, _dir, _grav, _life, _value, _maxSpeed, _onStep, _onDestroy) {
	if (_dmgSpr === undefined) {
		throw new Error('Missing argument "dmgSpr"');
	}
	if (_life === undefined) {
		throw new Error('Missing argument "life"');
	}
	if (_value === undefined) {
		throw new Error('Missing argument "value"');
	}
	if (_grav === undefined) {
		throw new Error('Missing argument "grav"');
	}
	if (_maxSpeed === undefined) {
		throw new Error('Missing argument "maxSpeed"');
	}

	// Set onStep and onDestroy functions
	this.onStep = _onStep === undefined  ?  function () {} : _onStep;
	this.onDestroy = _onDestroy === undefined  ?  function () {} : _onDestroy;

	// Extend GravityObject
	var acc = 5000,
		x = _x,
		y = -25,
		dX = Math.cos(_dir) * acc * engine.loopSpeed / 1000,
		dY = Math.sin(_dir) * acc * engine.loopSpeed / 1000;

	this.gravityObject(_spr, x, y, _dir, {'dX': dX, 'dY': dY, 'gravity': _grav, loop: "onRunning"});

	engine.addActivityToLoop(this, this.step, 'onRunning');

	this.dmgSprite = this.addChild(new Sprite(_dmgSpr, x, y, _dir));
	this.dmgSprite.opacity = 0;

	this.maxLife = _life;
	this.life = _life;
	this.value = _value;
	this.maxSpeed = _maxSpeed;
	this.impacted = false;
};

Rock.prototype.damage = function (dhp, damagedBy) {
	this.life = Math.max(0, this.life - dhp);
	this.dmgSprite.opacity = (this.maxLife - this.life) / this.maxLife;

	if (this.life === 0) {
		this.remove();
		player.rocksDestroyed ++;

		// Calculate the points, based on how far the rock got
		var relDist = 1 - (this.y - 150) / 450,
			value = Math.min(1, relDist) * this.value;

		if (AiGun.prototype.isPrototypeOf(damagedBy)) {
			value *= player.rockValueFactorAiGun;
		}
		if (Rocket.prototype.isPrototypeOf(damagedBy)) {
			value *= player.rockValueFactorRocket;
		}

		value = Math.round(value / 10) * 10;

		engine.depth[8].addChild(new ScorePoints(value, this.x, this.y));
	}
};

Rock.prototype.step = function () {
	this.dmgSprite.x = this.x;
	this.dmgSprite.y = this.y;
	this.dmgSprite.dir = this.dir;
	this.doGrav();
	this.doBorders();
	this.onStep();
};

Rock.prototype.remove = function (time) {
	if (this.alive) {
		this.alive = false;

		// Animate removal
		time = time  ?  time : 150;
		var animOpt = {'bmSize': 1.5, 'opacity': 0};
		this.animate(animOpt, {'dur': time, callback: "jsePurge('" + this.id + "')", 'layer': 1});
		this.dmgSprite.animate(animOpt, {'dur': time, callback: "jsePurge('" + this.dmgSprite.id + "')", 'layer': 1});

		// Save rock stats for level stat calculation
		stageController.stats.rocks.push({
			fallDistance: this.y,
			impacted: this.impacted,
		});

		// Run custom onDestroy function (for rocks with special behaevior when destroyed)
		this.onDestroy();

		// Play rock die sound
		// loader.getSound('Rocks.Boulder').play();

		return true;
	}
};

Rock.prototype.doBorders = function () {
	if (this.x < 50 || this.x > engine.canvasResX - 50) {

		while (this.x < 50 || this.x > engine.canvasResX - 50) {
			this.x -= this.dX * (engine.now - engine.last) / 1000;
		}

		this.dX = -this.dX;
	}

	if (this.y > engine.canvasResY - 35) {
		this.impacted = true;
		this.remove();
	}

	if (this.dY > this.maxSpeed) {
		this.dY = this.maxSpeed;
	}

	this.dir = Math.atan2(this.dY, this.dX);
};