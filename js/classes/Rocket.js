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

Rocket = function (_dir) {
	var x = engine.canvasResX / 2,
		y = engine.canvasResY - 120,
		speed = new Math.Vector(player.rocketSpeedFactor * Math.cos(_dir) * 580, player.rocketSpeedFactor * Math.sin(_dir) * 580),
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

	GravityObject.call(this, spr, x, y, _dir, {speed: speed, gravity: 300, loop: main.runningLoop});

	// Make blast range indicator
	this.blastRangeIndicator = new View.Sprite('Projectiles.BlastRangeIndicator' + player.rocketBlastRangeLevel, this.x, this.y, _dir, {offset: new Math.Vector(-10, 'center')});
	engine.currentRoom.loops.onRunning.attachFunction(this, this.updateBlastRangeIndicator);
	this.addChildren(this.blastRangeIndicator);

	// Add object to collision checking loop
	engine.currentRoom.loops.collisionChecking.attachFunction(this, this.cols);

	// Set the number of bounces
	// Indicates how many times the rocket has hit a wall and bounced
	this.bounces = 0;
};

Rocket.prototype.updateBlastRangeIndicator = function () {
	this.blastRangeIndicator.x = this.x;
	this.blastRangeIndicator.y = this.y;
	this.blastRangeIndicator.direction = this.direction;
	this.blastRangeIndicator.size = this.size;
	this.blastRangeIndicator.opacity = this.opacity;
};

Rocket.prototype.doBorders = function () {
	if (!this.alive) {return; }

	if (this.x < 50 || this.x > engine.canvasResX - 50) {
		// Bounce if the rocket has not alreaspeed.y bounced the allowed number of times
		if (this.bounces >= player.rocketBounces) {
			engine.purge(this);
			this.explode();
			return;
		}
		this.bounces ++;

		// Move the rock untill it's outside the wall
		while (this.x < this.size / 2 || this.x > engine.canvasResX - this.size / 2) {
			this.x -= this.speed.x / Math.abs(this.X);
		}

		// Negate the horisontal speed
		this.speed.x = -this.speed.x;
	}

	// If the rocket is too close to the buildings, selfdestroy it
	if (this.speed.y > 0 && this.y > engine.canvasResY - 250) {
		engine.purge(this);
		this.explode();
	}

	// Set the sprites direction to the direction of the rockets vector
	this.direction = Math.atan2(this.speed.y, this.speed.x);
};

Rocket.prototype = Object.create(GravityObject.prototype);

Rocket.prototype.cols = function () {
	var rocks, cObj;

	// Check for collisions with rocks
	if (!this.alive) {return; }

	rocks = main.depths[5].getChildren();

	for (i = 0; i < rocks.length; i ++) {
		cObj = rocks[i];
		if (!cObj.alive) {continue; }

		if (this.collidesWith(cObj)) {
			engine.purge(this);
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
		main.depths[6].insertBelow(new Explosion('Effects.BlastWave', this.x, this.y, 10 + this.blastRange * 2 + this.bm.width, 400), stageController.cliff);
		break;
	case 1:
		main.depths[6].insertBelow(new Explosion('Effects.BlastWave', this.x, this.y, 10 + this.blastRange * 2 + this.bm.width, 400), stageController.cliff);
		stageController.scheduleTask(function () {
			main.depths[6].insertBelow(new Explosion('Effects.RockBlast', this.x, this.y, 10 + this.blastRange * 2 + this.bm.width, 400), stageController.cliff);
		}, 100, 'onRunning', 'rocketBlast', this);
		stageController.scheduleTask(function () {
			main.depths[6].insertBelow(new Explosion('Effects.RockBlast', this.x, this.y, 10 + this.blastRange * 2 + this.bm.width, 400), stageController.cliff);
		}, 200, 'onRunning', 'rocketBlast', this);
		break;
	case 2:
		main.depths[6].insertBelow(new Explosion('Effects.FireExplosion', this.x, this.y, 10 + this.blastRange * 2 + this.bm.width, 600), stageController.cliff);
		stageController.scheduleTask(function () {
			main.depths[6].insertBelow(new Explosion('Effects.FireExplosion', this.x - 10 + Math.random() * 20, this.y - 10 + Math.random() * 20, (10 + this.blastRange * 2 + this.bm.width) *  0.7, 600), stageController.cliff);
		}, 100, 'onRunning', 'rocketBlast', this);
		stageController.scheduleTask(function () {
			main.depths[6].insertBelow(new Explosion('Effects.FireExplosion', this.x - 10 + Math.random() * 20, this.y - 10 + Math.random() * 20, (10 + this.blastRange * 2 + this.bm.width) *  0.5, 600), stageController.cliff);
		}, 200, 'onRunning', 'rocketBlast', this);
		break;
	case 3:
		main.depths[6].insertBelow(new Explosion('Effects.ElectricExplosion', this.x, this.y, 10 + this.blastRange * 2 + this.bm.width, 600), stageController.cliff);
		stageController.scheduleTask(function () {
			main.depths[6].insertBelow(new Explosion('Effects.Lightning', this.x, this.y, 10 + this.blastRange * 2 + this.bm.width, 400), stageController.cliff);
		}, 100, 'onRunning', 'rocketBlast', this);
		stageController.scheduleTask(function () {
			main.depths[6].insertBelow(new Explosion('Effects.Lightning', this.x, this.y, 10 + this.blastRange * 2 + this.bm.width, 400), stageController.cliff);
		}, 200, 'onRunning', 'rocketBlast', this);
		break;
	case 4:
		main.depths[6].insertBelow(new Explosion('Effects.NuclearExplosion', this.x, this.y, 10 + this.blastRange * 2 + this.bm.width, 800), stageController.cliff);
		stageController.scheduleTask(function () {
			main.depths[6].insertBelow(new Explosion('Effects.NuclearBlastRing', this.x, this.y, (10 + this.blastRange * 2 + this.bm.width), 700), stageController.cliff);
		}, 100, 'onRunning', 'rocketBlast', this);
		stageController.scheduleTask(function () {
			main.depths[6].insertBelow(new Explosion('Effects.NuclearBlastRing2', this.x, this.y, (10 + this.blastRange * 2 + this.bm.width) * 2 / 3, 600), stageController.cliff);
		}, 200, 'onRunning', 'rocketBlast', this);
		break;
	}

	// Make light beam on composited night light layer
	if (engine.theme === "Night") {
		beam = new Explosion('Effects.LightBeam', this.x, this.y, 40 + this.blastRange * 4 + this.bm.width, 600);
		beam.composite = 'destination-out';
		main.depths[7].addChildren(beam);
	}

	// Do damage to nearby rocks
	rocks = main.depths[5].getChildren();
	for (i = 0; i < rocks.length; i ++) {
		bObj = rocks[i];
		if (!bObj.alive) {continue; }

		// Calculate the distance between the objects
		objDist = Math.sqrt(Math.pow(bObj.x - this.x, 2) + Math.pow(bObj.y - this.y, 2));
		blastDist = objDist - this.bm.width / 2 - bObj.bm.width / 2;

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
			bObj.speed.x += dmg * 0.6 * Math.cos(objAngle);
			bObj.speed.y += dmg * 0.6 * Math.sin(objAngle);
		} else {
			// If the rocket does not have a blast range, it can only damage one rock
			break;
		}
	}
};
