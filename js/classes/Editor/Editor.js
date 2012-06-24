/*
Editor:
The game's level editor.

Requires:
	Sprite
	TextBlock
	MouseIndex
	StageController
*/

/* Constructor */
function Editor() {
	// Make cliff
	stageController.prepareBackgrounds();

	this.newSpawnArrow();
	this.rockType="Orange";
	this.rockLevel=1;
	this.rocks=[];
	this.testModeStarted=false;
	this.placeMode=0;
	this.id="Editor";

	// Create rock type buttons
	this.rockButtons=[];
	var count=0;
	for (var i in rocks) {
		if (!rocks[i].prefix) {continue;}

		for (var ii=0; ii<rocks[i].levels.length; ii++) {
			var btn;
			btn=new SpriteButton(25,27+count*55,10,function() {
				editor.rockType=this.rockType;
				editor.rockLevel=this.rockLevel;
				editor.selector.animate({y:this.y},{dur:400});
			},pImg+"Editor/RockButtonBackground.png",pImg+"Rocks/"+rocks[i].prefix+(ii+1)+".png");
			btn.rockType=rocks[i].prefix;
			btn.rockLevel=ii+1;
			btn.xOff+=5;
			count++;
			this.rockButtons.push(btn);
		}
	}
	
	// Create selectorbox
	this.selector=new Sprite(pImg+"Editor/RockSelectorBox.png",10,-10,27,0,{xOff:0});

	// Save button
	this.btnSave=new SpriteButton(25,613,10,function() {
		var level={'name':'Saved Level','prepareTime':'5000','rocks':editor.rocks};
		editor.testBeforeSave();
	},pImg+"Editor/RockButtonBackground.png",pImg+"Editor/Floppy.png");
	this.btnSave.xOff+=5;

	// Test level button
	this.btnTestMode=new SpriteButton(25,668,10,function() {
		if (editor.testModeStarted) {
			editor.endTestMode();
		} else {
			editor.startTestMode();
		}
	},pImg+"Editor/RockButtonBackground.png",pImg+"Editor/Play.png");
	this.btnTestMode.xOff+=5;

	// Back to menu button
	this.btnMainMenu=new SpriteButton(25,723,10,function() {
		editor.remove();
		game.spawnMainMenu();
	},pImg+"Editor/RockButtonBackground.png",pImg+"Editor/Quit.png");
	this.btnMainMenu.xOff+=5;

	// Add to update array
	updateObjects.onRunning[this.id]=this;

	stageController.createDummies();

	// Always show tool tips on startup
	this.showTooltips();
}

Editor.prototype.remove=function() {
	this.btnTestMode.remove();
	this.btnSave.remove();
	this.btnMainMenu.remove();
	this.selector.remove();
	this.spawnArrow.remove();
	stageController.removeDummies();

	for (var i=0; i<this.rockButtons.length; i++) {
		this.rockButtons[i].remove();
	}
	for (var i=0; i<this.rocks.length; i++) {
		var markers=this.rocks[i].markers;
		for (var ii=0; ii<markers.length; ii++) {
			markers[ii].animate({opacity:0},{dur:200,callback:function() {
				purge(this);
			}})
		}
	}
	delete this.rocks;

	stageController.destroyBackgrounds()

	purge(this);
}

Editor.prototype.newSpawnArrow=function() {
	this.spawnArrow=new Sprite(pImg+"Editor/SpawnArrow.png",11,-50,-25,Math.PI/2,{xOff:-50,opacity:0});
	this.spawnArrow.x=Math.max(100,Math.min(500,Math.round(mouse.x/editorSettings.spawnPositionStepSize)*50));
}

Editor.prototype.startTestMode=function() {
	// If the level does not contain any rocks, do nothing
	if (this.rocks.length===0) {
		return;
	}

	// Hide menu
	this.testModeStarted=true;
	this.btnTestMode.fg.bm=loader.images[pImg+'Editor/Stop.png'];
	this.selector.animate({x:-65},{dur:200});
	this.btnSave.animate({x:-30},{dur:200});
	this.btnMainMenu.animate({x:-30},{dur:200});

	for (var i=0; i<this.rocks.length; i++) {
		var rock=this.rocks[i];

		for (var ii=0; ii<rock.markers.length; ii++) {
			rock.markers[ii].animate({opacity:0},{dur:500});
		}
	}
	for (var i=0; i<this.rockButtons.length; i++) {
		this.rockButtons[i].animate({x:-30},{dur:200});
	}

	// Start running level
	var level={'name':'Saved Level','prepareTime':'5000','rocks':editor.rocks};
	stageController.prepareGame();
	
	// Elevate unlocked upgrades
	player.shieldsAvailable=4;
	player.weaponsAvailable=4;
	player.weaponIntelligence=0;
	player.rocketBlastRangeLevel=4;
	player.rocketDmgLevel=0;
	player.cannonAutomatic=0;
	player.rocketBounces=0;
	player.addPoints(10000);

	stageController.removeDummies();
	redrawStaticLayers();

	stageController.startLevel(level,function() {
		editor.endTestMode();
	});
}

Editor.prototype.testBeforeSave=function() {
	// If the level does not contain any rocks, do nothing
	if (this.rocks.length===0) {
		return;
	}

	// Disable save button
	this.btnSave.disable();
	
	// Hide menu
	this.testModeStarted=true;
	this.btnTestMode.fg.bm=loader.images[pImg+'Editor/Stop.png'];
	this.selector.animate({x:-65},{dur:200});
	this.btnSave.animate({x:-30},{dur:200});
	this.btnMainMenu.animate({x:-30},{dur:200});
	for (var i=0; i<this.rocks.length; i++) {
		var rock=this.rocks[i];

		for (var ii=0; ii<rock.markers.length; ii++) {
			rock.markers[ii].animate({opacity:0},{dur:500});
		}
	}
	for (var i=0; i<this.rockButtons.length; i++) {
		this.rockButtons[i].animate({x:-30},{dur:200});
	}

	// Start running level
	var level={'name':'Saved Level','prepareTime':'5000','rocks':editor.rocks};
	stageController.prepareGame();
	
	// Elevate unlocked upgrades
	player.shieldsAvailable=4;
	player.weaponsAvailable=4;
	player.weaponIntelligence=0;
	player.rocketBlastRangeLevel=4;
	player.rocketDmgLevel=0;
	player.cannonAutomatic=0;
	player.rocketBounces=0;
	player.addPoints(10000);

	stageController.removeDummies();
	redrawStaticLayers();

	stageController.startLevel(level,function() {
		levelServer.saveLevel(level,function(data) {
			// Save level stats to database
			levelServer.saveStats(data, stageController.calculateLevelStats());

			stageController.destroyGame();
			editor.remove();
			stageController.createDummies();
			stageController.prepareBackgrounds();

			// Hide pause button
			game.btnPause.animate({x:-30},{dur:200});

			// Show "level saved" dialog
			game.showDialog(
				new Sprite(pBg+'EditorSaved.png',10,320,345,0,{opacity:0}),
				new Button(10,320,421,0,'To main menu',function() {
					game.clearDialog();
					
					// Spawn main menu again
					game.spawnMainMenu();
				})
			)
		});
	});
}

Editor.prototype.endTestMode=function() {
	// Show menu
	this.testModeStarted=false;
	this.btnTestMode.fg.bm=loader.images[pImg+'Editor/Play.png'];
	this.selector.animate({x:-10},{dur:200});
	this.btnSave.animate({x:25},{dur:200});
	this.btnMainMenu.animate({x:25},{dur:200});
	this.updateRockQueue();

	for (var i=0; i<this.rockButtons.length; i++) {
		this.rockButtons[i].animate({x:25},{dur:200})
	}

	// Remove all gameplay traces
	stageController.destroyGame();
	stageController.createDummies();
}

Editor.prototype.update=function() {
	if (this.testModeStarted) {
		return;
	}

	if (mouse.y<200 && mouse.x>52) {
		if (this.spawnArrow.opacity!=1 && !animator.isAnimated(this.spawnArrow)) {
			this.spawnArrow.animate({opacity:1},{dur:200});
		}

		if (this.placeMode===0) {
			var x=Math.max(100,Math.min(500,Math.round(mouse.x/editorSettings.spawnPositionStepSize)*50));
			this.spawnArrow.x=x;

			if (mouse.isPressed(1)) {
				this.placeX=this.spawnArrow.x;
				this.placeMode=1;
			}
		}
		else {
			test=this.spawnArrow;
			var d=Math.atan2(mouse.y-this.spawnArrow.y,mouse.x-this.spawnArrow.x);

			d=Math.max(Math.PI/6,Math.min(Math.PI/6*5,Math.round(d/(Math.PI/6))*Math.PI/6 ));
			this.spawnArrow.dir=d;

			if (mouse.isPressed(3)) {
				this.placeMode=0;
				this.spawnArrow.dir=Math.PI/2;
				var x=Math.max(100,Math.min(500,Math.round(mouse.x/editorSettings.spawnPositionStepSize)*50));
				this.spawnArrow.x=x;
				this.placeX=this.spawnArrow.x;
			}

			if (mouse.isPressed(1)) {
				this.addRock(this.spawnArrow.x,this.spawnArrow.dir,this.rockType,this.rockLevel);
			}
		}
	}
	else {
		if (this.spawnArrow.opacity!=0 && !animator.isAnimated(this.spawnArrow)) {
			this.spawnArrow.animate({opacity:0},{dur:200});
		}
		this.spawnArrow.dir=Math.PI/2;
		this.placeMode=0;
	}
}

Editor.prototype.showTooltips=function() {
	pause=1;

	game.showDialog(
		new Sprite(pBg+'EditorHelp.png',10,320,375,0,{opacity:0}),
		btn=new Button(10,320,436,0,'Continue',function() {
			game.clearDialog();
			pause=0
		})
	);
}

Editor.prototype.addRock=function(position,dir,type,level) {
	var rock=new SpriteButton(545, 230, 10, function(){}, pImg+'Rocks/'+type+level+'.png'),

		up=new SpriteButton(560, 230, 10, function(){
			var rock=editor.rocks[this.position];

			editor.rocks.splice(this.position,1);
			editor.rocks.splice(this.position+1,0,rock);
			editor.updateRockQueue();
		}, pImg+'Editor/Up.png'),

		down=new SpriteButton(575, 230, 10, function() {
			// If the rock is the first rock, do nothing
			if (!this.position) {
				return;
			}

			var rock=editor.rocks[this.position];

			editor.rocks.splice(this.position,1);
			editor.rocks.splice(this.position-1,0,rock);
			editor.updateRockQueue();
		}, pImg+'Editor/Down.png'),

		cross=new SpriteButton(590, 230, 10, function(){
			var markers=editor.rocks[this.position].markers;
			for (var i=0; i<markers.length; i++) {
				var m=markers[i];
				if (m.disable) {
					m.disable();
				}

				m.animate({opacity:0},{dur:200,callback:function() {
					purge(this);
				}})
			}

			editor.rocks.splice(this.position,1);
			editor.updateRockQueue();
		}, pImg+'Editor/Cross.png'),

		timer=new SpriteButton(571, 230, 10, function(btn){
			t=parseFloat(this.text.string);

			if (btn==1) {
				t+=.5;
			} else {
				t-=.5;
			}

			var tMin=0;
			if (t>=10) {
				t=tMin;
			} else if (t<tMin) {
				t=9.5;
			}
			t=Math.round(t*10)/10;

			editor.rocks[this.position].spawnDelay=t*1000;

			t=t.toString();
			if (t.length==1) {t+='.0'}

			this.text.setString(t.toString());
		}, pImg+'Editor/IntervalTimer.png');

	up.yOff=down.yOff=cross.yOff=15;
	up.position=down.position=this.rocks.length;
	timer.yOff=0;

	var line=new Sprite(pImg+'Editor/EditorLine.png', 10, 300, 230, 0, {'opacity':0});
	rock.opacity=up.opacity=down.opacity=cross.opacity=timer.opacity=0;

	timer.text=new TextBlock(editor.rocks.length===0?'0.0':'1.0', 10, 570, 230, 18, {font:'normal 9px Verdana',align:'right',fillStyle:'#fff',yOff:-1});

	this.rocks.push({
		'spawnDelay':Math.round(parseFloat(timer.text.string)*1000),
		'x':position,
		'dir':dir,
		'type':type,
		'level':level,
		'markers':[
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

	this.placeMode=0;
	this.newSpawnArrow();
	this.updateRockQueue(1);
}

Editor.prototype.updateRockQueue=function() {
	for (var i=0; i<this.rocks.length; i++) {
		var rock=this.rocks[i];

		for (var ii=0; ii<rock.markers.length; ii++) {
			var marker=rock.markers[ii],
				newY=230+(this.rocks.length-1-i)*50,
				newOpacity=Math.max(0,Math.min(1,1-(newY-600)/150));

			if (marker.disable) {
				marker.disable();
			}

			marker.position=i;

			// Setup animation end properties
			var props={opacity:newOpacity,y:newY};

			if (marker.depth==11) {
				props.xOff=marker.bmWidth/2;
			}

			marker.animate(props,{dur:200,callback:function() {
				if (this.enable) {
					this.enable();
				}
			}});
		}
	}
}