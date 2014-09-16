CannonBuilding = function () {
	// Extend view
	View.Container.call(this);

	// Make cannon
	this.cannon = new View.Sprite('Buildings.Cannon', 300, 628, - Math.PI / 2, {offset: new Math.Vector(0, 10)});
	this.cannon.alive = true;

	// Create building sprite
	this.building = new View.Sprite('Buildings.RocketBuilding', 315, 660);

	// Add object in update array
	engine.currentRoom.loops.onRunning.attachFunction(this, this.update);
	engine.currentRoom.loops.collisionChecking.attachFunction(this, this.cols);

	// Prepare night mode
	this.nightLight = new View.Sprite('Effects.NightLight', 300, 628, 0, {composite: 'destination-out', opacity: 0, offset: new Math.Vector('center', 900)});
	main.depths[7].addChildren(this.nightLight);

	this.addChildren(this.cannon, this.building);

	// Enable night light if the night theme is enabled
	if (engine.theme === "Night") {
		this.setLight(true);
	}

	// Set object to alive
	this.alive = true;
	this.loadedAfter = 0;
};

CannonBuilding.prototype = Object.create(View.Container.prototype);

CannonBuilding.prototype.remove = function () {
	this.nightLight.remove();
	this.removeAllChildren();
	engine.purge(this);
};

CannonBuilding.prototype.update = function () {
	var x, y, mDir, shoot, rockets;

	if (this.cannon.alive === false) {return; }

	x = this.cannon.x;
	y = this.cannon.y;
	mDir = Math.atan2(pointer.mouse.y - y, pointer.mouse.x - x);

	if (mDir > -10 / 180 * Math.PI || mDir < -170 / 180 * Math.PI) {
		if (mDir > 90 / 180 * Math.PI || mDir < -170 / 180 * Math.PI) {
			mDir = -170 / 180 * Math.PI;
		} else {
			mDir = -10 / 180 * Math.PI;
		}
	}

	// Update cannon position
	this.cannon.direction = mDir;
	if (this.nightLight) {
		this.nightLight.direction = mDir + Math.PI / 2;
	}

	if (pointer.mouse.y > y) {return; }

	shoot = player.cannonAutomatic  ?  pointer.isDown(MOUSE_TOUCH_ANY) : pointer.isPressed(MOUSE_TOUCH_ANY);
	if (shoot && this.loadedAfter <= engine.currentRoom.loops.onRunning.time) {
		if (player.rocketMultiLoad) {
			rockets = Math.min(5, 1 + Math.floor((engine.currentRoom.loops.onRunning.time - this.loadedAfter) / (player.rocketReloadTime * 2)));

			switch (rockets) {
			case 1:
				main.depths[3].addChildren(new Rocket(this.cannon.direction));
				break;
			case 2:
				main.depths[3].addChildren(new Rocket(this.cannon.direction));
				main.depths[3].addChildren(new Rocket(this.cannon.direction + 5 / 180 * Math.PI));
				break;
			case 3:
				main.depths[3].addChildren(new Rocket(this.cannon.direction));
				main.depths[3].addChildren(new Rocket(this.cannon.direction + 5 / 180 * Math.PI));
				main.depths[3].addChildren(new Rocket(this.cannon.direction - 5 / 180 * Math.PI));
				break;
			case 4:
				main.depths[3].addChildren(new Rocket(this.cannon.direction));
				main.depths[3].addChildren(new Rocket(this.cannon.direction + 5 / 180 * Math.PI));
				main.depths[3].addChildren(new Rocket(this.cannon.direction - 5 / 180 * Math.PI));
				main.depths[3].addChildren(new Rocket(this.cannon.direction + 10 / 180 * Math.PI));
				break;
			case 5:
				main.depths[3].addChildren(new Rocket(this.cannon.direction));
				main.depths[3].addChildren(new Rocket(this.cannon.direction + 5 / 180 * Math.PI));
				main.depths[3].addChildren(new Rocket(this.cannon.direction - 5 / 180 * Math.PI));
				main.depths[3].addChildren(new Rocket(this.cannon.direction + 10 / 180 * Math.PI));
				main.depths[3].addChildren(new Rocket(this.cannon.direction - 10 / 180 * Math.PI));
				break;
			}
		}
		else {
			main.depths[3].addChildren(new Rocket(this.cannon.direction));
		}

		this.loadedAfter = engine.currentRoom.loops.onRunning.time + player.rocketReloadTime;
		this.cannon.offset.x = 5;
		this.cannon.offset.animate({'x': 0}, {'dur': 300});
	}
};

CannonBuilding.prototype.cols = function () {
	var rocks, i, cObj, cDist;

	// Check for collisions
	if (!this.alive) {return; }

	rocks = main.depths[5].getChildren();

	for (i = 0; i < rocks.length; i ++) {
		cObj = rocks[i];
		if (!cObj.alive) {continue; }

		cDist = this.building.bm.width / 2 + cObj.bm.width / 2;
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
	this.building.size = 0;
	this.building.opacity = 1;
	this.cannon.size = 0;
	this.cannon.opacity = 1;
	this.building.animate({"size": 1}, {'dur': 200});
	this.cannon.animate({"size": 1}, {'dur': 200});
	this.nightLight.opacity = 1;
	this.alive = true;
};

CannonBuilding.prototype.die = function () {
	this.building.animate({"size": 1.5, "opacity": 0}, {'dur': 200});
	this.cannon.animate({"size": 1.5, "opacity": 0}, {'dur': 200});
	this.cannon.alive = false;
	this.nightLight.opacity = 0;
	this.alive = false;
};

CannonBuilding.prototype.setCannon = function (alive) {
	var deadDir;

	this.cannon.alive = alive;
	if (this.cannon.alive === false) {
		if (this.cannon.direction > -Math.PI / 2) {
			deadDir = 10 / 180 * Math.PI;
		} else {
			deadDir = -190 / 180 * Math.PI;
		}
		this.cannon.animate({'dir': deadDir}, {'dur': 200, 'easing': 'quadOut'});
		this.cannon.offset.animate({'x': 7}, {'dur': 200, 'easing': 'quadOut'});
	} else {
		this.cannon.offset.animate({'x': 0, size: 1, opacity: 1}, {duration: 200});
	}
};
