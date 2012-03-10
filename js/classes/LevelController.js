/*
LevelController:
A controller responsible for doing level related things, spawning rocks for instance

Requires:
	Level vars to be set
*/

function LevelController() {
	this.id='LevelController';
	this.level=0;
	this.curObj=0;
	this.running=false
	updateObjects['onRunning'][this.id]=this;
	
	this.update=function() {
		if (!this.running) {return}

		this.levelTime+=now-last
		if (frames % 4===0) {
			if (this.curObj==game.levels[this.level].rocks.length && Object.keys(depth[5]).length===0) {
				this.endLevel();
			}
			
			for (var i=this.curObj;i<game.levels[this.level].rocks.length;i++) {
				var r=game.levels[this.level].rocks[i];
				this.curObj=i;
				
				if (r.spawnTime<=this.levelTime) {
					//Spawn the rock
					//Spawn rocks
					r.dir=r.dir?r.dir:Math.random()*180;
					r.x=r.x?r.x:55+Math.random()*(arena.offsetWidth-110);
					eval('new '+r.type+'('+r.x+','+r.dir+')');
					this.curObj++;
				}
				else {
					break;
				}
			}
		}
	}
	
	this.startLevel=function(level) {
		this.curObj=0;
		this.level=level;
		this.levelTime=0;
		this.running=0;
		loadedAfter=0;

		var text=new TextBlock('Prepare for:',10,300,200,600,{align:'center',font:'normal 28px Verdana',bmSize:3,opacity:0,xOff:300,yOff:40,fillStyle:'#000000'});
		var text2=new TextBlock(game.levels[this.level].name,10,300,220,600,{align:'center',font:'normal 50px Verdana',bmSize:3,opacity:0,xOff:300,yOff:30,fillStyle:'#FF1100'});
		var text3=new TextBlock('Incoming rocks!',10,300,220,600,{align:'center',font:'normal 50px Verdana',bmSize:3,opacity:0,xOff:300,yOff:30,fillStyle:'#FF1100'});

		// Animate "Level complete" text
		text.animate({bmSize:1,opacity:1},{dur:300});
		setTimeout(function() {
			text.animate({bmSize:3,opacity:0},{dur:300});
		},1500)

		// Animate the level name
		setTimeout(function() {
			text2.animate({bmSize:1,opacity:1},{dur:300});
		},500)
		setTimeout(function() {
			text2.animate({bmSize:3,opacity:0},{dur:300});
		},2000)

		// Animate the 'incoming rocks'-text
		setTimeout(function() {
			text3.animate({bmSize:1,opacity:1},{dur:300});
		},game.levels[this.level].prepareTime-1500)

		// Create upgrade menu after each level
		setTimeout(function() {
			levelController.running=true;
			text3.animate({bmSize:3,opacity:0},{dur:300});
		},game.levels[this.level].prepareTime);
	}
	this.endLevel=function() {
		this.running=false;
		console.write(game.levels[this.level].name+" completed");

		var text=new TextBlock('Level completed:',10,300,200,600,{align:'center',font:'normal 28px Verdana',bmSize:3,opacity:0,xOff:300,yOff:40,fillStyle:'#000000'});
		var text2=new TextBlock(game.levels[this.level].name,10,300,220,600,{align:'center',font:'normal 50px Verdana',bmSize:3,opacity:0,xOff:300,yOff:30,fillStyle:'#FF1100'});

		// Animate "Level complete" text
		text.animate({bmSize:1,opacity:1},{dur:300});
		setTimeout(function() {
			text.animate({bmSize:3,opacity:0},{dur:300});
		},2000)

		// Animate the level name
		setTimeout(function() {
			text2.animate({bmSize:1,opacity:1},{dur:300});
		},500)
		setTimeout(function() {
			text2.animate({bmSize:3,opacity:0},{dur:300});
		},2500)

		// Create upgrade menu after each level
		setTimeout(function() {
			upgradeMenu=new UpgradeMenu();
		},3000)
	}
}
