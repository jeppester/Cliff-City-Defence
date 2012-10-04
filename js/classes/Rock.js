jseCreateClass('Rock');
jseExtend(Rock, GravityObject);

Rock.prototype.rock = function (x, y, type, level, dir, speed) {
	var sprite, dmgSprite, acc, grav, dX, dY;

	if (x === undefined) {
		throw new Error('Missing argument: x');
	}
	if (y === undefined) {
		throw new Error('Missing argument: y');
	}
	if (type === undefined) {
		throw new Error('Missing argument: type');
	}
	if (level === undefined) {
		throw new Error('Missing argument: level');
	}

	dir = dir !== undefined ? dir : Math.PI / 2;
	acc = 5000;
	speed = speed !== undefined ? speed : acc * engine.loopSpeed / 1000;

	// Fetch rock details based on type and level
	this.type = type;
	this.level = level;
	level = data.rocks[this.type].levels[this.level];
	this.maxLife = level.life;
	this.life = level.life;
	this.value = level.value;
	this.maxSpeed = level.maxSpeed;
	sprite = level.sprite !== undefined ? level.sprite : data.rocks[type].sprite;
	dmgSprite = level.damageSprite !== undefined ? level.damageSprite : data.rocks[type].dmgSprite;
	grav = level.gravity;
	dX = Math.cos(dir) * speed;
	dY = Math.sin(dir) * speed;

	// Extend GravityObject
	this.gravityObject(sprite, x, y, dir, {'dX': dX, 'dY': dY, 'gravity': grav, loop: "onRunning"});
	this.dmgSprite = this.addChild(new Sprite(dmgSprite, x, y, dir));
	this.dmgSprite.opacity = 0;

	if (level.onStep) {
		engine.addActivityToLoop(this, level.onStep, 'onRunning');
	} else if (data.rocks[type].onStep) {
		engine.addActivityToLoop(this, data.rocks[type].onStep, 'onRunning');
	}

	engine.addActivityToLoop(this, this.step, 'onRunning');

	this.impacted = false;
};

Rock.prototype.damage = function (dhp, damagedBy) {
	var relDist, value;

	this.life = Math.max(0, this.life - dhp);

	this.dmgSprite.opacity = (this.maxLife - this.life) / this.maxLife;

	if (data.rocks[this.type].levels[this.level].onDamaged) {
		data.rocks[this.type].levels[this.level].onDamaged.call(this, damagedBy, dhp);
	} else if (data.rocks[this.type].onDamaged) {
		data.rocks[this.type].onDamaged.call(this, damagedBy, dhp);
	}

	if (this.life === 0) {
		this.remove();
		player.rocksDestroyed ++;

		// Calculate the points, based on how far the rock got
		relDist = 1 - (this.y - 150) / 450;
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
};

Rock.prototype.remove = function (time) {
	var animOpt;

	if (this.alive) {
		this.alive = false;

		// Animate removal
		time = time  ?  time : 150;
		animOpt = {'bmSize': 1.5, 'opacity': 0};
		this.animate(animOpt, {'dur': time, callback: "jsePurge('" + this.id + "')", 'layer': 1});
		this.dmgSprite.animate(animOpt, {'dur': time, callback: "jsePurge('" + this.dmgSprite.id + "')", 'layer': 1});

		// Save rock stats for level stat calculation
		stageController.stats.rocks.push({
			fallDistance: this.y,
			impacted: this.impacted
		});

		// Run custom onDestroy function (for rocks with special behaevior when destroyed)
		if (data.rocks[this.type].levels[this.level].onDestroy) {
			data.rocks[this.type].levels[this.level].onDestroy.call(this);
		} else if (data.rocks[this.type].onDestroy) {
			data.rocks[this.type].onDestroy.call(this);
		}

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