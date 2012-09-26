/*
Editor:
The game's level editor.

Requires:
	Sprite
	TextBlock
	MouseIndex
	StageController
 */

jseCreateClass('Editor');

Editor.prototype.editor = function () {
	// Make cliff
	stageController.prepareBackgrounds();

	this.newSpawnArrow();
	this.rockType = "Orange";
	this.rockLevel = 1;
	this.rocks = [];
	this.testModeStarted = false;
	this.placeMode = 0;
	this.saveTest = false;
	this.id = "Editor";

	// Create rock type buttons
	this.rockButtons = [];
	var count = 0,
		i,
		ii,
		btn,
		onRockButtonClick;

	onRockButtonClick = function () {
		editor.rockType = this.rockType;
		editor.rockLevel = this.rockLevel;
		editor.selector.animate({y: this.y}, {dur: 400});
	};

	for (i in data.rocks) {
		if (data.rocks.hasOwnProperty(i) && data.rocks[i].prefix) {
			for (ii = 0; ii < data.rocks[i].levels.length; ii ++) {
				btn = new SpriteButton(25, 27 + count * 55, onRockButtonClick, "Editor.RockButtonBackground", "Rocks." + data.rocks[i].prefix + (ii + 1));
				btn.rockType = data.rocks[i].prefix;

				// If the rocks bmSize to fit the button
				switch (ii) {
				case 1:
					btn.fg.bmSize = 0.85;
					break;
				case 2:
					btn.fg.bmSize = 0.7;
					break;
				}

				btn.rockLevel = ii + 1;
				btn.bg.xOff += 5;
				count ++;
				this.rockButtons.push(btn);
				engine.depth[8].addChild(btn);
			}
		}
	}

	// Create selectorbox
	this.selector = new Sprite("Editor.RockSelectorBox", -10, 27, 0, {xOff: 0});

	// Theme change button
	this.btnChangeTheme = new SpriteButton(25, 558, function () {
		game.setNightMode(engine.theme !== 'Night');
	}, "Editor.RockButtonBackground", "Editor.NightDay");
	this.btnChangeTheme.bg.xOff += 5;

	// Save button
	this.btnSave = new SpriteButton(25, 613, function () {
		editor.testBeforeSave();
	}, "Editor.RockButtonBackground", "Editor.Floppy");
	this.btnSave.bg.xOff += 5;

	// Test level button
	this.btnTestMode = new SpriteButton(25, 668, function () {
		if (editor.testModeStarted) {
			editor.endTestMode();
		} else {
			editor.startTestMode();
		}
	}, "Editor.RockButtonBackground", "Editor.Play");
	this.btnTestMode.bg.xOff += 5;

	// Back to menu button
	this.btnMainMenu = new SpriteButton(25, 723, function () {
		editor.remove();
		game.spawnMainMenu();
	}, "Editor.RockButtonBackground", "Editor.Quit");
	this.btnMainMenu.bg.xOff += 5;

	// Add all buttons to depth[10]
	engine.depth[8].addChildren(this.selector, this.btnChangeTheme, this.btnSave, this.btnTestMode, this.btnMainMenu);

	// Add to update array
	engine.addActivityToLoop(this, this.update, 'onRunning');

	stageController.createDummies();

	// Always show tool tips on startup
	this.showTooltips();
};

Editor.prototype.remove = function () {
	this.btnTestMode.remove();
	this.btnSave.remove();
	this.btnMainMenu.remove();
	this.selector.remove();
	this.spawnArrow.remove();
	this.btnChangeTheme.remove();
	stageController.removeDummies();

	var i, markers, ii, markerRemoveAnimCallback;

	for (i = 0; i < this.rockButtons.length; i ++) {
		this.rockButtons[i].remove();
	}

	markerRemoveAnimCallback = function () {
		jsePurge(this);
	};

	for (i = 0; i < this.rocks.length; i ++) {
		markers = this.rocks[i].markers;
		for (ii = 0; ii < markers.length; ii ++) {
			markers[ii].animate({opacity: 0}, {dur: 200, callback: markerRemoveAnimCallback});
		}
	}
	delete this.rocks;

	stageController.destroyBackgrounds();

	jsePurge(this);
};

Editor.prototype.newSpawnArrow = function () {
	this.spawnArrow = new Sprite("Editor.SpawnArrow", - 50, - 25, Math.PI / 2, {xOff: - 50, opacity: 0});
	this.spawnArrow.x = Math.max(100, Math.min(500, Math.round(mouse.x / data.editor.spawnPositionStepSize) * 50));
	engine.depth[8].addChild(this.spawnArrow);
};

Editor.prototype.startTestMode = function () {
	// If the level does not contain any rocks, do nothing
	if (this.rocks.length === 0) {
		return;
	}

	this.saveTest = false;

	// Hide menu
	this.testModeStarted = true;
	this.btnTestMode.fg.setSource('Editor.Stop');
	this.selector.animate({x: - 65}, {dur: 200});
	this.btnSave.animate({x: - 30}, {dur: 200});
	this.btnMainMenu.animate({x: - 30}, {dur: 200});
	this.btnChangeTheme.animate({x: - 30}, {dur: 200});

	var i, rock, ii;
	for (i = 0; i < this.rocks.length; i ++) {
		rock = this.rocks[i];

		for (ii = 0; ii < rock.markers.length; ii ++) {
			rock.markers[ii].animate({opacity: 0}, {dur: 500});
		}
	}
	for (i = 0; i < this.rockButtons.length; i ++) {
		this.rockButtons[i].animate({x: - 30}, {dur: 200});
	}

	// Start running level;
	stageController.removeDummies();
	stageController.prepareGame();

	stageController.startSession(new TestModeController());
};

Editor.prototype.testBeforeSave = function () {
	var i, rock, ii;

	// If the level does not contain enough rocks, do nothing
	if (this.rocks.length < 10) {
		// Disable all buttons
		this.testModeStarted = true;
		this.btnSave.disable();
		this.btnMainMenu.disable();
		this.btnTestMode.disable();
		this.btnChangeTheme.disable();

		for (i = 0; i < this.rocks.length; i ++) {
			rock = this.rocks[i];

			for (ii = 0; ii < rock.markers.length; ii ++) {
				if (!rock.markers[ii].disable) {continue; }
				rock.markers[ii].disable();
			}
		}
		for (i = 0; i < this.rockButtons.length; i ++) {
			this.rockButtons[i].disable();
		}

		game.showDialog(
			new Sprite('Dialog.EditorNotEnoughRocks', 320, 345, 0, {opacity: 0}),
			new Button(320, 421, 0, 'Back to editor', function () {
				var i, rock, ii;

				game.clearDialog();

				// Enable all buttons
				editor.testModeStarted = false;
				editor.btnSave.enable();
				editor.btnMainMenu.enable();
				editor.btnTestMode.enable();
				editor.btnChangeTheme.enable();
				for (i = 0; i < editor.rocks.length; i ++) {
					rock = editor.rocks[i];

					for (ii = 0; ii < rock.markers.length; ii ++) {
						if (!rock.markers[ii].enable) {continue; }
						rock.markers[ii].enable();
					}
				}
				for (i = 0; i < editor.rockButtons.length; i ++) {
					editor.rockButtons[i].enable();
				}
			})
		);
		return;
	}

	this.saveTest = true;

	// Disable save button
	this.btnSave.disable();

	// Hide menu
	this.testModeStarted = true;
	this.btnTestMode.fg.setSource('Editor.Stop');
	this.selector.animate({x: - 65}, {dur: 200});
	this.btnSave.animate({x: - 30}, {dur: 200});
	this.btnMainMenu.animate({x: - 30}, {dur: 200});
	this.btnChangeTheme.animate({x: - 30}, {dur: 200});

	for (i = 0; i < this.rocks.length; i ++) {
		rock = this.rocks[i];

		for (ii = 0; ii < rock.markers.length; ii ++) {
			rock.markers[ii].animate({opacity: 0}, {dur: 500});
		}
	}
	for (i = 0; i < this.rockButtons.length; i ++) {
		this.rockButtons[i].animate({x: - 30}, {dur: 200});
	}

	// Start running level
	stageController.prepareGame();
	stageController.removeDummies();

	stageController.startSession(new TestModeController());
};

Editor.prototype.endTestMode = function () {
	// Show menu
	this.testModeStarted = false;
	this.btnTestMode.fg.setSource('Editor.Play');
	this.selector.animate({x: - 10}, {dur: 200});
	this.btnSave.animate({x: 25}, {dur: 200});
	this.btnMainMenu.animate({x: 25}, {dur: 200});
	this.btnChangeTheme.animate({x: 25}, {dur: 200});
	this.updateRockQueue();

	for (var i = 0; i < this.rockButtons.length; i ++) {
		this.rockButtons[i].animate({x: 25}, {dur: 200});
	}

	// Enable level save button
	this.btnSave.enable();

	// Remove all gameplay traces
	stageController.destroyGame();
	stageController.createDummies();
};

Editor.prototype.update = function () {
	var d, x;

	if (this.testModeStarted) {
		return;
	}

	if (mouse.y < 200 && mouse.x > 52) {
		if (this.spawnArrow.opacity !== 1 && !animator.isAnimated(this.spawnArrow)) {
			this.spawnArrow.animate({opacity: 1}, {dur: 200});
		}

		if (this.placeMode === 0) {
			x = Math.max(100, Math.min(500, Math.round(mouse.x / data.editor.spawnPositionStepSize) * 50));
			this.spawnArrow.x = x;

			if (mouse.isPressed(1)) {
				this.placeX = this.spawnArrow.x;
				this.placeMode = 1;
			}
		}
		else {
			d = Math.atan2(mouse.y - this.spawnArrow.y, mouse.x - this.spawnArrow.x);

			d = Math.max(Math.PI / 6, Math.min(Math.PI / 6 * 5, Math.round(d / (Math.PI / 6)) * Math.PI / 6));
			this.spawnArrow.dir = d;

			if (mouse.isPressed(3)) {
				this.placeMode = 0;
				this.spawnArrow.dir = Math.PI / 2;
				x = Math.max(100, Math.min(500, Math.round(mouse.x / data.editor.spawnPositionStepSize) * 50));
				this.spawnArrow.x = x;
				this.placeX = this.spawnArrow.x;
			}

			if (mouse.isPressed(1)) {
				this.addRock(this.spawnArrow.x, this.spawnArrow.dir, this.rockType, this.rockLevel);
			}
		}
	}
	else {
		if (this.spawnArrow.opacity !== 0 && !animator.isAnimated(this.spawnArrow)) {
			this.spawnArrow.animate({opacity: 0}, {dur: 200});
		}
		this.spawnArrow.dir = Math.PI / 2;
		this.placeMode = 0;
	}
};

Editor.prototype.showTooltips = function () {
	game.pause = 1;

	game.showDialog(
		new Sprite('Dialog.EditorHelp', 320, 375, 0, {opacity: 0}),
		new Button(320, 436, 0, 'Continue', function () {
			game.clearDialog();
			game.pause = 0;
		})
	);
};

Editor.prototype.addRock = function (position, dir, type, level) {
	var rock = new SpriteButton(545, 230, function () {}, 'Rocks.' + type + level),
		up,
		down,
		cross,
		timer,
		line;

	// Scale the rocks bmSize to fit the button
	switch (level) {
	case 2:
		rock.bg.bmSize =  0.85;
		break;
	case 3:
		rock.bg.bmSize =  0.7;
		break;
	}

	up = new SpriteButton(560, 230, function () {
		var rock = editor.rocks[this.position];

		editor.rocks.splice(this.position, 1);
		editor.rocks.splice(this.position + 1, 0, rock);
		editor.updateRockQueue();
	}, 'Editor.Up');

	down = new SpriteButton(575, 230, function () {
		// If the rock is the first rock, do nothing
		if (!this.position) {
			return;
		}

		var rock = editor.rocks[this.position];

		editor.rocks.splice(this.position, 1);
		editor.rocks.splice(this.position - 1, 0, rock);
		editor.updateRockQueue();
	}, 'Editor.Down');

	cross = new SpriteButton(590, 230, function () {
		var markers = editor.rocks[this.position].markers,
			i,
			m,
			removeAnimCallback = function () {
				this.remove();
			};
		for (i = 0; i < markers.length; i ++) {
			m = markers[i];
			if (m.disable) {
				m.disable();
			}

			m.animate({opacity: 0}, {dur: 200, callback: removeAnimCallback});
		}

		editor.rocks.splice(this.position, 1);
		editor.updateRockQueue();
	}, 'Editor.Cross');

	timer = new SpriteButton(571, 230, function (btn) {
		var t = parseFloat(this.text.string),
			tMin = 0;

		if (btn === 1) {
			t +=  0.5;
		} else {
			t -=  0.5;
		}

		if (t >= 10) {
			t = tMin;
		} else if (t < tMin) {
			t = 9.5;
		}
		t = Math.round(t * 10) / 10;

		editor.rocks[this.position].spawnDelay = t * 1000;

		t = t.toString();
		if (t.length === 1) {
			t += ' 0.0';
		}

		this.text.setString(t.toString());
	}, 'Editor.IntervalTimer');

	up.bg.yOff = down.bg.yOff = cross.bg.yOff = 15;
	up.position = down.position = this.rocks.length;
	timer.bg.yOff = 0;

	line = new Sprite('Editor.EditorLine', 300, 230, 0, {'opacity': 0});

	// Set all buttons opacity to 0 (THIS WILL BE DONE WITH ADDOPT ARGUMENT IN THE FUTURE)
	rock.bg.opacity = up.bg.opacity = down.bg.opacity = cross.bg.opacity = timer.bg.opacity = 0;
	rock.opacity = up.opacity = down.opacity = cross.opacity = timer.opacity = 0;

	timer.text = timer.addChild(new TextBlock(editor.rocks.length === 0 ? '0.0': '1.0', 570, 230, 18, {opacity: 0, font: 'normal 9px Verdana', align: 'right', fillStyle: '#fff', yOff: - 1}));

	this.rocks.push({
		'spawnDelay': Math.round(parseFloat(timer.text.string) * 1000),
		'x': position,
		'dir': dir,
		'type': type,
		'level': level,
		'markers': [
			line,
			rock,
			down,
			up,
			cross,
			timer,
			timer.text,
			this.spawnArrow
		]
	});

	this.placeMode = 0;

	this.spawnArrow.animate({xOff: 19}, {dur: 200});

	this.newSpawnArrow();
	this.updateRockQueue(1);

	engine.depth[8].addChildren(line, rock, down, up, cross, timer);
};

Editor.prototype.updateRockQueue = function () {
	var i,
		ii,
		rock,
		marker,
		newY,
		newOpacity,
		props,
		updateAnimCallback = function () {
			if (this.enable) {
				this.enable();
			}
		};

	for (i = 0; i < this.rocks.length; i ++) {
		rock = this.rocks[i];

		for (ii = 0; ii < rock.markers.length; ii ++) {
			marker = rock.markers[ii];
			newY = 230 + (this.rocks.length - 1 - i) * 50;
			newOpacity = Math.max(0, Math.min(1, 1 - (newY - 600) / 150));

			if (marker.disable) {
				marker.disable();
			}

			marker.position = i;

			// Setup animation end properties
			props = {opacity: newOpacity, y: newY};

			if (marker.depth === 11) {
				props.xOff = marker.bmWidth / 2;
			}

			marker.animate(props, {dur: 200, callback: updateAnimCallback});
		}
	}
};