jseCreateClass('StoryModeController');

StoryModeController.prototype.storyModeController = function () {
	levelServer.getLevelCollection(1, function (data) {
		data = JSON.parse(data);
		stageController.controller.levels = data.levels;
		stageController.controller.currentLevel = 0;
		stageController.controller.onReady();
	});
};

StoryModeController.prototype.onReady = function () {
	stageController.startLevel(0);
	game.showGameplayInstructions();
	game.pause = 1;
};

StoryModeController.prototype.getNextLevel = function () {
	return this.currentLevel + 1;
};

StoryModeController.prototype.onLevelStart = function () {
	var dayNight = this.currentLevel % 2  ?  'Night' : 'Day',
		messageColor = this.currentLevel % 2  ?  "#eeeeee" : "#000000",
		dayNumber = 1 + Math.floor(this.currentLevel / 2),
		levelText = "Prepare for\n" + (dayNight) + ' ' + (dayNumber) + " / " + (this.levels.length / 2),
		textOpt = {align: 'center', font: 'normal 58px Verdana', bmSize: 3, opacity: 0, xOff: 300, yOff: 60, fillStyle: messageColor},
		firstDelay;

	engine.depth[8].addChild(
		new FadeMessage(levelText, 200, 0, 1500, textOpt)
	);

	// Make countdowntimer for incoming rocks
	firstDelay = stageController.level.rocks[0].spawnDelay;

	engine.depth[8].addChildren(
		new FadeMessage('5', 260, 3000 + firstDelay, 1000, textOpt),
		new FadeMessage('4', 260, 4000 + firstDelay, 1000, textOpt),
		new FadeMessage('3', 260, 5000 + firstDelay, 1000, textOpt),
		new FadeMessage('2', 260, 6000 + firstDelay, 1000, textOpt),
		new FadeMessage('1', 260, 7000 + firstDelay, 1000, textOpt)
	);

	stageController.shakeCliff();
};

StoryModeController.prototype.onLevelEnd = function () {
	// Save level stats
	levelServer.saveStats(stageController.level.lid, stageController.calculateLevelStats());

	// Run callbackfunctions depending on the outcome of the level
	if (!stageController.checkPlayerAlive()) {
		this.onLevelFail();
	} else {
		this.onLevelSucceed();
	}
};

StoryModeController.prototype.onLevelSucceed = function () {
	var dayNight = this.currentLevel % 2  ?  'Night' : 'Day',
		messageColor = this.currentLevel % 2  ?  "#eeeeee" : "#000000",
		dayNumber = 1 + Math.floor(this.currentLevel / 2),
		levelText = (dayNight) + ' ' + (dayNumber) + "\nCompleted ! ",
		textOpt = {align: 'center', font: 'normal 58px Verdana', bmSize: 3, opacity: 0, xOff: 300, yOff: 60, fillStyle: messageColor},

		// For building data collection loop
		i,
		b,
		bStart;

	// Show level completed text
	engine.depth[8].addChild(
		new FadeMessage(levelText, 200, 0, 1500, textOpt)
	);

	// Update number of completed levels
	game.store.levelsCompleted ++;

	// Store number of damaged - and lost buildings for statistical use
	i = stageController.buildings.length;
	while (i --) {
		b = stageController.buildings[i];
		bStart = stageController.levelStartPlayerState.buildings[i];

		if (b.life === 1 && bStart.life === 2) {
			player.buildingsDamaged ++;
		}

		if (b.life === 0) {
			if (bStart.life === 2) {
				player.buildingsDamaged ++;
				player.buildingsLost ++;
			} else if (bStart.life === 1) {
				player.buildingsLost ++;
			}
		}
	}

	// Wait for the text to fade out, then show upgrade menu (if needed)
	stageController.scheduleTask(function () {
		// If last level, show game statistics
		if (stageController.controller.currentLevel === stageController.controller.levels.length - 1) {
			game.pause = 1;

			// Make dialog objects and buttons
			game.showDialog(
				new Sprite('Dialog.GameLogoPipes', 320, 360, 0, {opacity: 0}),
				new Sprite('Dialog.GameLogoPipes', 320, 550, 0, {opacity: 0}),
				new Sprite('Dialog.GameLogo', 320, 180, 0, {opacity: 0}),
				new Sprite('Dialog.GameComplete', 320, 429, 0, {opacity: 0}),
				new TextBlock(player.pointsTotal.toString(), 320, 462, 90, {align: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new TextBlock(player.rocksDestroyed.toString(), 320, 477, 90, {align: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new TextBlock(player.buildingsLost.toString(), 320, 492, 90, {align: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new TextBlock(player.buildingsDamaged.toString(), 320, 507, 90, {align: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new TextBlock(player.weaponsBought.toString(), 320, 522, 90, {align: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new TextBlock(player.shieldsBought.toString(), 320, 537, 90, {align: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new Button(320, 598, 0, 'TO MAIN MENU', function () {
					// Hide all dialog objects
					game.clearDialog();

					// Remove all traces of gameplay
					stageController.destroyGame();
					stageController.destroyBackgrounds();

					// Show main menu
					game.spawnMainMenu();
				}, {opacity: 0})
			);

			// Hide pause button
			game.btnPause.animate({x: - 30}, {dur: 200});
		}
		else {
			// Enable / disable night mode
			game.setNightMode((stageController.controller.currentLevel + 1) % 2);

			// show upgrade menu every second level, and special upgrade menu every 6th level
			if ((stageController.controller.currentLevel + 1) % 6 === 0) {
				game.showSpecialUpgradesMenu();
			}
			else if ((stageController.controller.currentLevel + 1) % 2 === 0) {
				game.showUpgradeMenu();
			}
			else {
				stageController.startLevel(stageController.controller.getNextLevel());
				game.pause = 0;
			}
		}
	}, 2100, 'onRunning', 'levelSucceed');
};

StoryModeController.prototype.onLevelFail = function () {
	var messageColor = this.currentLevel % 2  ?  "#eeeeee" : "#000000",
		textOpt = {align: 'center', font: 'normal 58px Verdana', bmSize: 3, xOff: 300, yOff: 60, fillStyle: messageColor};

	// Show level fail message
	engine.depth[8].addChild(
		new FadeMessage("Cliff City\ndemolished ! ", 200, 0, 1500, textOpt)
	);

	// Wait untill the message has faded out, then show level fail dialog
	stageController.scheduleTask(function () {
		game.btnPause.animate({x: - 30}, {dur: 200});
		game.pause = 1;

		game.showDialog(
			new Sprite('Dialog.GameLogoPipes', 320, 430, 0, {opacity: 0}),
			new Sprite('Dialog.GameLogo', 320, 254, 0, {opacity: 0}),
			new CustomMenu(320, 450, [
				{
					text: 'Retry level',
					onClick: function () {
						game.clearDialog();
						stageController.restartLevel();
						game.btnPause.animate({x: 25}, {dur: 200});
						game.pause = 0;
					}
				},
				{
					text: 'Go to main menu',
					onClick: function () {
						game.clearDialog();
						stageController.destroyGame();
						stageController.destroyBackgrounds();
						game.spawnMainMenu();
					}
				}
			], {opacity: 0})
		);
	}, 2100, 'onRunning', 'levelFail');
};

StoryModeController.prototype.getLevels = function () {
	return this.levels;
};