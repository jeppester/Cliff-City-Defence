/*
main:
Loads all objects required by the engine, sets core functinos, and runs the core loop.

Game specific behavior should not be added in this file.
Instead: Load another file that overwrites the following functions:
	game.onStart -> Runs when startGame is called.
	game.onStep -> Runs in each frame, when the game is not paused.
	game.onFrame -> Runs in each frame.
	
Requires:
	KeyboardIndex
	MouseIndex
	Loader
	Animator
*/
	
// Set variables required by the engine
var	frames=0,
	steps=0,
	last=new Date().getTime(),
	gameTime=0,
	timeLeft,
	now=last,
	updatesPerformed=false,
	loopSpeed=loopSpeed?loopSpeed:30,
	loopsPerColCheck=loopsPerColCheck?loopsPerColCheck:2,
	useCanvas=useCanvas?useCanvas:true;
	curId=0,
	pause=true,
	arena=document.getElementById('arena'),
	
	// Depth-layers for drawing operations
	depth=new Array(),
	nonStaticDepths=[],
	nonStaticCtxs=[],
	staticDepths=staticDepths?staticDepths:[],
	staticCtxs=[],
	
	// Arrays for update-operations, an object can belong to both!
	updateObjects={'onRunning':{},'onPaused':{}},
	
	// Ressources
	images=images?images:array(),
	sounds=sounds?sounds:array();
	
// Create the layers
for (var i=0; i < layers; i++) {
	depth.push(new Object());
}
	
// Disable right click inside arena
arena.oncontextmenu=function() {
	return false;
}

// Prepare canvas rendering
if (useCanvas) {
	function makeCanvas() {
		c=document.createElement("canvas");
		c.setAttribute('style',"position:absolute;left:0px;top:0px;width:100%;height:100%");
		c.width=canvasResX;
		c.height=canvasResY;
		arena.appendChild(c);
		ctx=c.getContext('2d');
		return ctx;
	}

	// Evaluate the depth setup and map each layer to a canvas.
	// The function runs through the depth and creates only the necessary number of canvases for the layout
	// For instance, if one static depth is followed by two which are non-static, the process will create one canvas for the static depth and one canvas for the two non-static depths.
	// All depths are mapped to the right canvases in the depthMap-array
	// static and non-static depths are grouped in the arrays: staticDepths and nonStaticDepths, to make redrawing faster
	// static and non-static canvas contexts are grouped following the same approach and for the same reason.
	depthMap=[];
	var lastStat, lastCtx;
	for (var i=0; i < depth.length; i++) {
		stat=staticDepths.indexOf(i)!=-1?true:false;
		
		if (!stat) {
			// Put the layer into the group of nonStatic layers
			nonStaticDepths.push(i);
		}
		
		if (stat === lastStat) {
			// If the depth has the same static-setting as the last, map it to the same canvas
			depthMap[i] = lastCtx;
		} else {
			// Else make a new canvas for this layer
			lastCtx=depthMap[i]=makeCanvas();
			
			// Put the new canvas into the right group
			if (stat) {
				staticCtxs.push( lastCtx );
			} else {
				nonStaticCtxs.push( lastCtx );
			}
			
			// Set lastStat for next iteration
			lastStat=stat;
		}
	}
}

// Create objects required by the engine
var keyboard=new KeyboardIndex(),
	mouse=new MouseIndex(),
	loader=new Loader(),
	animator=new Animator();

// Load sample images and -sounds
loader.loadImages(images)
loader.loadSounds(sounds);

// clearStage removes all traces of a game-session
function clearStage() {
	// Clear all layers
	for (var i in depth) {
		for (var ii in depth[i]) {
			depth[i][ii].remove();
		}
	}
	
	// Reset game variables
	last=new Date().getTime();
	gameTime=0;
	now=last;
	pause=1;
	curId=0;
	timeLeft=0;
}

// Function for clearing all objects in a single layer
function clearDepth(depth) {
	if (depth==="undefined") {
		throw new Error('Missing argument: "depth"');
	}

	if (typeof depth=="number") {
		depth=window.depth[depth];
	}

	for (var i in depth) {
		purge(depth[i]);
	}
}

// Function for starting a new game
function startGame() {
	clearStage();
	pause=0;
	
	// Do game specific stuff
	game.onStart();
}

// The main loop
function mainLoop() {
	// Get the current time (for calculating movement based on the precise time change)
	now=new Date().getTime();
	
	updatesPerformed=false;
	frames++;

	// Update animations that runs even if the game is paused
	animator.updateAll(1);

	if (!pause) {
		// Do game specific stuff
		game.onStep();
		
		// Do collision checks (not in every frame)
		var c=frames/loopsPerColCheck;
		if (c/Math.floor(c)==1) {
			for (var i in depth[2]) {
				var obj=depth[2][i];
				
				if (obj.cols()) {
					obj.cols();
				}
			}
			for (var i in depth[3]) {
				depth[3][i].cols();
			}
			for (var i in depth[4]) {
				depth[4][i].cols();
			}
			for (var i in depth[5]) {
				depth[5][i].cols();
			}
		}
		
		// Do animations
		animator.updateAll(0);

		// Do object updates
		for (var i in updateObjects['onRunning']) {
			updateObjects['onRunning'][i].update();
		}
		
		// Update the game time
		gameTime+=now-last;
		steps++;
	} else {
		// Do object updates for objects which are updated when the game is paused
		for (var i in updateObjects['onPaused']) {
			updateObjects['onPaused'][i].update();
		}
	}
	
	updatesPerformed=true;
	
	// Do game specific stuff
	game.onFrame();
	
	// Draw game objects
	if (useCanvas) {
		redrawNonStaticLayers();
	}
	else {
		for (var i in depth) {
			for (var ii in depth[i]) {
				depth[i][ii].drawHTML();
			}
		}
	}
	
	// Set last loop time, for next loop
	last=now;
	setTimeout("mainLoop()",loopSpeed);
}

function redrawStaticLayers() {
	// Clear and redraw static layers
	for (var i=0; i<staticCtxs.length; i++) {
		staticCtxs[i].clearRect (0,0,canvasResX,canvasResY);
	}
	
	for (var i=0; i<staticDepths.length; i++) {
		var d=staticDepths[i];

		for (var ii in depth[d]) {
			depth[d][ii].drawCanvas();
		}
	}
}

function redrawNonStaticLayers() {
	// Clear and redraw static layers
	var nSC=nonStaticCtxs,
		nSD=nonStaticDepths,
		d=depth;

	for (var i=0; i<nSC.length; i++) {
		nSC[i].clearRect (0,0,canvasResX,canvasResY);
	}
	
	for (var i=0; i<nSD.length; i++) {
		for (var ii in d[nSD[i]]) {
			d[nSD[i]][ii].drawCanvas();
		}
	}
}

// Start mainLoop
setTimeout("mainLoop()",loopSpeed);

// Functions to be overwritten if needed in a game
// TODO: Should perhaps use events instead
game.onStartGame=function() {};
game.onGameStep=function() {};
game.onFrame=function() {};
game.onLoaded=function() {};
