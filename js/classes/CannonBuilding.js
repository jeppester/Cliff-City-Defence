jseCreateClass('CannonBuilding');
jseExtend(CannonBuilding, ObjectContainer);

CannonBuilding.prototype.cannonBuilding = function () {
	// Make cannon
	this.cannon = this.addChild(new Sprite('Buildings.Cannon', 300, 628, - Math.PI / 2, {'xOff': 0, 'yOff': 10}));
	this.cannon.alive = true;

	// Extend Sprite
	this.building = this.addChild(new Sprite('Buildings.RocketBuilding', 315, 660));

	// Add object in update array
	engine.addActivityToLoop(this, this.update, 'onRunning');
	engine.addActivityToLoop(this, this.cols, 'collisionChecking');

	// Prepare night mode
	this.nightLight = engine.depth[7].addChild(new Sprite('Effects.NightLight', 300, 628, 0, {composite: 'destination-out', opacity: 0, yOff: 900}));

	// Enable night light if the night theme is enabled
	if (engine.theme === "Night") {
		this.setLight(true);
	}

	// Set object to alive
	this.alive = true;
	this.loadedAfter = 0;
};

CannonBuilding.prototype.remove = function () {
	this.nightLight.remove();
	this.removeChildren();
	jsePurge(this);
};

CannonBuilding.prototype.update = function () {
	if (this.cannon.alive === false) {return; }

	var x = this.cannon.x,
		y = this.cannon.y,
		mDir = Math.atan2(mouse.y - y, mouse.x - x),

		// For shooting
		shoot,
		rockets;


	if (mDir > -10 / 180 * Math.PI || mDir < -170 / 180 * Math.PI) {
		if (mDir > 90 / 180 * Math.PI || mDir < -170 / 180 * Math.PI) {
			mDir = -170 / 180 * Math.PI;
		} else {
			mDir = -10 / 180 * Math.PI;
		}
	}

	// Update cannon position
	this.cannon.dir = mDir;
	if (this.nightLight) {
		this.nightLight.dir = mDir + Math.PI / 2;
	}

	if (mouse.y > y) {return; }

	shoot = player.cannonAutomatic  ?  mouse.isDown(1) : mouse.isPressed(1);
	if (shoot && this.loadedAfter <= engine.loops.onRunning.time) {
		if (player.rocketMultiLoad) {
			rockets = Math.min(5, 1 + Math.floor((engine.loops.onRunning.time - this.loadedAfter) / (player.rocketReloadTime * 2)));

			switch (rockets) {
			case 1:
				engine.depth[3].addChild(new Rocket(this.cannon.dir));
				break;
			case 2:
				engine.depth[3].addChild(new Rocket(this.cannon.dir));
				engine.depth[3].addChild(new Rocket(this.cannon.dir + 5 / 180 * Math.PI));
				break;
			case 3:
				engine.depth[3].addChild(new Rocket(this.cannon.dir));
				engine.depth[3].addChild(new Rocket(this.cannon.dir + 5 / 180 * Math.PI));
				engine.depth[3].addChild(new Rocket(this.cannon.dir - 5 / 180 * Math.PI));
				break;
			case 4:
				engine.depth[3].addChild(new Rocket(this.cannon.dir));
				engine.depth[3].addChild(new Rocket(this.cannon.dir + 5 / 180 * Math.PI));
				engine.depth[3].addChild(new Rocket(this.cannon.dir - 5 / 180 * Math.PI));
				engine.depth[3].addChild(new Rocket(this.cannon.dir + 10 / 180 * Math.PI));
				break;
			case 5:
				engine.depth[3].addChild(new Rocket(this.cannon.dir));
				engine.depth[3].addChild(new Rocket(this.cannon.dir + 5 / 180 * Math.PI));
				engine.depth[3].addChild(new Rocket(this.cannon.dir - 5 / 180 * Math.PI));
				engine.depth[3].addChild(new Rocket(this.cannon.dir + 10 / 180 * Math.PI));
				engine.depth[3].addChild(new Rocket(this.cannon.dir - 10 / 180 * Math.PI));
				break;
			}
		}
		else {
			engine.depth[3].addChild(new Rocket(this.cannon.dir));
		}

		this.loadedAfter = engine.loops.onRunning.time + player.rocketReloadTime;
		this.cannon.xOff = 5;
		this.cannon.animate({'xOff': 0}, {'dur': 300});
	}
};

CannonBuilding.prototype.cols = function () {
	// Check for collisions
	if (!this.alive) {return; }

	var rocks = engine.depth[5].getChildren(),
		i,
		cObj,
		cDist;

	for (i = 0; i < rocks.length; i ++) {
		cObj = rocks[i];
		if (!cObj.alive) {continue; }

		cDist = this.building.bmWidth / 2 + cObj.bmWidth / 2;
		if (Math.sqrt(Math.pow(cObj.x - this.building.x, 2) + Math.pow(cObj.y - this.building.y, 2)) < cDist) {
			this.die();
			cObj.impacted = true;
			cObj.remove();
		}
	}
};

CannonBuilding.prototype.setLight = function (enable) {
	enable = enable  ?  enable : false;

	if (enable) {
		this.nightLight.opacity = 1;
	}
	else if (this.nightLight) {
		this.nightLight.opacity = 0;
	}
};

CannonBuilding.prototype.revive = function () {
	this.building.bmSize = 0;
	this.building.opacity = 1;
	this.cannon.bmSize = 0;
	this.cannon.opacity = 1;
	this.building.animate({"bmSize": 1}, {'dur': 200});
	this.cannon.animate({"bmSize": 1}, {'dur': 200});
	this.alive = true;
};

CannonBuilding.prototype.die = function () {
	this.building.animate({"bmSize": 1.5, "opacity": 0}, {'dur': 200});
	this.cannon.animate({"bmSize": 1.5, "opacity": 0}, {'dur': 200});
	this.cannon.alive = false;
	this.nightLight.opacity = 0;
	this.alive = false;
};

CannonBuilding.prototype.setCannon = function (alive) {
	this.cannon.alive = alive;

	var deadDir;
	if (this.cannon.alive === false) {
		if (this.cannon.dir > -Math.PI / 2) {
			deadDir = 10 / 180 * Math.PI;
		} else {
			deadDir = -190 / 180 * Math.PI;
		}
		this.cannon.animate({'dir': deadDir, 'xOff': 7}, {'dur': 200, 'easing': 'quadOut'});
	} else {
		this.cannon.animate({'xOff': 0, bmSize: 1, opacity: 1}, {dur: 200});
	}
};