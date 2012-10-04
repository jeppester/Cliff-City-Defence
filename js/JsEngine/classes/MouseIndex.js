/*
buttonIndex:
An object containing the current state of all buttons.

Requires:
	arena to be set
*/

jseCreateClass('MouseIndex');

MouseIndex.prototype.mouseIndex = function () {
	if (engine.host.hasTouch) {
		// Add listeners for touch events
		arena.addEventListener('touchstart', function (event) {
			mouse.onTouchStart.call(mouse, event);
		}, false);
		arena.addEventListener('touchend', function (event) {
			mouse.onTouchEnd.call(mouse, event);
		}, false);
		document.addEventListener('touchmove', function (event) {
			mouse.onTouchMove.call(mouse, event);
		}, false);
	}
	else {
		// Add listeners for mouse events
		arena.addEventListener('mousedown', function (event) {
			mouse.onMouseDown.call(mouse, event);
		}, false);
		arena.addEventListener('mouseup', function (event) {
			mouse.onMouseUp.call(mouse, event);
		}, false);
		document.addEventListener('mousemove', function (event) {
			engine.host.hasMouse = true;
			mouse.onMouseMove.call(mouse, event);
		}, false);

		// Set mouse cursor
		if (engine.options.cursor) {
			/* this.cursor = engine.depth[8].addChild(new Sprite(engine.options.cursor, 0, 0, 0, {xOff: 0, yOff: 0}));
			engine.arena.style.cursor = 'none';*/
			engine.arena.style.cursor = "url('" + loader.getImage(engine.options.cursor).src + "') 0 0, auto";
		}
	}

	// Set x and y (the mouse position, relative to the arena)
	this.x = 0;
	this.y = 0;

	// Set x and y (the mouse position, relative to the window)
	this.windowX = 0;
	this.windowY = 0;

	// Create key event array
	this.events = [];
};

MouseIndex.prototype.onMouseDown = function (event) {
	var frame = engine.frames;

	if (engine.updatesPerformed) {
		frame ++;
	}

	this.cleanUp(event.which);
	this.events.push({'button': event.which, 'frame': frame, 'type': 'pressed'});
};

MouseIndex.prototype.onMouseUp = function (event) {
	var frame, evt, i;

	frame = engine.frames;
	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.button === event.which) {
			if (evt.frame >= engine.frames) {
				frame = evt.frame + 1;
			}
		}
	}

	this.cleanUp(event.which);
	this.events.push({'button': event.which, 'frame': frame, 'type': 'released'});
};

MouseIndex.prototype.onMouseMove = function (event) {
	this.windowX = event.pageX;
	this.windowY = event.pageY;

	this.x = this.windowX - arena.offsetLeft + document.body.scrollLeft;
	this.y = this.windowY - arena.offsetTop + document.body.scrollTop;

	this.x = this.x / arena.offsetWidth * engine.canvasResX;
	this.y = this.y / arena.offsetHeight * engine.canvasResY;

	if (this.cursor) {
		this.cursor.x = this.x;
		this.cursor.y = this.y;
	}
};

MouseIndex.prototype.onTouchStart = function (event) {
	var frame = engine.frames;

	if (engine.updatesPerformed) {
		frame ++;
	}

	// Update "mouse" position
	this.onTouchMove(event);

	this.cleanUp(1);
	this.events.push({'button': 1, 'frame': frame, 'type': 'pressed'});
};

MouseIndex.prototype.onTouchEnd = function (event) {
	var frame, evt, i;

	frame = engine.frames;
	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.button === 1) {
			if (evt.frame >= engine.frames) {
				frame = evt.frame + 1;
			}
		}
	}

	// Update "mouse" position
	this.onTouchMove(event);

	this.cleanUp(1);
	this.events.push({'button': 1, 'frame': frame, 'type': 'released'});
};

MouseIndex.prototype.onTouchMove = function (event) {
	this.windowX = event.targetTouches[0].pageX;
	this.windowY = event.targetTouches[0].pageY;

	this.x = this.windowX - arena.offsetLeft + document.body.scrollLeft;
	this.y = this.windowY - arena.offsetTop + document.body.scrollTop;

	this.x = this.x / arena.offsetWidth * engine.canvasResX;
	this.y = this.y / arena.offsetHeight * engine.canvasResY;
};

MouseIndex.prototype.cleanUp = function (button) {
	var clean, evt, i;

	clean = false;
	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.button === button) {
			if (clean) {
				this.events.splice(i, 1);
			}

			if (evt.frame <= engine.frames) {
				clean = true;
			}
		}
	}
};

MouseIndex.prototype.isDown = function (button) {
	var evt, i;

	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.button === button && evt.frame <= engine.frames) {
			return (evt.type === 'pressed');
		}
	}
	return false;
};

MouseIndex.prototype.isPressed = function (button) {
	var evt, i;

	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.button === button) {
			if (evt.frame === engine.frames && evt.type === 'pressed') {
				return evt;
			}
		}
	}
	return false;
};

MouseIndex.prototype.squareIsPressed = function (x, y, w, h) {
	var btn = false, i;
	for (i = 1; i < 4; i ++) {
		if (this.isPressed(i)) {
			btn = i;
			break;
		}
	}
	if (btn && this.x > x && this.x < x + w && this.y > y && this.y < y + h) {
		return btn;
	}
};

MouseIndex.prototype.squareOutsideIsPressed = function (x, y, w, h) {
	return this.isPressed(1) && (this.x < x || this.x > x + w || this.y < y || this.y > y + h);
};

MouseIndex.prototype.circleIsPressed = function (x, y, r) {
	var dX = this.x - x,
		dY = this.y - y;
	return this.isPressed(1) && r > Math.sqrt(dX * dX + dY * dY);
};

MouseIndex.prototype.unPress = function (button) {
	var evt, i;

	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.button === button) {
			if (evt.frame === engine.frames && evt.type === 'pressed') {
				evt.frame --;
				return true;
			}
		}
	}
	return false;
};

MouseIndex.prototype.outside = function () {
	return this.x < 0 || this.x > arena.offsetWidth || this.y < 0 || this.y > arena.offsetHeight;
};