game.onClearStage=function() {
	// Keep code in objects as much as possible
};

// Make game properties
game.dialogObjects=[]

game.onLoaded=function() {
	// Open static objects
	stageController=new StageController();
	levelServer=new LevelServer(location.href.replace(/\/\w*\.*\w*$/,'')+'/levelServer');
	game.spawnMainMenu();

	// Set levels completed to default value
	game.store=localStorage;
	game.store.levelsCompleted=game.store.levelsCompleted?game.store.levelsCompleted:0;

	// Make pause/menu button
	game.btnPause=new SpriteButton(-30,723,10,function() {
		game.spawnInGameMenu();
		this.animate({x:-30},{dur:200});
		pause=1;
	},pImg+"Editor/RockButtonBackground.png",pImg+"Editor/Pause.png");
	game.btnPause.xOff+=5;
}

game.showDialog=function(obj1,obj2,obj3) {
	this.dialogObjects.push.apply(this.dialogObjects,arguments);

	for (var i=0; i<this.dialogObjects.length; i++) {
		var obj=this.dialogObjects[i];
		
		obj.animate({opacity:1,x:300},{dur:500});
	}
}

game.clearDialog=function() {
	while (this.dialogObjects.length) {
		var obj=this.dialogObjects[0];
		if (obj.disable) {
			obj.disable();
		}
		obj.animate({opacity:0,bmSize:1.2},{dur:200,callback:function() {
			this.remove();
		}})

		this.dialogObjects.splice(0,1);
	}
}

game.onLevelSucceed=function() {
	// Save level stats to database
	levelServer.saveStats(stageController.level.lid, stageController.calculateLevelStats());
	
	if (player.currentLevel==game.levels.length-1) {
		// Make dialog objects and buttons
		game.showDialog(
			new Sprite(pImg+'GameLogoPipes.png',10,320,360,0,{opacity:0}),
			new Sprite(pImg+'GameLogoPipes.png',10,320,550,0,{opacity:0}),
			new Sprite(pImg+'GameLogo.png',10,320,180,0,{opacity:0}),
			new Sprite(pImg+'GameComplete.png',10,320,429,0,{opacity:0}),
			new TextBlock(parseInt(player.pointsTotal).toString(), 10, 320, 462, 90, {align:'right',font:'normal 12px Verdana',opacity:0}),
			new TextBlock(parseInt(player.rocksDestroyed).toString(), 10, 320, 477, 90, {align:'right',font:'normal 12px Verdana',opacity:0}),
			new TextBlock(parseInt(player.buildingsLost).toString(), 10, 320, 492, 90, {align:'right',font:'normal 12px Verdana',opacity:0}),
			new TextBlock(parseInt(player.buildingsDamaged).toString(), 10, 320, 507, 90, {align:'right',font:'normal 12px Verdana',opacity:0}),
			new TextBlock(parseInt(player.weaponsBought).toString(), 10, 320, 522, 90, {align:'right',font:'normal 12px Verdana',opacity:0}),
			new TextBlock(parseInt(player.shieldsBought).toString(), 10, 320, 537, 90, {align:'right',font:'normal 12px Verdana',opacity:0}),
			new Button(10,320,598,0,'TO MAIN MENU',function() {
				// Hide all dialog objects
				game.clearDialog();

				// Remove all traces of gameplay
				stageController.destroyGame();
				stageController.destroyBackgrounds();

				// Show main menu
				game.spawnMainMenu();
			})
		)

		// Hide pause button
		game.btnPause.animate({x:-30},{dur:200});
	}
	else {
		// If there are more levels, show upgrade menu and continue to next level afterwards
		player.currentLevel++;

		upgradeMenu=new UpgradeMenu(function() {
			stageController.startLevel(game.levels[player.currentLevel]);

			// If the player has gained access to an upgrade that gives access to a building enhancement, show an instructions window
			if (this.player.shieldsAvailable+this.player.weaponsAvailable==0 && player.shieldsAvailable+player.weaponsAvailable>0) {
				pause=1;
				game.instructions=new Sprite(pBg+'EnhancementInstructions.png',10,320,375,0,{opacity:0});

				var btn=new Button(10,320,466,0,'Continue',function() {
					game.instructions.animate({opacity:0,bmSize:1.2},{dur:200,easing:'quadOut',callback:function() {
						this.remove();
					}})

					this.animate({opacity:0,bmSize:1.2},{dur:200,easing:'quadOut',callback:function() {
						this.remove();
						pause=0;
					}})
				});

				game.instructions.animate({opacity:1,x:300},{dur:500,easing:'quadOut'});
				btn.animate({opacity:1,x:300},{dur:500,easing:'quadOut'});
			}

			stageController.running=true;
			game.btnPause.animate({x:25},{dur:200});
		});

		game.btnPause.animate({x:-30},{dur:200});

		// Store current upgrades in the upgradeMenu object
		upgradeMenu.player={
			shieldsAvailable:player.shieldsAvailable,
			weaponsAvailable:player.weaponsAvailable
		}
	}
}

game.onLevelFail=function() {
	// Save level stats to database
	levelServer.saveStats(stageController.level.lid, stageController.calculateLevelStats());

	pause=1;
	new CustomMenu(10,300,375,[
		{
			text:'Retry level',
			onClick:function() {
				stageController.restartLevel();
				pause=0;
				this.parent.remove();
			}
		},
		{
			text:'Go to main menu',
			onClick:function() {
				stageController.destroyGame();
				stageController.destroyBackgrounds();
				game.spawnMainMenu();
				this.parent.remove();
			}
		}
	])
}

game.spawnMainMenu=function() {
	// Open main menu
	stageController.prepareBackgrounds();
	stageController.createDummies();

	game.showDialog(
		new Sprite(pImg+'GameLogoPipes.png',10,320,430,0,{opacity:0}),
		new Sprite(pImg+'GameLogo.png',10,320,254,0,{opacity:0}),
		new CustomMenu(10,320,450,[{text:'PLAY',onClick:function() {
				stageController.prepareBackgrounds();
				stageController.prepareGame();
				stageController.removeDummies();

				// Remove main menu
				game.clearDialog();

				// Make dialog
				pause=0;
				player.currentLevel=0;

				// Fetch levels from database
				levelServer.getLevelCollection('',function(data) {
					eval('var collection='+data);

					console.log(collection);

					game.levels=collection.levels;
					stageController.startLevel(game.levels[player.currentLevel],game.onLevelSucceed,game.onLevelFail);
					game.showGameplayInstructions();
				})
			}},
			{text:"CREATE LEVELS",onClick:function(){
				// Remove main menu
				game.clearDialog();

				// The player will have to complete at least three levels in order to open the level editor
				if (game.store.levelsCompleted>2) {
					editor=new Editor();
				}
				else {
					// Show denial message
					game.instructions=new Sprite(pBg+'EditorDenial.png',10,320,345,0,{opacity:0});

					btn=new Button(10,320,421,0,'Back to menu',function() {
						game.instructions.animate({opacity:0,bmSize:1.2},{dur:200,easing:'quadOut',callback:function() {
							this.remove();
						}})

						this.animate({opacity:0,bmSize:1.2},{dur:200,easing:'quadOut',callback:function() {
							this.remove();
							pause=0;
						}})

						// Spawn main menu again
						game.spawnMainMenu();
					});

					game.instructions.animate({opacity:1,x:300},{dur:500,easing:'quadOut'});
					btn.animate({opacity:1,x:300},{dur:500,easing:'quadOut'});
				}
			}}]
		)
	)

	pause=0;
}

// For showing in game menu
game.spawnInGameMenu=function() {
	this.showDialog(
		new Sprite(pImg+'GameLogoPipes.png',10,320,430,0,{opacity:0}),
		new Sprite(pImg+'GameLogo.png',10,320,254,0,{opacity:0}),
		new CustomMenu(10,320,450,[{text:'CONTINUE',onClick:function() {
				game.clearDialog();
				game.btnPause.animate({x:25},{dur:200});

				setTimeout(function () {
					pause=0
				},500);
			}},{text:"TO MAIN MENU",onClick:function(){
				game.clearDialog();

				stageController.destroyGame();
				game.spawnMainMenu();
			}}
		])
	)
}

game.showGameplayInstructions=function() {
	pause=1;

	this.showDialog(
		new Sprite(pBg+'Instructions.png',10,320,375,0,{opacity:0}),
		new Button(10,320,412,0,'Start playing',function() {
			game.clearDialog();
			game.btnPause.animate({x:25},{dur:200,callback:function() {pause=0}});
		})
	);
}

game.onStart=function() {
	// Keep code in objects as much as possible
};

game.onStep=function() {
	// Keep code in objects as much as possible
};

game.onFrame=function() {
	// Keep code in objects as much as possible
};
