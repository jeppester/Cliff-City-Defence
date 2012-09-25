jseCreateClass('TestModeController');

TestModeController.prototype.testModeController = function () {
	this.levels = [{'name': 'Level test', 'rocks': editor.rocks, theme: engine.theme}];

	setTimeout(function () {
		stageController.controller.onReady();
	}, 1);
};

TestModeController.prototype.onReady = function () {
	stageController.startLevel(0);
};

TestModeController.prototype.onLevelStart = function () {
	// Elevate unlocked upgrades
	player.shieldsAvailable = 4;
	player.weaponsAvailable = 4;
	player.weaponIntelligence = 4;
	player.rocketBlastRangeLevel = 4;
	player.rocketFirePowerLevel = 4;
	player.cannonAutomatic = 0;
	player.rocketBounces = 0;
	player.addPoints(10000);

	// Set day -/ night mode
	var messageColor = engine.theme === "Night"  ?  "#eeeeee" : "#000000",
		textOpt = {align: 'center', font: 'normal 58px Verdana', bmSize: 3, opacity: 0, xOff: 300, yOff: 60, fillStyle: messageColor},

		text,
		firstDelay;


	// Show level text
	text = editor.saveTest  ?  "Prepare for\nsave test" : "Prepare for\nlevel test";
	engine.depth[8].addChild(
		new FadeMessage(text, 200, 0, 1500, textOpt)
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

TestModeController.prototype.onLevelEnd = function () {
	// Run callbackfunctions depending on the outcome of the level
	var messageColor = engine.theme === "Night"  ?  "#eeeeee" : "#000000",
		textOpt = {align: 'center', font: 'normal 58px Verdana', bmSize: 3, opacity: 0, xOff: 300, yOff: 60, fillStyle: messageColor};

	if (editor.saveTest) {
		if (!stageController.checkPlayerAlive()) {
			// Show save test failed text
			engine.depth[8].addChild(
				new FadeMessage("Save test\nfailed", 200, 0, 1500, textOpt)
			);

			// Wait for the text to fade out, then go back to the editor
			stageController.scheduleTask(function () {
				editor.endTestMode();
			}, 2100, 'onRunning', 'levelSucceed');
		} else {
			// If save test was successful, save the level
			levelServer.saveLevel(this.levels[0], function (data) {
				// Save level stats to database
				levelServer.saveStats(data, stageController.calculateLevelStats());

				stageController.destroyGame();
				editor.remove();
				stageController.createDummies();
				stageController.prepareBackgrounds();

				// Hide pause button
				game.btnPause.animate({x: - 30}, {dur: 200});

				// Show "level saved" dialog
				game.showDialog(
					new Sprite('Dialog.EditorSaved', 320, 345, 0, {opacity: 0}),
					new Button(320, 421, 0, 'To main menu', function () {
						game.clearDialog();

						// Spawn main menu again
						game.spawnMainMenu();
					})
				);
			});
		}
	}
	else {
		// Show level completed text
		engine.depth[8].addChild(
			new FadeMessage("Level test\nfinished", 200, 0, 1500, textOpt)
		);

		// Wait for the text to fade out, then go back to the editor
		stageController.scheduleTask(function () {
			editor.endTestMode();
		}, 2100, 'onRunning', 'levelSucceed');
	}
};

TestModeController.prototype.getLevels = function () {
	return this.levels;
};