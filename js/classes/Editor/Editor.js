/*
Editor:
The game's level editor.

Requires:
	Sprite
	TextBlock
	Mouse
	StageController
 */

Editor = function () {
	var count, i, ii, btn, onRockButtonClick;

	// Make cliff
	stageController.prepareBackgrounds();

	this.newSpawnArrow();
	this.rockType = "orange";
	this.rockLevel = 1;
	this.rocks = [];
	this.testModeStarted = false;
	this.placeMode = 0;
	this.saveTest = false;
	this.id = "Editor";

	// Create rock type buttons
	this.rockButtons = [];
	count = 0;

	onRockButtonClick = function () {
		editor.rockType = this.rockType;
		editor.rockLevel = this.rockLevel;
		editor.selector.animate({y: this.y}, {duration: 400});
	};

	for (i in data.rocks) {
		if (data.rocks.hasOwnProperty(i)) {
			for (ii = 0; ii < data.rocks[i].levels.length; ii ++) {
				btn = new View.SpriteButton(25, 27 + count * 55, onRockButtonClick, "Editor.RockButtonBackground", data.rocks[i].levels[ii].sprite);
				btn.rockType = i;

				// If the rocks size to fit the button
				switch (ii) {
				case 1:
					btn.fg.size = 0.85;
					break;
				case 2:
					btn.fg.size = 0.7;
					break;
				}

				btn.rockLevel = ii + 1;
				btn.bg.offset.x += 5;
				count ++;
				this.rockButtons.push(btn);
				main.depths[8].addChildren(btn);
			}
		}
	}

	// Create selectorbox
	this.selector = new View.Sprite("Editor.RockSelectorBox", -10, 27, 0, {offset: new Math.Vector(0, 'center')});

	// Theme change button
	this.btnChangeTheme = new View.SpriteButton(25, 558, function () {
		main.setNightMode(engine.defaultTheme !== 'Night');
	}, "Editor.RockButtonBackground", "Editor.NightDay");
	this.btnChangeTheme.bg.offset.x += 5;

	// Save button
	this.btnSave = new View.SpriteButton(25, 613, function () {
		editor.testBeforeSave();
	}, "Editor.RockButtonBackground", "Editor.Floppy");
	this.btnSave.bg.offset.x += 5;

	// Test level button
	this.btnTestMode = new View.SpriteButton(25, 668, function () {
		if (editor.testModeStarted) {
			editor.endTestMode();
		} else {
			editor.startTestMode();
		}
	}, "Editor.RockButtonBackground", "Editor.Play");
	this.btnTestMode.bg.offset.x += 5;

	// Back to menu button
	this.btnMainMenu = new View.SpriteButton(25, 723, function () {
		editor.remove();
		main.spawnMainMenu();
	}, "Editor.RockButtonBackground", "Editor.Quit");
	this.btnMainMenu.bg.offset.x += 5;

	// Add all buttons to depth[10]
	main.depths[8].addChildren(this.selector, this.btnChangeTheme, this.btnSave, this.btnTestMode, this.btnMainMenu);

	// Add to update array
	engine.currentRoom.loops.onRunning.attachFunction(this, this.update);

	stageController.createDummies();

	// Always show tool tips on startup
	this.showTooltips();
};

Editor.prototype.remove = function () {
	var i, markers, ii, markerRemoveAnimCallback;

	this.btnTestMode.remove();
	this.btnSave.remove();
	this.btnMainMenu.remove();
	this.selector.remove();
	this.spawnArrow.remove();
	this.btnChangeTheme.remove();
	stageController.removeDummies();

	for (i = 0; i < this.rockButtons.length; i ++) {
		this.rockButtons[i].remove();
	}

	markerRemoveAnimCallback = function () {
		engine.purge(this);
	};

	for (i = 0; i < this.rocks.length; i ++) {
		markers = this.rocks[i].markers;
		for (ii = 0; ii < markers.length; ii ++) {
			markers[ii].animate({opacity: 0}, {duration: 200, callback: markerRemoveAnimCallback});
		}
	}
	delete this.rocks;

	stageController.destroyBackgrounds();

	engine.purge(this);
};

Editor.prototype.newSpawnArrow = function () {
	this.spawnArrow = new View.Sprite("Editor.SpawnArrow", - 50, - 25, Math.PI / 2, {offset: new Math.Vector(-50, 'center'), opacity: 0});
	this.spawnArrow.x = Math.max(100, Math.min(500, Math.round(pointer.mouse.x / data.editor.spawnPositionStepSize) * 50));
	main.depths[8].addChildren(this.spawnArrow);
};

Editor.prototype.startTestMode = function () {
	var i, rock, ii;

	// If the level does not contain any rocks, do nothing
	if (this.rocks.length === 0) {
		return;
	}

	this.saveTest = false;
	// Hide menu
	this.testModeStarted = true;
	this.btnTestMode.fg.setSource('Editor.Stop');
	this.selector.animate({x: - 65}, {duration: 200});
	this.btnSave.animate({x: - 30}, {duration: 200});
	this.btnMainMenu.animate({x: - 30}, {duration: 200});

	this.btnChangeTheme.animate({x: - 30}, {duration: 200});
	for (i = 0; i < this.rocks.length; i ++) {
		rock = this.rocks[i];

		for (ii = 0; ii < rock.markers.length; ii ++) {
			rock.markers[ii].animate({opacity: 0}, {duration: 500});
		}
	}
	for (i = 0; i < this.rockButtons.length; i ++) {
		this.rockButtons[i].animate({x: - 30}, {duration: 200});
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

		main.showDialog(
			new View.Sprite('Dialog.EditorNotEnoughRocks', 320, 345, 0, {opacity: 0}),
			new Button(320, 421, 0, 'Back to editor', function () {
				var i, rock, ii;

				main.clearDialog();

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
	this.selector.animate({x: - 65}, {duration: 200});
	this.btnSave.animate({x: - 30}, {duration: 200});
	this.btnMainMenu.animate({x: - 30}, {duration: 200});
	this.btnChangeTheme.animate({x: - 30}, {duration: 200});

	for (i = 0; i < this.rocks.length; i ++) {
		rock = this.rocks[i];

		for (ii = 0; ii < rock.markers.length; ii ++) {
			rock.markers[ii].animate({opacity: 0}, {duration: 500});
		}
	}
	for (i = 0; i < this.rockButtons.length; i ++) {
		this.rockButtons[i].animate({x: - 30}, {duration: 200});
	}

	// Start running level
	stageController.prepareGame();
	stageController.removeDummies();

	stageController.startSession(new TestModeController());
};

Editor.prototype.endTestMode = function () {
	var i;

	// Show menu
	this.testModeStarted = false;
	this.btnTestMode.fg.setSource('Editor.Play');
	this.selector.animate({x: - 10}, {duration: 200});
	this.btnSave.animate({x: 25}, {duration: 200});
	this.btnMainMenu.animate({x: 25}, {duration: 200});
	this.btnChangeTheme.animate({x: 25}, {duration: 200});
	this.updateRockQueue();

	for (i = 0; i < this.rockButtons.length; i ++) {
		this.rockButtons[i].animate({x: 25}, {duration: 200});
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

	if (pointer.mouse.y < 200 && pointer.mouse.x > 52) {
		if (this.spawnArrow.opacity !== 1 && !this.spawnArrow.isAnimated()) {
			this.spawnArrow.animate({opacity: 1}, {duration: 200});
		}

		if (this.placeMode === 0) {
			x = Math.max(100, Math.min(500, Math.round(pointer.mouse.x / data.editor.spawnPositionStepSize) * 50));
			this.spawnArrow.x = x;

			if (pointer.isPressed(MOUSE_1)) {
				this.placeX = this.spawnArrow.x;
				this.placeMode = 1;
			}
		}
		else {
			d = Math.atan2(pointer.mouse.y - this.spawnArrow.y, pointer.mouse.x - this.spawnArrow.x);

			d = Math.max(Math.PI / 6, Math.min(Math.PI / 6 * 5, Math.round(d / (Math.PI / 6)) * Math.PI / 6));
			this.spawnArrow.direction = d;

			if (pointer.isPressed(MOUSE_3)) {
				this.placeMode = 0;
				this.spawnArrow.direction = Math.PI / 2;
				x = Math.max(100, Math.min(500, Math.round(pointer.mouse.x / data.editor.spawnPositionStepSize) * 50));
				this.spawnArrow.x = x;
				this.placeX = this.spawnArrow.x;
			}

			if (pointer.isPressed(MOUSE_1)) {
				this.addRock(this.spawnArrow.x, this.spawnArrow.direction, this.rockType, this.rockLevel);
			}
		}
	}
	else {
		if (this.spawnArrow.opacity !== 0 && !this.spawnArrow.isAnimated()) {
			this.spawnArrow.animate({opacity: 0}, {duration: 200});
		}
		this.spawnArrow.direction = Math.PI / 2;
		this.placeMode = 0;
	}
};

Editor.prototype.showTooltips = function () {
	main.pause = 1;

	main.showDialog(
		new View.Sprite('Dialog.EditorHelp', 320, 375, 0, {opacity: 0}),
		new Button(320, 436, 0, 'Continue', function () {
			main.clearDialog();
			main.pause = 0;
		})
	);
};

Editor.prototype.addRock = function (position, dir, type, level) {
	var rock = new View.Sprite(data.rocks[type].levels[level - 1].sprite, 545, 230),
		up,
		down,
		cross,
		timer,
		line;

	// Scale the rock's size to fit the button
	switch (level) {
	case 2:
		rock.size =  0.85;
		break;
	case 3:
		rock.size =  0.7;
		break;
	}

	up = new View.SpriteButton(560, 230, function () {
		var rock = editor.rocks[this.position];

		editor.rocks.splice(this.position, 1);
		editor.rocks.splice(this.position + 1, 0, rock);
		editor.updateRockQueue();
	}, 'Editor.Up');

	down = new View.SpriteButton(575, 230, function () {
		var rock;

		// If the rock is the first rock, do nothing
		if (!this.position) {
			return;
		}

		rock = editor.rocks[this.position];

		editor.rocks.splice(this.position, 1);
		editor.rocks.splice(this.position - 1, 0, rock);
		editor.updateRockQueue();
	}, 'Editor.Down');

	cross = new View.SpriteButton(590, 230, function () {
		var markers = editor.rocks[this.position].markers,
			i,
			m,
			removeAnimCallback = function () {
				engine.purge(this);
			};
		for (i = 0; i < markers.length; i ++) {
			m = markers[i];
			if (m.disable) {
				m.disable();
			}

			m.animate({opacity: 0}, {duration: 200, callback: removeAnimCallback});
		}

		editor.rocks.splice(this.position, 1);
		editor.updateRockQueue();
	}, 'Editor.Cross');

	timer = new View.SpriteButton(571, 230, function (btn) {
		var t = parseFloat(this.text.string),
			tMin = 0;

		if (btn === 1) {
			t +=  0.5;
		} else if (btn === 3) {
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
			t += '.0';
		}

		this.text.string = t.toString();
	}, 'Editor.IntervalTimer');

	up.bg.offset.y = down.bg.offset.y = cross.bg.offset.y = 15;
	up.position = down.position = this.rocks.length;
	timer.bg.offset.y = 0;

	line = new View.Sprite('Editor.EditorLine', 300, 230, 0, {'opacity': 0});

	// Set all buttons opacity to 0 (THIS WILL BE DONE WITH additionalProperties ARGUMENT IN THE FUTURE)
	up.bg.opacity = down.bg.opacity = cross.bg.opacity = timer.bg.opacity = 0;
	rock.opacity = up.opacity = down.opacity = cross.opacity = timer.opacity = 0;

	timer.text = new View.TextBlock(editor.rocks.length === 0 ? '0.0': '1.0', 570, 230, 18, {opacity: 0, font: 'normal 9px Verdana', align: 'right', color: '#fff', offset: new Math.Vector('center', -1)});
	timer.addChildren(timer.text);

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

	this.spawnArrow.offset.animate({x: 19}, {duration: 200});

	this.newSpawnArrow();
	this.updateRockQueue(1);

	main.depths[8].addChildren(line, rock, down, up, cross, timer);
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
				props.offset.x = marker.bm.width / 2;
			}

			marker.animate(props, {duration: 200, callback: updateAnimCallback});
		}
	}
};
