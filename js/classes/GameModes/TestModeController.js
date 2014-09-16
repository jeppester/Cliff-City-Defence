TestModeController = function () {
	this.levels = [{'name': 'Level test', 'rocks': editor.rocks, theme: engine.theme}];

	setTimeout(function () {
		stageController.controller.onReady();
	}, 1);
};

TestModeController.prototype.onReady = function () {
	stageController.startLevel(0);
};

TestModeController.prototype.onLevelStart = function () {
	var messageColor, textOpt, text, firstDelay;

	// Elevate unlocked upgrades
	player.shieldsAvailable = 4;
	player.weaponsAvailable = 4;
	player.weaponIntelligence = 4;
	player.rocketBlastRangeLevel = 4;
	player.rocketFirePowerLevel = 4;
	player.cannonAutomatic = 0;
	player.rocketBounces = 0;
	player.shieldAutoRepair = 1;
	player.addPoints(10000);

	// Set day -/ night mode
	messageColor = engine.theme === "Night"  ?  "#eeeeee" : "#000000";
	textOpt = {alignment: 'center', font: 'normal 58px Verdana', opacity: 0, offset: new Math.Vector(300, 60), color: messageColor};

	// Show level text
	text = editor.saveTest  ?  "Prepare for\nsave test" : "Prepare for\nlevel test";
	main.depths[8].addChildren(
		new FadeMessage(text, 200, 0, 1500, textOpt)
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

TestModeController.prototype.onLevelEnd = function () {
	// Run callbackfunctions depending on the outcome of the level
	var messageColor = engine.theme === "Night"  ?  "#eeeeee" : "#000000",
		textOpt = {alignment: 'center', font: 'normal 58px Verdana', opacity: 0, offset: new Math.Vector(300, 60), color: messageColor};

	if (editor.saveTest) {
		if (!stageController.checkPlayerAlive()) {
			// Show save test failed text
			main.depths[8].addChildren(
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
				main.btnPause.animate({x: - 30}, {duration: 200});

				// Show "level saved" dialog
				main.showDialog(
					new View.Sprite('Dialog.EditorSaved', 320, 345, 0, {opacity: 0}),
					new Button(320, 421, 0, 'To main menu', function () {
						main.clearDialog();

						// Spawn main menu again
						main.spawnMainMenu();
					})
				);
			});
		}
	}
	else {
		// Show level completed text
		main.depths[8].addChildren(
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
