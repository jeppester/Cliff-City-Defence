Main = function () {
	var i;

	// Make game properties
	this.dialogObjects = [];

	// Load game data
	if (typeof data === "undefined")  {
		engine.loadFiles([
			'js/helpers.js',
			'js/Data/Upgrades.js',
			'js/Data/Rocks.js',
			'js/Data/Editor.js',
		]);
	}

	// Load game classes
	loader.loadClasses([
		'js/classes/GameModes/StoryModeController.js',
		'js/classes/GameModes/TestModeController.js',
		'js/classes/GameModes/CustomLevelModeController.js',
		'js/classes/GravityObject.js',
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
		'js/classes/Particle.js',

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

	// Create depths
	this.depths = [];
	for (i = 0; i < 10; i++) {
		this.depths.push(new View.Container());
	}
	engine.currentRoom.addChildren.apply(engine.currentRoom, this.depths);

	setTimeout(function () {
		loader.hideOverlay(function () {
			main.spawnMainMenu();
		});
		main.onLoaded();
	}, 1);
};

Main.prototype.onLoaded = function () {
	this.pause = 0;
	engine.currentRoom.addLoop('onRunning', new Engine.CustomLoop(1, function () {
		return !main.pause;
	}));
	engine.currentRoom.addLoop('onPaused', new Engine.CustomLoop(1, function () {
		return main.pause;
	}));
	engine.currentRoom.addLoop('collisionChecking', new Engine.CustomLoop(2, function () {
		return !main.pause;
	}));

	this.runningLoop = engine.currentRoom.loops.onRunning;
	this.pauseLoop = engine.currentRoom.loops.onPaused;

	// engine.newLoop('animations', 2);
	// engine.defaultAnimationLoop = 'animations';

	// Open static objects
	stageController = new StageController();
	levelServer = new LevelServer(location.href.replace(/\/[^\/]*$/, '') + '/levelServer');

	// Set levels completed to default value
	this.store = localStorage;
	this.store.levelsCompleted = main.store.levelsCompleted ? main.store.levelsCompleted: 0;

	// Make pause / menu button
	this.btnPause = new SpriteButton(-30, 723, function () {
		main.spawnInGameMenu();
	}, "Editor.RockButtonBackground", "Editor.Pause");
	this.btnPause.bg.offset.x += 5;

	this.depths[9].addChildren(this.btnPause);

	// Create background and dummies
	stageController.prepareBackgrounds();
	stageController.createDummies();
};

Main.prototype.showDialog = function (obj1, obj2, obj3) {
	var i, obj;

	this.dialogObjects.push.apply(this.dialogObjects, arguments);
	this.depths[9].addChildren.apply(this.depths[9], this.dialogObjects);

	this.dialogObjects.forEach(function (d) {
		d.animate({opacity: 1, x: 300}, {duration: 500});
	})
};

Main.prototype.setNightMode = function (enable, time) {
	var themeName,
		fader;

	time = time !== undefined ? time / 2 : 500;
	themeName = enable ? 'Night' : 'Day';
	if (themeName === engine.defaultTheme) {
		return;
	}

	fader = new View.Sprite('Effects.FadeOut', 0, 0, 0, {offset: new Math.Vector(0, 0), opacity: 0});
	fader.newTheme = themeName;
	fader.time = time;

	this.depths[8].addChildren(fader);

	fader.animate({opacity: 1}, {easing: 'linear', duration: time, callback: function () {
		engine.setDefaultTheme(this.newTheme);
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

		this.animate({opacity: 0}, {easing: 'linear', duration: this.time, callback: function () {
			engine.purge(this);
		}});
	}});
};

Main.prototype.clearDialog = function () {
	var obj, removeAnimCallback, len;

	removeAnimCallback = function () {
		engine.purge(this);
	};

	len = this.dialogObjects.length;
	while (len --) {
		obj = this.dialogObjects[len];
		if (obj.disable) {
			obj.disable();
		}

		obj.animate({opacity: 0, size: 1.2}, {duration: 200, callback: removeAnimCallback});
	}
	this.dialogObjects = [];
};

Main.prototype.spawnMainMenu = function () {
	var buttons;

	this.setNightMode(0);
	stageController.prepareBackgrounds();
	stageController.createDummies();

	buttons = [
		{text: 'STORY MODE', onClick: function () {
			stageController.prepareBackgrounds();
			stageController.prepareGame();
			stageController.removeDummies();

			// Remove main menu
			main.clearDialog();

			// Make dialog
			main.pause = 0;
			player.currentLevel = 0;

			// Fetch levels from database
			stageController.startSession(new StoryModeController());
		}},
		{text: 'PLAYER LEVELS', onClick: function () {
			stageController.prepareBackgrounds();
			stageController.prepareGame();
			stageController.removeDummies();

			// Remove main menu
			main.clearDialog();

			// Make dialog
			main.pause = 0;
			player.currentLevel = 0;

			// Fetch levels from database
			stageController.startSession(new CustomLevelModeController());
		}},
	];

	// TODO!
	if (1 === 1/*engine.host.hasMouse*/) {
		buttons.push(
			{text: "CREATE LEVELS", onClick: function () {
				// Remove main menu
				main.clearDialog();

				// The player will have to complete at least three levels in order to open the level editor
				if (main.store.levelsCompleted > 2) {
					editor = new Editor();
				}
				else {
					// Show denial message
					main.showDialog(
						new View.Sprite('Dialog.EditorDenial', 320, 345, 0, {opacity: 0}),
						new Button(320, 421, 0, 'Back to menu', function () {
							main.clearDialog();

							// Spawn main menu again
							main.spawnMainMenu();
						}, {opacity: 0})
					);
				}
			}}
		);
	}

	main.showDialog(
		new View.Sprite('Dialog.GameLogoPipes', 320, 340, 0, {opacity: 0}),
		new View.Sprite('Dialog.GameLogoPipes', 320, 490, 0, {opacity: 0}),
		new View.Sprite('Dialog.GameLogo', 320, 254, 0, {opacity: 0}),
		new CustomMenu(320, 476, buttons, {opacity: 0})
	);

	this.pause = 0;
};

// For showing in game menu
Main.prototype.spawnInGameMenu = function () {
	this.pause = 1;
	this.btnPause.animate({x: - 30}, {duration: 200});

	this.showDialog(
		new View.Sprite('Dialog.GameLogoPipes', 320, 430, 0, {opacity: 0}),
		new View.Sprite('Dialog.GameLogo', 320, 254, 0, {opacity: 0}),
		new CustomMenu(320, 450, [{text: 'CONTINUE', onClick: function () {
				main.clearDialog();
				main.btnPause.animate({x: 25}, {duration: 200});

				setTimeout(function () {
					main.pause = 0;
				}, 500);
			}}, {text: "TO MAIN MENU", onClick: function () {
				main.clearDialog();

				stageController.destroyGame();
				main.spawnMainMenu();
			}}
		], {opacity: 0})
	);
};

Main.prototype.showGameplayInstructions = function () {
	this.pause = 1;

	this.showDialog(
		new View.Sprite('Dialog.Instructions', 320, 375, 0, {opacity: 0}),
		new Button(320, 412, 0, 'Start playing', function () {
			main.clearDialog();
			main.btnPause.animate({x: 25}, {duration: 200, callback: function () {main.pause = 0; }});
		}, {opacity: 0})
	);
};

Main.prototype.showSpecialUpgradesMenu = function () {
	var currentSpecialUpgradeIndex, menu;

	currentSpecialUpgradeIndex = Math.floor(player.currentLevel / 6),
	menu = new SpecialUpgrades(data.specialUpgrades[currentSpecialUpgradeIndex], function () {
		main.showUpgradeMenu();
	});

	this.pause = 1;
	this.btnPause.animate({x: - 30}, {duration: 200});

	this.depths[9].addChildren(menu);
};

Main.prototype.showUpgradeMenu = function () {
	var menu;

	this.pause = 1;

	menu = new UpgradeMenu(function () {
		// If the player has gained access to an upgrade that gives access to a building enhancement, show an instructions window
		if (this.player.shieldsAvailable + this.player.weaponsAvailable === 0 && player.shieldsAvailable + player.weaponsAvailable > 0) {
			main.showDialog(
				new View.Sprite('Dialog.EnhancementInstructions', 320, 375, 0, {opacity: 0}),
				new Button(320, 466, 0, 'Continue', function () {
					main.clearDialog();
					stageController.startLevel(stageController.controller.getNextLevel());
					main.pause = 0;
				}, {opacity: 0})
			);
		}
		else {
			stageController.startLevel(stageController.controller.getNextLevel());
			main.pause = 0;
		}

		stageController.running = true;
		main.btnPause.animate({x: 25}, {duration: 200});
	});
	this.depths[9].addChildren(menu);

	this.btnPause.animate({x: - 30}, {duration: 200});

	// Store current upgrades in the upgradeMenu object
	menu.player = {
		shieldsAvailable: player.shieldsAvailable,
		weaponsAvailable: player.weaponsAvailable
	};
};
