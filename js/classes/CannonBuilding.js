function CannonBuilding() {
	// Import sprite
	importClass(this,Sprite);

	//Make cannon
	this.cannon=new Sprite(pImg+'Cannon.png',4,300,628,-90,{'xOff':0,'yOff':10});
	this.cannon.alive=true;

	//Extend Sprite
	this.sprite(pImg+'RocketBuilding.png',4,315,660);
	
	//Add object in update array
	updateObjects.onRunning[this.id]=this;
	
	//Set object to alive
	this.alive=true;
	
	this.loadedAfter=0;
	
	this.update=function() {
		if (this.cannon.alive==false) {return;}

		var x=this.cannon.x;
		var y=this.cannon.y;
		var mDir=Math.atan2(mouse.y-y,mouse.x-x);

		if (mDir>-10/180*Math.PI || mDir<-170/180*Math.PI) {
			if (mDir>90/180*Math.PI || mDir<-170/180*Math.PI) {
				mDir=-170/180*Math.PI;
			} else {
				mDir=-10/180*Math.PI;
			}
		}
		
		//Update cannon position
		this.cannon.dir=mDir;

		if (mouse.y>y) {return}

		var shoot = player.cannonAutomatic ? mouse.isDown(1) : mouse.isPressed(1);
		if (shoot && this.loadedAfter<=gameTime) {
			new Rocket(this.cannon.dir);
			
			this.loadedAfter=gameTime+500;
			this.cannon.xOff=5;
			this.cannon.animate({'xOff':0},{'dur':300})
		}
	}
	
	this.cols=function() {
		//Check for collisions
		if (!this.alive) {return;}
		
		for (var i in depth[5]) {
			cObj=depth[5][i];
			if (!cObj.alive) {continue;}
			cDist=this.bmWidth/2+cObj.bmWidth/2;
			if (Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist) {
				/*
				if (this.cannon.alive) {
					this.setCannon(false);
				} else {
					this.die();
				}
				*/

				this.die();
				cObj.impacted=true;
				cObj.remove();
			}
		}
	}
	
	this.remove = function(time) {
		purge(this.cannon);
		purge(this);
	}
}

CannonBuilding.prototype.revive=function() {
	this.bmSize=0;
	this.opacity=1
	this.cannon.bmSize=0;
	this.cannon.opacity=1;
	this.animate({"bmSize":1},{'dur':200});
	this.cannon.animate({"bmSize":1},{'dur':200});
	this.alive=true;
}

CannonBuilding.prototype.die=function() {
	this.animate({"bmSize":1.5,"opacity":0},{'dur':200});
	this.cannon.animate({"bmSize":1.5,"opacity":0},{'dur':200});
	this.cannon.alive=false;
	this.alive=false;
}

CannonBuilding.prototype.setCannon=function(alive) {
	this.cannon.alive=alive;

	if (this.cannon.alive==false) {
		if (this.cannon.dir>-Math.PI/2) {
			var deadDir=10/180*Math.PI;
		} else {
			var deadDir=-190/180*Math.PI;
		}
		this.cannon.animate({'dir':deadDir,'xOff':7},{'dur':200,'easing':'quadOut'});
	} else {
		this.cannon.animate({'xOff':0,bmSize:1,opacity:1},{dur:200});
	}
}