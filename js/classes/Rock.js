Rock = function (x, y, type, level, dir, speed) {
	var sprite, dmgSprite, grav;

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
	speed = speed !== undefined ? speed : 150;

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
	speed = new Math.Vector(Math.cos(dir) * speed, Math.sin(dir) * speed);

	// Extend GravityObject
	GravityObject.call(this, sprite, x, y, dir, {speed: speed, gravity: grav, loop: main.runningLoop});
	this.dmgSprite = new View.Sprite(dmgSprite, x, y, dir);
	this.dmgSprite.opacity = 0;
	this.addChildren(this.dmgSprite);

	if (level.onStep) {
		engine.currentRoom.loops.onRunning.attachFunction(this, level.onStep);
	} else if (data.rocks[type].onStep) {
		engine.currentRoom.loops.onRunning.attachFunction(this, data.rocks[type].onStep);
	}

	engine.currentRoom.loops.onRunning.attachFunction(this, this.step);

	this.impacted = false;
};

Rock.prototype = Object.create(GravityObject.prototype);

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
		engine.purge(this);
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

		main.depths[8].addChildren(new ScorePoints(value, this.x, this.y));
	}
};

Rock.prototype.step = function () {
	this.dmgSprite.x = this.x;
	this.dmgSprite.y = this.y;
	this.dmgSprite.direction = this.direction;
};

Rock.prototype.remove = function (time) {
	var animOpt;

	if (this.alive) {
		this.alive = false;

		// Animate removal
		time = time  ?  time : 150;
		animOpt = {'size': 1.5, 'opacity': 0};
		this.animate(animOpt, {'dur': time, callback: "engine.purge('" + this.id + "')", 'layer': 1});
		this.dmgSprite.animate(animOpt, {'dur': time, callback: "engine.purge('" + this.dmgSprite.id + "')", 'layer': 1});

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
			this.x -= this.speed.x * (engine.now - engine.last) / 1000;
		}

		this.speed.x = -this.speed.x;
	}

	if (this.y > engine.canvasResY - 35) {
		this.impacted = true;
		engine.purge(this);
	}

	if (this.speed.y > this.maxSpeed) {
		this.speed.y = this.maxSpeed;
	}

	this.direction = Math.atan2(this.speed.y, this.speed.x);
};
