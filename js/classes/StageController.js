/*
StageController:
A controller responsible for doing level related things, spawning rocks for instance

Requires:
	Level vars to be set
*/

function StageController() {
	this.id='StageController';
	this.level=0;
	this.curObj=0;
	this.running=false;
	this.playerLevelStartState=false;
	this.onLevelSucceed=function(){};
	this.onLevelFail=function(){};
	this.scheduledTasks=[];
	this.messages={};
	this.stats={
		rocks:[]
	};
	updateObjects['onRunning'][this.id]=this;
}

StageController.prototype.prepareBackgrounds=function() {
	//Make cliff
	if (typeof ground=="undefined") {
		ground = new Sprite(pBg+'cliffCityGround.png',0,0,0,0,{'xOff':0,'yOff':0});
		road = new Sprite(pBg+'cliffCityRoad.png',0,0,0,0,{'xOff':0,'yOff':0});
		cliff = new Sprite(pBg+'cliffSide.png',8,0,0,0,{'xOff':0,'yOff':0});
		redrawStaticLayers();

		//Make some clouds
		for (var i=0;i<5;i++) {
			new Cloud();
		}
		console.log('Stage background created');
	}
	else {
		console.log('Stage background already created');
	}
}

StageController.prototype.prepareGame=function() {
	//Make score-object
	player=new Player();

	//Make canon building
	cannonBuilding=new CannonBuilding();
	
	//Make buildings and trees (the order is important for depth)
	this.destroyables=[];
	this.destroyables.push(
		new Destroyable(pImg+'Tree.png',4,421,680),
		new Destroyable(pImg+'AppleTree.png',4,520,673)
	);
	
	b1=new Building(1,4,91,665);
	b2=new Building(2,4,163,665);
	
	this.destroyables.push(
		new Destroyable(pImg+'Tree.png',4,200,690)
	);
	
	b3=new Building(3,4,232,680);
	b4=new Building(4,4,392,687);
	b5=new Building(5,4,446,663);
	b6=new Building(6,4,490,668);
	
	this.destroyables.push(
		new Destroyable(pImg+'Tree.png',4,98,700),
		new Destroyable(pImg+'AppleTree.png',4,151,725),
		new Destroyable(pImg+'Tree.png',4,225,718),
		new Destroyable(pImg+'AppleTree.png',4,362,700),
		new Destroyable(pImg+'AppleTree.png',4,436,718),
		new Destroyable(pImg+'Tree.png',4,473,694)
	);
}

// For ending all game related activities
StageController.prototype.destroyGame=function() {
	this.running=false;

	// Remove buildings
	cannonBuilding.remove();
	b1.remove();
	b2.remove();
	b3.remove();
	b4.remove();
	b5.remove();
	b6.remove();

	// Remove trees
	for (var i=0;i<this.destroyables.length;i++) {
		purge(this.destroyables[i]);
	}
	if (typeof shopCircle!== "undefined") {
		shopCircle.remove();
	}

	// Remove rocks and rockets
	clearDepth(5);
	clearDepth(3);

	// Remove messages, if there are any
	for (var i in this.messages) {
		this.messages[i].remove();
		delete this.messages[i];
	}

	// Stop all scheduled tasks
	this.stopAllTasks();

	// Remove player object
	if (player) {
		purge(player.inGameScore);
		delete player;
	}
}

// For removing game backgrounds
StageController.prototype.destroyBackgrounds=function() {
	if (typeof ground!="undefined") {
		purge(ground);
		purge(road);
		purge(cliff);

		delete ground;
		delete road;
		delete cliff;

		//Remove clouds
		clearDepth(2);
		console.log('Stage background removed');
		redrawStaticLayers();
	}
	else {
		console.log('Stage background not there');
	}
}

// For saving the game before each level, so a level can be played from the start
StageController.prototype.getPlayerState=function() {
	// Return the state of all the buildings
	var states={};
	for (var i=1;i<7;i++) {
		var b=window['b'+i];
		states['b'+i]={
			life:b.life,
			gunType:b.gunType,
			shieldType:b.shield.type
		}
	}

	states.cannonBuilding={cannon:{alive:cannonBuilding.cannon.alive}};

	states.player= {
		points:player.points,
		pointsTotal:player.pointsTotal
	}

	return states;
}

StageController.prototype.loadPlayerState=function(playerState) {
	for (var i=1;i<7;i++) {
		bState=playerState['b'+i];

		b=window['b'+i];
		b.setGun(bState.gunType);
		b.setShield(bState.shieldType);
		b.setLife(bState.life);
	}

	if (!cannonBuilding.alive) {
		cannonBuilding.revive();
	}
	cannonBuilding.setCannon(playerState.cannonBuilding.cannon.alive);

	player.points=playerState.player.points;
	player.pointsTotal=playerState.player.pointsTotal;
	player.inGameScore.setString(player.points.toString()+"$");
}

StageController.prototype.update=function() {
	// If paused, return
	if (pause) {return}
	
	for (var i=0; i<this.scheduledTasks.length; i++) {
		var t=this.scheduledTasks[i];
		if (gameTime>=t.fireTime) {
			t.callback();
			this.scheduledTasks.splice(i,1);
			i--;
		}
	}

	// If running, spawn rocks
	if (!this.running) {return}
	this.levelTime+=now-last
	if (frames % 4===0) {
		if (this.curObj==this.level.rocks.length && Object.keys(depth[5]).length===0) {
			this.endLevel();
		}
		
		for (var i=this.curObj;i<this.level.rocks.length;i++) {
			var r=this.level.rocks[i];
			r.level=r.level?r.level:1;
			this.curObj=i;
			
			if (this.cumulatedTime+r.spawnDelay<=this.levelTime) {
				this.cumulatedTime+=r.spawnDelay;
				
				// If direction and startposition is not set, randomize them
				r.dir=r.dir?r.dir:Math.random()*Math.PI;
				r.x=r.x?r.x:55+Math.random()*(arena.offsetWidth-110);

				// Get the rock's type
				var t=rocks[r.type.toLowerCase()];
				// Get the rock's level's specifications
				var l=t.levels[r.level-1];

				// Create a rock by putting together the gathered information
				new Rock(
					pImg+'Rocks/'+t.prefix+r.level+".png", //Sprite
					pImg+'Rocks/'+t.prefix+r.level+"Cracks.png", //Damage sprite
					r.x, // Start position
					r.dir, // Start direction
					l.gravity, // Gravity
					l.life, // Life
					l.value, // Value
					l.maxSpeed, // Max speed
					t.onStep, // Function to call on each step (for advanced customizing of the rocks behavior)
					t.onDestroy // Function to call when destroyed (for doing explosions etc.)
				);
				this.curObj++;
			}
			else {
				break;
			}
		}
	}
}

StageController.prototype.startLevel=function(level,onLevelSucceed,onLevelFail) {
	delete this.stats;
	this.stats={
		rocks:[]
	};
	this.levelStartPlayerState=this.getPlayerState();
	this.curObj=0;
	this.level=level;
	this.levelTime=-8000;
	this.running=0;
	this.cumulatedTime=0;
	this.onLevelSucceed=onLevelSucceed?onLevelSucceed:this.onLevelSucceed;
	this.onLevelFail=onLevelFail?onLevelFail:this.onLevelFail;

	loadedAfter=0;

	if (player.currentLevel !== undefined) {
		new FadeMessage("Prepare for\nlevel "+(player.currentLevel+1)+"/"+game.levels.length,10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});
	}
	else {
		new FadeMessage("Prepare for\nlevel test",10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});
	}

	// Make countdowntimer for incoming rocks
	var firstDelay=this.level.rocks[0].spawnDelay;
	var addOpt={align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'};

	new FadeMessage('5',10,260,3000+firstDelay,1000,addOpt);
	new FadeMessage('4',10,260,4000+firstDelay,1000,addOpt);
	new FadeMessage('3',10,260,5000+firstDelay,1000,addOpt);
	new FadeMessage('2',10,260,6000+firstDelay,1000,addOpt);
	new FadeMessage('1',10,260,7000+firstDelay,1000,addOpt);

	this.running=true;
}

StageController.prototype.endLevel=function() {
	if (typeof shopCircle!== "undefined") {
		shopCircle.remove();
	}

	this.running=false;

	// Run callbackfunctions depending on the outcome of the level
	if (!this.checkPlayerAlive()) {
		new FadeMessage("You\nfailed",10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});
		
		this.scheduleTask(this.onLevelFail,2100,'levelFail');
	} else {
		// Update number of completed levels
		game.store.levelsCompleted++;

		if (player.currentLevel !== undefined) {
			new FadeMessage("Level "+(player.currentLevel+1)+"/"+game.levels.length+"\ncompleted!",10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});
		}
		else {
			new FadeMessage("Level test\ncomplete!",10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});
		}

		// Store number of damaged- and lost buildings for statistic use
		this.levelStartPlayerState
		for (var i=1;i<7;i++) {
			var b=window['b'+i];
			var bStart=this.levelStartPlayerState['b'+i];
			
			if (b.life==1 && bStart.life==2) {
				player.buildingsDamaged++;
			}

			if (b.life==0) {
				console.log('building destroyed!');
				if (bStart.life==2) {
					player.buildingsDamaged++;
					player.buildingsLost++;
				} else if (bStart.life==1) {
					player.buildingsLost++;
				}
			}
		}

		// Do custom onLevelSucceed function
		this.scheduleTask(this.onLevelSucceed,2100,'levelSucceed');
	}

	return true
}

StageController.prototype.calculateLevelStats=function() {
	// Calculated level stats
	var totalImpacts=0,
		totalFallDistance=0,
		stats={};
	for (var i=0; i<this.stats.rocks.length; i++) {
		var r=this.stats.rocks[i];

		totalImpacts+=r.impacted?1:0;
		totalFallDistance+=r.fallDistance;
	}

	stats.impactFactor=totalImpacts/this.stats.rocks.length;
	stats.meanFallDistance=totalFallDistance/this.stats.rocks.length;
	return stats;
}

// Function for restarting a level
StageController.prototype.restartLevel=function() {
	if (!this.levelStartPlayerState) {
		return false;
	}
	this.loadPlayerState(this.levelStartPlayerState);
	this.startLevel(this.level);
}

StageController.prototype.checkPlayerAlive=function() {
	// Count how many buildings that are alive
	var aliveCount=0;
	for (var i=1;i<7;i++) {
		if (window['b'+i].life>0) {
			aliveCount++;
		}
	}

	// If no buildings are alive, return true
	if (aliveCount==0) {
		return false;
	}

	// If the cannonbuilding is not alive, return true
	return cannonBuilding.alive;
}

// Function for scheduling tasks within the game (works like alarm() but integrates with the game)
StageController.prototype.scheduleTask=function(callback,delayTime,id) {
	if (callback===undefined) {
		throw new Error('Missing argument: callback');
	}
	if (delayTime===undefined) {
		throw new Error('Missing argument: delayTime');
	}
	var id=id===undefined?false:id;

	var task={
		callback:callback,
		fireTime:gameTime+delayTime,
		id:id
	}

	this.scheduledTasks.push(task);
}

// Function for stopping a single scheduled task (requires that the task has an id)
// Calling this function with the taskId "false" will stop all tasks which has no id
StageController.prototype.stopTask=function(taskId) {
	for (var i=0; i<this.scheduledTasks.length; i++) {
		if (this.scheduledTasks[i].id===taskId) {
			this.scheduledTasks.splice(i,1);
			return true;
		}
	}

	return false;
}

// Function for stopping all tasks
StageController.prototype.stopAllTasks=function() {
	this.scheduledTasks=[];
}

StageController.prototype.createDummies=function() {
	if (typeof this.dummies!=="undefined") {return;}

	this.dummies=[
		//Make canon building
		new Sprite(pImg+'RocketBuilding.png',4,315,660),
		
		//Make buildings and trees (the order is important for depth)
		new Sprite(pImg+'Tree.png',4,421,680),
		new Sprite(pImg+'AppleTree.png',4,520,673),
		
		new Sprite(pImg+'Building1.png',4,91,665),
		new Sprite(pImg+'Building2.png',4,163,665),
		
		new Sprite(pImg+'Tree.png',4,200,690),
		
		new Sprite(pImg+'Building3.png',4,232,680),
		new Sprite(pImg+'Building4.png',4,392,687),
		new Sprite(pImg+'Building5.png',4,446,663),
		new Sprite(pImg+'Building6.png',4,490,668),
		
		new Sprite(pImg+'Tree.png',4,98,700),
		new Sprite(pImg+'AppleTree.png',4,151,725),
		new Sprite(pImg+'Tree.png',4,225,718),
		new Sprite(pImg+'AppleTree.png',4,362,700),
		new Sprite(pImg+'AppleTree.png',4,436,718),
		new Sprite(pImg+'Tree.png',4,473,694)
	]
}

StageController.prototype.removeDummies=function() {
	for (var i=0;i<this.dummies.length;i++) {
		purge(this.dummies[i]);
	}
	delete this.dummies;
}