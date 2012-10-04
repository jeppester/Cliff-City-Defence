/*
StageController:
A controller responsible for doing level related things, spawning rocks for instance

Requires:
	Level vars to be set
 */

jseCreateClass('StageController');

StageController.prototype.stageController = function () {
	this.id = 'StageController';
	this.level = 0;
	this.curObj = 0;
	this.running = false;
	this.playerLevelStartState = false;
	this.onLevelSucceed = function () {};
	this.onLevelFail = function () {};
	this.scheduledTasks = [];
	this.messages = {};
	this.stats = {
		rocks: []
	};
	engine.addActivityToLoop(this, this.update, 'onRunning');
};

StageController.prototype.prepareBackgrounds = function () {
	var i;

	// Make cliff
	if (typeof this.ground === "undefined") {
		this.ground = engine.depth[0].addChild(new Sprite('Backgrounds.cliffCityGround', 0, 0, 0, {'xOff': 0, 'yOff': 0}));
		this.road = engine.depth[0].addChild(new Sprite('Backgrounds.cliffCityRoad', 0, 0, 0, {'xOff': 0, 'yOff': 0}));
		this.cliff = engine.depth[6].addChild(new Sprite('Backgrounds.cliffSide', 0, 0, 0, {'xOff': 10, 'yOff': 0}));
		this.nightOverlay = engine.depth[7].addChild(new Sprite('Effects.NightOverlay', 0, 0, 0, {'xOff': 0, 'yOff': 0, opacity: 0}));
		engine.redraw(1);

		// Make some clouds
		for (i = 0;i < 5;i++) {
			engine.depth[1].addChild(new Cloud());
		}
		console.log('Stage background created');
	}
	else {
		console.log('Stage background already created');
	}
};

StageController.prototype.prepareGame = function () {
	var b, d;

	// Make score - object
	player = new Player();

	// Make cannon building
	cannonBuilding = engine.depth[4].addChild(new CannonBuilding());

	// Make buildings and trees (the order is important for depth)
	this.destroyables = [];
	this.buildings = [];

	this.destroyables.push(
		new Destroyable('Trees.Tree', 421, 680),
		new Destroyable('Trees.AppleTree', 520, 673)
	);

	this.buildings.push(
		new Building(1, 91, 665),
		new Building(2, 163, 665)
	);

	this.destroyables.push(
		new Destroyable('Trees.Tree', 200, 690)
	);

	this.buildings.push(
		new Building(3, 232, 680),
		new Building(6, 490, 668),
		new Building(5, 446, 663),
		new Building(4, 392, 687)
	);

	this.destroyables.push(
		new Destroyable('Trees.Tree', 98, 700),
		new Destroyable('Trees.AppleTree', 151, 725),
		new Destroyable('Trees.Tree', 225, 718),
		new Destroyable('Trees.AppleTree', 362, 700),
		new Destroyable('Trees.AppleTree', 436, 718),
		new Destroyable('Trees.Tree', 473, 694)
	);

	d = this.destroyables,
	b = this.buildings;

	engine.depth[4].addChildren(d[0], d[1], b[0], b[1], d[2], b[2], b[3], b[4], b[5], d[3], d[4], d[5], d[6], d[7], d[8]);
};

// For ending all game related activities
StageController.prototype.destroyGame = function () {
	var i;

	this.running = false;

	// Remove buildings
	cannonBuilding.remove();
	i = this.buildings.length;
	while (i--) {
		this.buildings[i].remove();
	}

	// Remove trees
	i = this.destroyables.length;
	while (i--) {
		this.destroyables[i].remove();
		this.destroyables.splice(i, 1);
	}

	// Remove rocks and rockets
	engine.depth[5].removeChildren();
	engine.depth[3].removeChildren();

	// Remove messages, if there are any
	for (i in this.messages) {
		if (this.messages.hasOwnProperty(i)) {
			this.messages[i].remove();
			delete this.messages[i];
		}
	}

	// Stop all scheduled tasks
	this.stopAllTasks();

	// Remove player object
	if (player) {
		jsePurge(player.inGameScore);
		delete player;
	}

	delete this.controller;
};

// For removing game backgrounds
StageController.prototype.destroyBackgrounds = function () {
	if (typeof ground !== "undefined") {
		this.ground.remove();
		this.road.remove();
		this.cliff.remove();

		delete this.ground;
		delete this.road;
		delete this.cliff;

		// Remove clouds
		engine.depth[1].removeChildren();
		console.log('Stage background removed');
		engine.redraw(1);
	}
	else {
		console.log('Stage background not there');
	}
};

// For saving the game before each level, so a level can be played from the start
StageController.prototype.getPlayerState = function () {
	// Return the state of all the buildings
	var states = {},
		len = this.buildings.length,
		b;

	states.buildings = [];
	while (len--) {
		b = this.buildings[len];
		states.buildings[len] = {
			life: b.life,
			gunType: b.gunType,
			shieldType: b.shield.type
		};
	}

	states.cannonBuilding = {cannon: {alive: cannonBuilding.cannon.alive}};

	states.player = {
		points: player.points,
		pointsTotal: player.pointsTotal
	};

	return states;
};

StageController.prototype.loadPlayerState = function (playerState) {
	var len = this.buildings.length,
		bState,
		b;
	while (len--) {
		bState = playerState.buildings[len];

		b = this.buildings[len];
		b.setGun(bState.gunType);
		b.setShield(bState.shieldType);
		b.setLife(bState.life);
	}

	if (!cannonBuilding.alive) {
		cannonBuilding.revive();
	}
	cannonBuilding.setCannon(playerState.cannonBuilding.cannon.alive);

	player.points = playerState.player.points;
	player.pointsTotal = playerState.player.pointsTotal;
	player.inGameScore.setString(player.points.toString() + "$");
};

StageController.prototype.update = function () {
	var i, t, r, l, rock;

	// If paused, return
	if (game.pause) {return; }

	for (i = 0; i < this.scheduledTasks.length; i ++) {
		t = this.scheduledTasks[i];
		if (engine.loops[t.loop].time >= t.fireTime) {
			if (t.caller) {
				t.callback.call(t.caller);
			}
			else {
				t.callback();
			}

			this.scheduledTasks.splice(i, 1);
			i--;
		}
	}

	// If running, spawn rocks
	if (!this.running) {return; }

	this.levelTime += engine.now - engine.last;

	if (engine.frames % 4 === 0) {
		if (this.curObj === this.level.rocks.length && engine.depth[5].children.length === 0) {
			this.endLevel();
		}

		for (i = this.curObj;i < this.level.rocks.length;i ++) {
			r = this.level.rocks[i];
			r.level = r.level ? r.level: 1;
			this.curObj = i;

			if (this.cumulatedTime + r.spawnDelay <= this.levelTime) {
				this.cumulatedTime += r.spawnDelay;

				// If direction and startposition is not set, randomize them
				r.dir = r.dir ? r.dir: Math.random() * Math.PI;
				r.x = r.x ? r.x: 55 + Math.random() * (arena.offsetWidth - 110);

				// Create a rock by putting together the gathered information
				engine.depth[5].addChild(
					rock = new Rock(
						r.x, // Start position
						- 50, // Start direction
						r.type.toLowerCase(), // Type
						r.level - 1,
						r.dir
					)
				);
				this.curObj++;
			}
			else {
				break;
			}
		}
	}
};

StageController.prototype.startSession = function (controller) {
	if (controller === undefined) {throw new Error('Missing argument: controller'); }
	this.controller = controller;
};

StageController.prototype.startLevel = function (levelNumber) {
	if (levelNumber === undefined) {throw new Error('Missing argument: levelNumber'); }

	delete this.stats;
	this.stats = {
		rocks: []
	};
	this.levelStartPlayerState = this.getPlayerState();
	this.curObj = 0;
	this.controller.currentLevel = levelNumber;
	this.level = this.controller.getLevels()[this.controller.currentLevel];
	this.levelTime = -8000;
	this.running = 0;
	this.cumulatedTime = 0;
	this.controller.onLevelStart();

	// If night theme is enabled fade in night overlay
	if (this.level.theme === "Night") {
		this.nightOverlay.animate({opacity: 1}, {dur: 2000});
	}

	this.running = true;
};

StageController.prototype.endLevel = function () {
	var len = this.buildings.length,
		b;
	while (len--) {
		b = this.buildings[len];
		if (b.shop) {
			b.shop.remove();
			b.shop = false;
		}
	}

	// If night theme is enabled fade out night overlay
	if (engine.theme === "Night") {
		this.nightOverlay.animate({opacity: 0}, {dur: 2000});
	}

	this.running = false;

	this.controller.onLevelEnd();

	return true;
};

// Function for calculating level stats
StageController.prototype.calculateLevelStats = function () {
	var totalImpacts, totalFallDistance, stats, i, r;

	totalImpacts = 0,
	totalFallDistance = 0,
	stats = {};
	
	for (i = 0; i < this.stats.rocks.length; i ++) {
		r = this.stats.rocks[i];

		totalImpacts += r.impacted ? 1: 0;
		totalFallDistance += r.fallDistance;
	}

	stats.impactFactor = totalImpacts / this.stats.rocks.length;
	stats.meanFallDistance = totalFallDistance / this.stats.rocks.length;
	return stats;
};

// Function for restarting a level
StageController.prototype.restartLevel = function () {
	if (!this.levelStartPlayerState) {
		return false;
	}
	this.loadPlayerState(this.levelStartPlayerState);
	this.startLevel(this.controller.currentLevel);
};

// Function for checking if the player is "alive"
StageController.prototype.checkPlayerAlive = function () {
	// Count how many buildings that are alive
	var aliveCount = 0,
		len = this.buildings.length;
	while (len --) {
		if (this.buildings[len].life > 0) {
			aliveCount ++;
		}
	}

	// If no buildings are alive, return true
	if (aliveCount === 0) {
		return false;
	}

	// If the cannonbuilding is not alive, return true
	return cannonBuilding.alive;
};

// Function for scheduling tasks within the game (works like setTimeout() but integrates with the game)
StageController.prototype.scheduleTask = function (callback, delayTime, loop, id, caller) {
	var task;

	if (callback === undefined) {
		throw new Error('Missing argument: callback');
	}
	if (delayTime === undefined) {
		throw new Error('Missing argument: delayTime');
	}
	if (loop === undefined) {
		throw new Error('Missing argument: loop');
	}
	id = id === undefined ? false: id;

	task = {
		callback: callback,
		fireTime: engine.loops[loop].time + delayTime,
		loop: loop,
		id: id,
		caller: caller
	};

	this.scheduledTasks.push(task);
};

// Function for stopping a single scheduled task (requires that the task has an id)
// Calling this function with the taskId "false" will stop all tasks which has no id
StageController.prototype.stopTask = function (taskId) {
	var i;

	for (i = 0; i < this.scheduledTasks.length; i ++) {
		if (this.scheduledTasks[i].id === taskId) {
			this.scheduledTasks.splice(i, 1);
			return true;
		}
	}

	return false;
};

// Function for stopping all tasks
StageController.prototype.stopAllTasks = function () {
	this.scheduledTasks = [];
};

StageController.prototype.createDummies = function () {
	if (typeof this.dummies !== "undefined") {console.log('Dummies already created'); return; }

	this.dummies = engine.depth[4].addChildren(
		// Make canon building
		new Sprite('Buildings.RocketBuilding', 315, 660),

		// Make buildings and trees (the order is important for depth)
		new Sprite('Trees.Tree', 421, 680),
		new Sprite('Trees.AppleTree', 520, 673),

		new Sprite('Buildings.Building1', 91, 665),
		new Sprite('Buildings.Building2', 163, 665),

		new Sprite('Trees.Tree', 200, 690),

		new Sprite('Buildings.Building3', 232, 680),
		new Sprite('Buildings.Building4', 392, 687),
		new Sprite('Buildings.Building5', 446, 663),
		new Sprite('Buildings.Building6', 490, 668),

		new Sprite('Trees.Tree', 98, 700),
		new Sprite('Trees.AppleTree', 151, 725),
		new Sprite('Trees.Tree', 225, 718),
		new Sprite('Trees.AppleTree', 362, 700),
		new Sprite('Trees.AppleTree', 436, 718),
		new Sprite('Trees.Tree', 473, 694)
	);
};

StageController.prototype.removeDummies = function () {
	var i;

	if (typeof this.dummies === "undefined") {return; }

	for (i = 0;i < this.dummies.length;i++) {
		jsePurge(this.dummies[i]);
	}
	delete this.dummies;
};

StageController.prototype.shakeCliff = function () {
	var nextX;

	stageController.cliff.shakes = 0;

	stageController.cliff.shake = function () {
		if (this.shakes < 16) {
			this.shakes++;
			nextX = this.shakes % 2 ? this.x + 5 : this.x - 5;
			this.animate({x: nextX}, {dur: 130, callback: this.shake, loop: 'onRunning'});
		}
	};

	stageController.cliff.shake();
};