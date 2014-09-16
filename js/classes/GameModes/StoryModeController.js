StoryModeController = function () {
	levelServer.getLevelCollection(1, function (data) {
		data = JSON.parse(data);
		stageController.controller.levels = data.levels;
		stageController.controller.currentLevel = 0;
		stageController.controller.onReady();
	});
};

StoryModeController.prototype.onReady = function () {
	stageController.startLevel(0);
	main.showGameplayInstructions();
	main.pause = 1;
};

StoryModeController.prototype.getNextLevel = function () {
	return this.currentLevel + 1;
};

StoryModeController.prototype.onLevelStart = function () {
	var dayNight = this.currentLevel % 2  ?  'Night' : 'Day',
		messageColor = this.currentLevel % 2  ?  "#eeeeee" : "#000000",
		dayNumber = 1 + Math.floor(this.currentLevel / 2),
		levelTextBlock = "Prepare for\n" + (dayNight) + ' ' + (dayNumber) + " / " + (this.levels.length / 2),
		textOpt = {alignment: 'center', font: 'normal 58px Verdana', opacity: 0, offset: new Math.Vector(300, 60), color: messageColor},
		firstDelay;

	main.depths[8].addChildren(
		new FadeMessage(levelTextBlock, 200, 0, 1500, textOpt)
	);

	// Make countdowntimer for incoming rocks
	firstDelay = stageController.level.rocks[0].spawnDelay;

	main.depths[8].addChildren(
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
		levelTextBlock = (dayNight) + ' ' + (dayNumber) + "\nCompleted ! ",
		textOpt = {alignment: 'center', font: 'normal 58px Verdana', opacity: 0, offset: new Math.Vector(300, 60), color: messageColor},

		// For building data collection loop
		i,
		b,
		bStart;

	// Show level completed text
	main.depths[8].addChildren(
		new FadeMessage(levelTextBlock, 200, 0, 1500, textOpt)
	);

	// Update number of completed levels
	main.store.levelsCompleted ++;

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
			main.pause = 1;

			// Make dialog objects and buttons
			main.showDialog(
				new View.Sprite('Dialog.GameLogoPipes', 320, 360, 0, {opacity: 0}),
				new View.Sprite('Dialog.GameLogoPipes', 320, 550, 0, {opacity: 0}),
				new View.Sprite('Dialog.GameLogo', 320, 180, 0, {opacity: 0}),
				new View.Sprite('Dialog.GameComplete', 320, 429, 0, {opacity: 0}),
				new View.TextBlock(player.pointsTotal.toString(), 320, 462, 90, {alignment: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new View.TextBlock(player.rocksDestroyed.toString(), 320, 477, 90, {alignment: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new View.TextBlock(player.buildingsLost.toString(), 320, 492, 90, {alignment: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new View.TextBlock(player.buildingsDamaged.toString(), 320, 507, 90, {alignment: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new View.TextBlock(player.weaponsBought.toString(), 320, 522, 90, {alignment: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new View.TextBlock(player.shieldsBought.toString(), 320, 537, 90, {alignment: 'right', font: 'normal 12px Verdana', opacity: 0}),
				new Button(320, 598, 0, 'TO MAIN MENU', function () {
					// Hide all dialog objects
					main.clearDialog();

					// Remove all traces of gameplay
					stageController.destroyGame();
					stageController.destroyBackgrounds();

					// Show main menu
					main.spawnMainMenu();
				}, {opacity: 0})
			);

			// Hide pause button
			main.btnPause.animate({x: - 30}, {duration: 200});
		}
		else {
			// Enable / disable night mode
			main.setNightMode((stageController.controller.currentLevel + 1) % 2);

			// show upgrade menu every second level, and special upgrade menu every 6th level
			if ((stageController.controller.currentLevel + 1) % 6 === 0) {
				main.showSpecialUpgradesMenu();
			}
			else if ((stageController.controller.currentLevel + 1) % 2 === 0) {
				main.showUpgradeMenu();
			}
			else {
				stageController.startLevel(stageController.controller.getNextLevel());
				main.pause = 0;
			}
		}
	}, 2100, 'onRunning', 'levelSucceed');
};

StoryModeController.prototype.onLevelFail = function () {
	var messageColor = this.currentLevel % 2  ?  "#eeeeee" : "#000000",
		textOpt = {alignment: 'center', font: 'normal 58px Verdana', offset: new Math.Vector(300, 60), color: messageColor};

	// Show level fail message
	main.depths[8].addChildren(
		new FadeMessage("Cliff City\ndemolished ! ", 200, 0, 1500, textOpt)
	);

	// Wait untill the message has faded out, then show level fail dialog
	stageController.scheduleTask(function () {
		main.btnPause.animate({x: - 30}, {duration: 200});
		main.pause = 1;

		main.showDialog(
			new View.Sprite('Dialog.GameLogoPipes', 320, 430, 0, {opacity: 0}),
			new View.Sprite('Dialog.GameLogo', 320, 254, 0, {opacity: 0}),
			new CustomMenu(320, 450, [
				{
					text: 'Retry level',
					onClick: function () {
						main.clearDialog();
						stageController.restartLevel();
						main.btnPause.animate({x: 25}, {duration: 200});
						main.pause = 0;
					}
				},
				{
					text: 'Go to main menu',
					onClick: function () {
						main.clearDialog();
						stageController.destroyGame();
						stageController.destroyBackgrounds();
						main.spawnMainMenu();
					}
				}
			], {opacity: 0})
		);
	}, 2100, 'onRunning', 'levelFail');
};

StoryModeController.prototype.getLevels = function () {
	return this.levels;
};
