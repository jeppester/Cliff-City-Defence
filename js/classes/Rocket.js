/*
Rocket:
A rocket fired from the main cannon

Requires:
	Sprite
	Player
	GravityObject
	Explosion
	Animator
*/

jseCreateClass('Rocket');
jseExtend(Rocket, GravityObject);

Rocket.prototype.rocket = function (_dir) {
	var acc = 20000,
		x = engine.canvasResX / 2,
		y = engine.canvasResY - 120,
		dX = player.rocketSpeedFactor * Math.cos(_dir) * acc * engine.loopSpeed / 1000,
		dY = player.rocketSpeedFactor * Math.sin(_dir) * acc * engine.loopSpeed / 1000,
		spr;

	switch (player.rocketFirePowerLevel) {
	case 0:
		spr = 'Projectiles.Rocket';
		this.dmg = 150;
		break;
	case 1:
		spr = 'Projectiles.DrillRocket';
		this.dmg = 200;
		break;
	case 2:
		spr = 'Projectiles.FireRocket';
		this.dmg = 250;
		break;
	case 3:
		spr = 'Projectiles.ElectricRocket';
		this.dmg = 300;
		break;
	case 4:
		spr = 'Projectiles.NuclearRocket';
		this.dmg = 350;
		break;
	}
	// Set blast range
	switch (player.rocketBlastRangeLevel) {
	case 1:
		this.blastRange = 20;
		break;
	case 2:
		this.blastRange = 40;
		break;
	case 3:
		this.blastRange = 60;
		break;
	case 4:
		this.blastRange = 80;
		break;
	default:
		this.blastRange = 0;
		break;
	}

	this.gravityObject(spr, x, y, _dir, {'dX': dX, 'dY': dY, 'gravity': 300, loop: "onRunning"});

	// Make blast range indicator
	this.blastRangeIndicator = new Sprite('Projectiles.BlastRangeIndicator' + player.rocketBlastRangeLevel, this.x, this.y, _dir, {xOff: - 10});
	engine.addActivityToLoop(this, this.updateBlastRangeIndicator, 'onRunning');
	this.addChild(this.blastRangeIndicator);

	// Add object to collision checking loop
	engine.addActivityToLoop(this, this.cols, 'collisionChecking');

	// Set the number of bounces
	// Indicates how many times the rocket has hit a wall and bounced
	this.bounces = 0;
};

Rocket.prototype.updateBlastRangeIndicator = function () {
	this.blastRangeIndicator.x = this.x;
	this.blastRangeIndicator.y = this.y;
	this.blastRangeIndicator.dir = this.dir;
	this.blastRangeIndicator.bmSize = this.bmSize;
	this.blastRangeIndicator.opacity = this.opacity;
};

Rocket.prototype.doBorders = function () {
	if (!this.alive) {return; }

	if (this.x < 50 || this.x > engine.canvasResX - 50) {
		// Bounce if the rocket has not already bounced the allowed number of times
		if (this.bounces >= player.rocketBounces) {
			this.remove();
			this.explode();
		}
		this.bounces ++;

		// Move the rock untill it's outside the wall
		while (this.x < this.bmSize / 2 || this.x > engine.canvasResX - this.bmSize / 2) {
			this.x -= this.dX / Math.abs(this.X);
		}

		// Negate the horisontal speed
		this.dX = -this.dX;
	}

	// If the rocket is too close to the buildings, selfdestroy it
	if (this.dY > 0 && this.y > engine.canvasResY - 250) {
		this.remove();
		this.explode();
	}

	// Set the sprites direction to the direction of the rockets vector
	this.dir = Math.atan2(this.dY, this.dX);
};

Rocket.prototype.cols = function () {
	var rocks, cObj, cDist;

	// Check for collisions with rocks
	if (!this.alive) {return; }

	rocks = engine.depth[5].getChildren();
	for (i = 0; i < rocks.length; i ++) {
		cObj = rocks[i];
		if (!cObj.alive) {continue; }

		cDist = this.bmWidth / 2 + cObj.bmWidth / 2;
		if (Math.sqrt(Math.pow(cObj.x - this.x, 2) + Math.pow(cObj.y - this.y, 2)) < cDist) {
			this.remove();
			this.explode();
			break;
		}
	}
};

Rocket.prototype.explode = function () {
	var beam, rocks, i, bObj, objDist, dmg, objAngle, blastDist;

	// Make explosion based on rocket type
	switch (player.rocketFirePowerLevel) {
	case 0:
		engine.depth[6].insertBefore(new Explosion('Effects.BlastWave', this.x, this.y, 10 + this.blastRange * 2 + this.bmWidth, 400), stageController.cliff);
		break;
	case 1:
		engine.depth[6].insertBefore(new Explosion('Effects.BlastWave', this.x, this.y, 10 + this.blastRange * 2 + this.bmWidth, 400), stageController.cliff);
		stageController.scheduleTask(function () {
			engine.depth[6].insertBefore(new Explosion('Effects.RockBlast', this.x, this.y, 10 + this.blastRange * 2 + this.bmWidth, 400), stageController.cliff);
		}, 100, 'onRunning', 'rocketBlast', this);
		stageController.scheduleTask(function () {
			engine.depth[6].insertBefore(new Explosion('Effects.RockBlast', this.x, this.y, 10 + this.blastRange * 2 + this.bmWidth, 400), stageController.cliff);
		}, 200, 'onRunning', 'rocketBlast', this);
		break;
	case 2:
		engine.depth[6].insertBefore(new Explosion('Effects.FireExplosion', this.x, this.y, 10 + this.blastRange * 2 + this.bmWidth, 600), stageController.cliff);
		stageController.scheduleTask(function () {
			engine.depth[6].insertBefore(new Explosion('Effects.FireExplosion', this.x - 10 + Math.random() * 20, this.y - 10 + Math.random() * 20, (10 + this.blastRange * 2 + this.bmWidth) *  0.7, 600), stageController.cliff);
		}, 100, 'onRunning', 'rocketBlast', this);
		stageController.scheduleTask(function () {
			engine.depth[6].insertBefore(new Explosion('Effects.FireExplosion', this.x - 10 + Math.random() * 20, this.y - 10 + Math.random() * 20, (10 + this.blastRange * 2 + this.bmWidth) *  0.5, 600), stageController.cliff);
		}, 200, 'onRunning', 'rocketBlast', this);
		break;
	case 3:
		engine.depth[6].insertBefore(new Explosion('Effects.ElectricExplosion', this.x, this.y, 10 + this.blastRange * 2 + this.bmWidth, 600), stageController.cliff);
		stageController.scheduleTask(function () {
			engine.depth[6].insertBefore(new Explosion('Effects.Lightning', this.x, this.y, 10 + this.blastRange * 2 + this.bmWidth, 400), stageController.cliff);
		}, 100, 'onRunning', 'rocketBlast', this);
		stageController.scheduleTask(function () {
			engine.depth[6].insertBefore(new Explosion('Effects.Lightning', this.x, this.y, 10 + this.blastRange * 2 + this.bmWidth, 400), stageController.cliff);
		}, 200, 'onRunning', 'rocketBlast', this);
		break;
	case 4:
		engine.depth[6].insertBefore(new Explosion('Effects.NuclearExplosion', this.x, this.y, 10 + this.blastRange * 2 + this.bmWidth, 800), stageController.cliff);
		stageController.scheduleTask(function () {
			engine.depth[6].insertBefore(new Explosion('Effects.NuclearBlastRing', this.x, this.y, (10 + this.blastRange * 2 + this.bmWidth), 700), stageController.cliff);
		}, 100, 'onRunning', 'rocketBlast', this);
		stageController.scheduleTask(function () {
			engine.depth[6].insertBefore(new Explosion('Effects.NuclearBlastRing2', this.x, this.y, (10 + this.blastRange * 2 + this.bmWidth)*2/3, 600), stageController.cliff);
		}, 200, 'onRunning', 'rocketBlast', this);
		break;
	}

	// Make light beam on composited night light layer
	if (engine.theme === "Night") {
		beam = new Explosion('Effects.LightBeam', this.x, this.y, this.blastRange * 4 + this.bmWidth, 600);
		beam.composite = 'destination-out';
		engine.depth[7].addChild(beam);
	}

	// Do damage to nearby rocks
	rocks = engine.depth[5].getChildren();
	for (i = 0; i < rocks.length; i ++) {
		bObj = rocks[i];
		if (!bObj.alive) {continue; }

		// Calculate the distance between the objects
		objDist = Math.sqrt(Math.pow(bObj.x - this.x, 2) + Math.pow(bObj.y - this.y, 2));
		blastDist = objDist - this.bmWidth / 2 - bObj.bmWidth / 2;

		if (blastDist <= 0) {
			dmg = this.dmg;
		}
		else if (blastDist < this.blastRange) {
			dmg = this.dmg - Math.min(blastDist / this.blastRange, 1) * this.dmg;
		}
		else {
			continue;
		}

		bObj.damage(dmg, this);

		// Push nearby object away from the explosion (if the rocket has a blast range)
		if (this.blastRange) {
			// Calculate the angle between the objects
			objAngle = Math.atan2(bObj.y - this.y, bObj.x - this.x);

			// Push the rock according to the explosion distance
			bObj.dX += dmg * 0.6 * Math.cos(objAngle);
			bObj.dY += dmg * 0.6 * Math.sin(objAngle);
		} else {
			// If the rocket does not have a blast range, it can only damage one rock
			break;
		}
	}
};