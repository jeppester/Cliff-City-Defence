/*
JsEngine:
Loads all objects required by the engine, sets core functions, and runs the core loop.

Game specific behavior should not be added in this file, but instead to the Game class.

Requires:
	KeyboardIndex
	MouseIndex
	Loader
	Animator
*/

JsEngine = function (_opt) {
	// Set global engine variable
	engine = this;

	// Load default options
	this.loopSpeed = 30;
	this.loopsPerColCheck = 2;
	this.manualRedrawDepths = [];
	this.canvasResX = 800;
	this.canvasResY = 600;
	this.enginePath = 'JsEngine';
	this.arena = document.getElementById('arena');
	this.compositedDepths = [];

	// Define all used vars
	var copyOpt, i, opt, req, gc;

	// Copy options to engine (except those which are only used for engine initialization)
	this.options = _opt ? _opt: {};
	copyOpt = ['arena', 'loopSpeed', 'loopsPerColCheck', 'manualRedrawDepths', 'compositedDepths', 'canvasResX', 'canvasResY', 'enginePath', 'themesPath'];
	for (i = 0; i < copyOpt.length; i ++) {
		opt = copyOpt[i];
		if (this.options[opt] !== undefined) {
			this[opt] = this.options[opt];
			delete this.options[opt];
		}
	}

	// If jseFunctions is not loaded, load them
	if (typeof jseCreateObject === "undefined") {
		// Load loader class
		req = new XMLHttpRequest();
		req.open('GET', this.enginePath + '/jseFunctions.js', false);
		req.send();
		eval(req.responseText);
	}

	// If the loader class does not exist, load it
	if (typeof Loader === "undefined") {
		jseSyncLoad(this.enginePath + '/classes/Loader.js');
	}

	// Create loader object
	loader = new Loader();

	// Load engine classes
	loader.loadClasses([
		this.enginePath + '/classes/Animation.js',
		this.enginePath + '/classes/Animator.js',
		this.enginePath + '/classes/ObjectContainer.js',
		this.enginePath + '/classes/Director.js',
		this.enginePath + '/classes/Sprite.js',
		this.enginePath + '/classes/TextBlock.js',
		this.enginePath + '/classes/GameObject.js',
		this.enginePath + '/classes/GravityObject.js',
		this.enginePath + '/classes/KeyboardIndex.js',
		this.enginePath + '/classes/MouseIndex.js',
		this.enginePath + '/classes/Particle.js',
	]);

	if (this.options.gameClassPath) {
		gc = this.options.gameClassPath;
		loader.loadClasses([gc]);
		this.gameClassName = gc.match(/(\w*)\.\w+$/)[1];
	}

	// Load themes
	this.theme = this.options.themes[0];
	loader.onthemesloaded = function () {
		engine.initialize();
	};
	loader.loadThemes(this.options.themes);
};

JsEngine.prototype.initialize = function () {
	// Make array for containing references to all game objects
	this.objectIndex = {};

	// Set variables required by the engine
	this.frames = 0;
	this.steps = 0;
	this.last = new Date().getTime();
	this.now = this.last;
	this.gameTime = 0;
	this.updatesPerformed = false;
	this.currentId = 0;

	// Depth - layers for drawing operations
	this.depth = [];

	// Arrays for update - operations, an object can belong to both !
	this.loops = {};
	this.newLoop('eachFrame');
	this.defaultAnimationLoop = 'eachFrame';
	this.defaultActivityLoop = 'eachFrame';

	// Create the depths
	this.depthMap = [];
	var lastIsManualRedrawed = -1,
		lastIsComposited = false,
		i,
		d,
		objectName;

	for (i = 0; i < this.options.depths; i ++) {
		d = new ObjectContainer(i);
		d.manualRedraw = this.manualRedrawDepths.indexOf(i) !== -1;
		d.composited = this.compositedDepths.indexOf(i) !== -1;

		if (lastIsManualRedrawed === d.manualRedraw && d.composited === false && lastIsComposited !== true) {
			d.first = false;
			d.ctx = this.depth[i - 1].ctx;
		}
		else {
			d.first = true;
			d.ctx = this.makeCanvas();
		}

		this.depthMap[i] = d.ctx;
		this.depth.push(d);

		lastIsManualRedrawed = d.manualRedraw;
	}

	// Disable right click inside arena
	this.arena.oncontextmenu = function () {
		return false;
	};

	// Detect host information
	this.host = {
		hasTouch: 'ontouchstart' in document,
		hasMouse: false
	};

	// Create objects required by the engine
	keyboard = new KeyboardIndex();
	mouse = new MouseIndex();
	animator = new Animator();

	// Create game object
	if (typeof eval(this.gameClassName) !== "undefined") {
		objectName = this.gameClassName.substr(0, 1).toLowerCase() + this.gameClassName.substr(1);
		eval(objectName + " = new " + this.gameClassName + '()');
	}
	else {
		loader.hideOverlay();
	}
	engine.startLoop();
};

// Prepare canvas rendering
JsEngine.prototype.makeCanvas = function (position) {
	var c,
		ctx;

	c = document.createElement("canvas");
	c.setAttribute('style', "position: absolute;left: 0px;top: 0px;width: 100%;height: 100%");
	c.width = this.canvasResX;
	c.height = this.canvasResY;

	if (position < this.arena.children.length) {
		this.arena.insertBefore(c, this.arena.children[position]);
	}
	else {
		this.arena.appendChild(c);
	}

	ctx = c.getContext('2d');
	return ctx;
};

// clearStage removes all traces of a game - session
JsEngine.prototype.clearStage = function () {
	// Clear all layers
	var depthId;

	for (depthId = 0; depthId < this.depth.length; depthId ++) {
		this.depth[depthId].remove();
	}
};

JsEngine.prototype.setTheme = function (themeName) {
	var i, applyTheme;

	this.theme = themeName;

	i = this.depth.length,
	applyTheme = function () {
		if (this.refreshSource) {
			this.refreshSource();
		}
	};

	while (i --) {
		this.depth[i].applyToThisAndChildren(applyTheme);
	}

	this.redraw(1);
};

JsEngine.prototype.newLoop = function (name, framesPerLoop, mask) {
	var fpl = framesPerLoop ? framesPerLoop: 1;
	mask = mask  ?  mask : function () {return 1; };

	this.loops[name] = {
		framesPerLoop: fpl,
		mask: mask,
		activitiesQueue: [],
		activities: [],
		animations: [],
		lastFrame: this.frames,
		last: this.now  ?  this.now : new Date().getTime(),
		time: 0,
		execTime: 0
	};
};

JsEngine.prototype.addActivityToLoop = function (object, activity, loop) {
	this.loops[loop].activitiesQueue.push({
		object: object,
		activity: activity
	});
};

JsEngine.prototype.removeActivityFromLoop = function (object, activity, loop) {
	var removeArray = [],
		i,
		a;

	for (i = 0; i < this.loops[loop].activities.length; i ++) {
		a = this.loops[loop].activities[i];

		if (a.object === object && a.activity === activity) {
			removeArray.push(this.loops[loop].activities.splice(i, 1));
		}
	}

	if (removeArray.length) {
		return removeArray;
	}
	else {
		return false;
	}
};

JsEngine.prototype.startLoop = function () {
	// Restart the now - last cycle
	this.last = new Date().getTime();
	this.now = this.last;

	// Start mainLoop
	this.loop = setInterval(function () {
		engine.mainLoop();
	}, this.loopSpeed);
};

JsEngine.prototype.stopLoop = function () {
	clearInterval(this.loop);
};

// The main loop
JsEngine.prototype.mainLoop = function () {
	// Get the current time (for calculating movement based on the precise time change)
	this.now = new Date().getTime();

	this.updatesPerformed = false;
	this.frames ++;

	// Update animations that runs even if the game is paused
	animator.updateAllLoops(1);

	// Add queued activities to loops
	var name,
		timer,
		loop,
		f,
		i;

	for (name in this.loops) {
		if (this.loops.hasOwnProperty(name)) {
			loop = this.loops[name];
			loop.activities = loop.activities.concat(loop.activitiesQueue);
			loop.activitiesQueue = [];
		}
	}

	// Do loops
	for (name in this.loops) {
		if (this.loops.hasOwnProperty(name)) {
			timer = new Date().getTime();
			loop = this.loops[name];

			if (!loop.mask() || this.frames % loop.framesPerLoop) {continue; }

			if (this.frames - loop.lastFrame === loop.framesPerLoop) {
				loop.time += this.now - loop.last;
			}

			loop.lastFrame = this.frames;
			loop.last = this.now;

			for (i = 0; i < loop.activities.length; i ++) {
				f = loop.activities[i];
				if (!f.activity) {
					console.log(f);
					continue;
				}
				f.activity.call(f.object);
			}
			loop.execTime = (new Date().getTime()) - timer;
		}
	}

	// Update the game time
	this.gameTime += this.now - this.last;
	this.steps ++;

	this.updatesPerformed = true;

	// Draw game objects
	this.redraw(0);

	// Set last loop time, for next loop
	this.last = this.now;
};

JsEngine.prototype.registerObject = function (obj, id) {
	if (!id) {
		this.currentId ++;
		id = "obj" + (this.currentId - 1);
	}
	this.objectIndex[id] = obj;
	obj.id = id;
	return id;
};

// Function for redrawing an array of depths
JsEngine.prototype.redraw = function (depthTypes) {
	var i, d;

	for (i = 0; i < this.depth.length; i ++) {
		d = this.depth[i];
		if (d.manualRedraw == depthTypes) {
			if (d.first) {d.ctx.clearRect(0, 0, engine.canvasResX, engine.canvasResY); }
			d.drawChildren();
		}
	}
};