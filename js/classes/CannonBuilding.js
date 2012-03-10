function CannonBuilding() {
	//Make cannon
	this.cannon=new Sprite(pImg+'Cannon.png',4,300,628,-90,{'xOff':0,'yOff':10});
	this.cannon.alive=true;

	//Extend Sprite
	Sprite.call(this,pImg+'RocketBuilding.png',4,315,660);
	
	//Add object in update array
	updateObjects.onRunning[this.id]=this;
	
	//Set object to alive
	this.alive=true;
	
	this.loadedAfter=0;
	
	this.update=function() {
		if (this.cannon.alive==false) {return;}

		var x=this.cannon.x;
		var y=this.cannon.y;
		var mDir=Math.atan2(mouse.y-y,mouse.x-x)/Math.PI*180;

		if (mDir>-10 || mDir<-170) {
			if (mDir>90 || mDir<-170) {
				mDir=-170;
			} else {
				mDir=-10;
			}
		}
		
		//Update cannon position
		this.cannon.dir=mDir;

		if (mouse.y>y) {return}

		if (mouse.isDown(1) && this.loadedAfter<=gameTime) {
			new Rocket(this.cannon.dir);
			
			this.loadedAfter=gameTime+500;
			this.cannon.xOff=5;
			this.cannon.animate({'xOff':0},{'dur':300})
		}
	}
	
	this.cols=function() {
		//Check for collisions with invaders
		if (!this.alive) {return;}
		
		for (var i in depth[5]) {
			cObj=depth[5][i];
			if (!cObj.alive) {continue;}
			cDist=this.bmWidth/2+cObj.bmWidth/2;
			if (Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist) {
				if (this.cannon.alive) {
					if (this.cannon.dir>-90) {
						var deadDir=10;
					} else {
						var deadDir=-190;
					}
					this.cannon.animate({'dir':deadDir,'xOff':7},{'dur':200,'easing':'quadOut'});
					this.cannon.alive=false;
				} else {
					this.animate({"bmSize":1.5,"opacity":0},{'dur':200});
					this.cannon.animate({"bmSize":1.5,"opacity":0},{'dur':200});
					this.alive=false;
				}
				cObj.remove();
			}
		}
	}
	
	this.remove = function(time) {
		purge(this.cannon);
		purge(this);
	}
}
