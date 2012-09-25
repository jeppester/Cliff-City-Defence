jseCreateClass('Game');

Game.prototype.game = function () {
	// Make game properties
	this.dialogObjects = [];

	// Load game data
	data = [];
	jseSyncLoad([
		'js/Data/Upgrades.js',
		'js/Data/Rocks.js',
		'js/Data/Editor.js',
	]);

	// Load game classes
	loader.loadClasses([
		'js/classes/GameModes/StoryModeController.js',
		'js/classes/GameModes/TestModeController.js',
		'js/classes/GameModes/CustomLevelModeController.js',
		'js/classes/Rocket.js',
		'js/classes/Cloud.js',
		'js/classes/Destroyable.js',
		'js/classes/Building.js',
		'js/classes/CannonBuilding.js',
		'js/classes/AiGun.js',
		'js/classes/Shield.js',
		'js/classes/StageController.js',
		'js/classes/ScorePoints.js',
		'js/classes/Player.js',
		'js/classes/Rock.js',

		// Bullets
		'js/classes/Explosion.js',
		'js/classes/GunShot.js',

		// Menus
		'js/classes/Menus/CustomMenu.js',
		'js/classes/Menus/UpgradeMenu.js',
		'js/classes/Menus/UpgradeIcon.js',
		'js/classes/Menus/ShopCircle.js',
		'js/classes/Menus/ShopIcon.js',
		'js/classes/Menus/SpecialUpgrades.js',
		'js/classes/Menus/Button.js',
		'js/classes/SpriteButton.js',
		'js/classes/FadeMessage.js',

		// Editor
		'js/classes/Editor/Editor.js',
		'js/classes/Editor/LevelServer.js'
	]);

	setTimeout(function () {
		loader.hideOverlay(function () {
			game.spawnMainMenu();
		});
		game.onLoaded();
	}, 1);
};

Game.prototype.onLoaded = function () {
	this.pause = 0;
	engine.newLoop('onRunning', 1, function () {
		return ! game.pause;
	});
	engine.newLoop('onPaused', 1, function () {
		return game.pause;
	});
	engine.newLoop('collisionChecking', 2, function () {
		return ! game.pause;
	});

	// engine.newLoop('animations', 2);
	// engine.defaultAnimationLoop = 'animations';

	// Open static objects
	stageController = new StageController();
	levelServer = new LevelServer(location.href.replace(/\/\w*\.*\w*$/, '') + '/levelServer');

	// Set levels completed to default value
	this.store = localStorage;
	this.store.levelsCompleted = game.store.levelsCompleted ? game.store.levelsCompleted: 0;

	// Make pause / menu button
	this.btnPause = new SpriteButton(-30, 723, function () {
		game.spawnInGameMenu();
	}, "Editor.RockButtonBackground", "Editor.Pause");
	this.btnPause.bg.xOff += 5;
	engine.depth[9].addChild(this.btnPause);

	// Create background and dummies
	stageController.prepareBackgrounds();
	stageController.createDummies();
};

Game.prototype.showDialog = function (obj1, obj2, obj3) {
	this.dialogObjects.push.apply(this.dialogObjects, arguments);

	var i,
		obj;
	for (i = 0; i < this.dialogObjects.length; i ++) {
		obj = engine.depth[9].addChild(this.dialogObjects[i]);
		obj.animate({opacity: 1, x: 300}, {dur: 500});
	}
};

Game.prototype.setNightMode = function (enable, time) {
	var themeName,
		fader;

	time = time !== undefined ? time / 2 : 500;
	themeName = enable ? 'Night' : 'Day';
	if (themeName === engine.theme) {
		return;
	}

	fader = new Sprite('Effects.FadeOut', 0, 0, 0, {xOff: 0, yOff: 0, opacity: 0});
	fader.newTheme = themeName;
	fader.time = time;

	engine.depth[8].addChild(fader);

	fader.animate({opacity: 1}, {easing: 'linear', dur: time, callback: function () {
		engine.setTheme(this.newTheme);
		if (this.newTheme === "Night") {
			if (window.cannonBuilding) {
				cannonBuilding.setLight(true);
			}
			if (stageController.running) {
				stageController.nightOverlay.opacity = 1;
			}
			stageController.messageColor = "#CCCCCC";
		}
		else {
			if (window.cannonBuilding) {
				cannonBuilding.setLight(false);
			}
			stageController.nightOverlay.opacity = 0;
			stageController.messageColor = "#000000";
		}

		this.animate({opacity: 0}, {easing: 'linear', dur: this.time, callback: function () {
			this.remove();
		}});
	}});
};

Game.prototype.clearDialog = function () {
	var obj,
		removeAnimCallback = function () {
			this.remove();
		};

	while (this.dialogObjects.length) {
		obj = this.dialogObjects[0];
		if (obj.disable) {
			obj.disable();
		}
		obj.animate({opacity: 0, bmSize: 1.2}, {dur: 200, callback: removeAnimCallback});

		this.dialogObjects.splice(0, 1);
	}
};

Game.prototype.spawnMainMenu = function () {
	this.setNightMode(0);
	stageController.prepareBackgrounds();
	stageController.createDummies();

	game.showDialog(
		new Sprite('Dialog.GameLogoPipes', 320, 340, 0, {opacity: 0}),
		new Sprite('Dialog.GameLogoPipes', 320, 490, 0, {opacity: 0}),
		new Sprite('Dialog.GameLogo', 320, 254, 0, {opacity: 0}),
		new CustomMenu(320, 476, [
			{text: 'STORY MODE', onClick: function () {
				stageController.prepareBackgrounds();
				stageController.prepareGame();
				stageController.removeDummies();

				// Remove main menu
				game.clearDialog();

				// Make dialog
				game.pause = 0;
				player.currentLevel = 0;

				// Fetch levels from database
				stageController.startSession(new StoryModeController());
			}},
			{text: 'PLAYER LEVELS', onClick: function () {
				stageController.prepareBackgrounds();
				stageController.prepareGame();
				stageController.removeDummies();

				// Remove main menu
				game.clearDialog();

				// Make dialog
				game.pause = 0;
				player.currentLevel = 0;

				// Fetch levels from database
				stageController.startSession(new CustomLevelModeController());
			}},
			{text: "CREATE LEVELS", onClick: function () {
				// Remove main menu
				game.clearDialog();

				// The player will have to complete at least three levels in order to open the level editor
				if (game.store.levelsCompleted > 2) {
					editor = new Editor();
				}
				else {
					// Show denial message
					game.showDialog(
						new Sprite('EditorDenial', 320, 345, 0, {opacity: 0}),
						new Button(320, 421, 0, 'Back to menu', function () {
							game.clearDialog();

							// Spawn main menu again
							game.spawnMainMenu();
						}, {opacity: 0})
					);
				}
			}}
		], {opacity: 0})
	);

	this.pause = 0;
};

// For showing in game menu
Game.prototype.spawnInGameMenu = function () {
	this.pause = 1;
	this.btnPause.animate({x: - 30}, {dur: 200});

	this.showDialog(
		new Sprite('Dialog.GameLogoPipes', 320, 430, 0, {opacity: 0}),
		new Sprite('Dialog.GameLogo', 320, 254, 0, {opacity: 0}),
		new CustomMenu(320, 450, [{text: 'CONTINUE', onClick: function () {
				game.clearDialog();
				game.btnPause.animate({x: 25}, {dur: 200});

				setTimeout(function () {
					game.pause = 0;
				}, 500);
			}}, {text: "TO MAIN MENU", onClick: function () {
				game.clearDialog();

				stageController.destroyGame();
				game.spawnMainMenu();
			}}
		], {opacity: 0})
	);
};

Game.prototype.showGameplayInstructions = function () {
	this.pause = 1;

	this.showDialog(
		new Sprite('Dialog.Instructions', 320, 375, 0, {opacity: 0}),
		new Button(320, 412, 0, 'Start playing', function () {
			game.clearDialog();
			game.btnPause.animate({x: 25}, {dur: 200, callback: function () {game.pause = 0; }});
		}, {opacity: 0})
	);
};

Game.prototype.showSpecialUpgradesMenu = function () {
	var currentSpecialUpgradeIndex = Math.floor(player.currentLevel / 6),
		menu = new SpecialUpgrades(data.specialUpgrades[currentSpecialUpgradeIndex], function () {
			game.showUpgradeMenu();
		});

	this.pause = 1;
	this.btnPause.animate({x: - 30}, {dur: 200});

	engine.depth[9].addChild(menu);
};

Game.prototype.showUpgradeMenu = function () {
	this.pause = 1;

	var menu = new UpgradeMenu(function () {
		// If the player has gained access to an upgrade that gives access to a building enhancement, show an instructions window
		if (this.player.shieldsAvailable + this.player.weaponsAvailable === 0 && player.shieldsAvailable + player.weaponsAvailable > 0) {
			game.showDialog(
				new Sprite('Dialog.EnhancementInstructions', 320, 375, 0, {opacity: 0}),
				new Button(320, 466, 0, 'Continue', function () {
					game.clearDialog();
					stageController.startLevel(stageController.controller.getNextLevel());
					game.pause = 0;
				}, {opacity: 0})
			);
		}
		else {
			stageController.startLevel(stageController.controller.getNextLevel());
			game.pause = 0;
		}

		stageController.running = true;
		game.btnPause.animate({x: 25}, {dur: 200});
	});
	engine.depth[9].addChild(menu);

	this.btnPause.animate({x: - 30}, {dur: 200});

	// Store current upgrades in the upgradeMenu object
	menu.player = {
		shieldsAvailable: player.shieldsAvailable,
		weaponsAvailable: player.weaponsAvailable
	};
};