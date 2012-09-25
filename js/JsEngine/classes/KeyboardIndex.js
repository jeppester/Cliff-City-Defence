/*
KeyboardIndex:
An object containing the current state of all keys.

No requirements
*/

jseCreateClass('KeyboardIndex');

KeyboardIndex.prototype.keyboardIndex = function () {
	document.addEventListener('keydown', function (event) {
		keyboard.onKeyDown.call(keyboard, event);
	}, false);
	document.addEventListener('keyup', function (event) {
		keyboard.onKeyUp.call(keyboard, event);
	}, false);

	// Create key event array
	this.events = [];
};

KeyboardIndex.prototype.onKeyDown = function (event) {
	if (this.isDown(event.keyCode)) {
		return;
	}

	var frame = engine.frames;

	if (engine.updatesPerformed) {
		frame ++;
	}

	this.cleanUp(event.keyCode);

	this.events.push({'key': event.keyCode, 'frame': frame, 'type': 'pressed'});
};

KeyboardIndex.prototype.onKeyUp = function (event) {
	var frame, evt, i;

	frame = engine.frames;
	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.key === event.keyCode) {
			if (evt.frame >= engine.frames) {
				frame = evt.frame + 1;
			}
		}
	}

	this.cleanUp(event.keyCode);

	this.events.push({'key': event.keyCode, 'frame': frame, 'type': 'released'});
};

KeyboardIndex.prototype.cleanUp = function (button) {
	var clean, evt, i;

	clean = false;
	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.key === button) {
			if (clean) {
				this.events.splice(i, 1);
			}

			if (evt.frame <= engine.frames) {
				clean = true;
			}
		}
	}
};

KeyboardIndex.prototype.isDown = function (key) {
	var evt, i;

	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.key === key && evt.frame <= engine.frames) {
			return (evt.type === 'pressed');
		}
	}
	return false;
};

KeyboardIndex.prototype.isPressed = function (key) {
	var evt, i;

	for (i = this.events.length - 1; i >= 0; i --) {
		evt = this.events[i];

		if (evt.key === key) {
			if (evt.frame === engine.frames && evt.type === 'pressed') {
				return true;
			}
		}
	}
	return false;
};