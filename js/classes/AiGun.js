/*
AiGun:
An automatic gun.

Requires:
    Sprite
    Animator
    Loader
*/

function AiGun() {
	// Import Sprite
	importClass(this,Sprite);

	constructIfNew(this,this.aiGun,arguments);
}

AiGun.prototype.aiGun=function(_type, _x, _y, _parent) {
	if (_type===undefined || _x===undefined || _y===undefined || _parent===undefined) {
		return false;
	}
	this.type=_type;
	this.parent=_parent;
	
	// Set gun offset
	switch (this.type) {
	case 1:
		_offset={'xOff':10,'yOff':5.5};
		this.rotSpeed=4 /180*Math.PI;
		this.loadTime=500;
		this.range=400;
		this.spread=8 /180*Math.PI;
	break;
	case 2:
		_offset={'xOff':10,'yOff':9};
		this.rotSpeed=6 /180*Math.PI;
		this.loadTime=75;
		this.range=300;
		this.spread=20 /180*Math.PI;
	break;
	case 3:
		_offset={'xOff':10,'yOff':9};
		this.rotSpeed=5 /180*Math.PI;
		this.loadTime=700;
		this.range=400;
		this.spread=10 /180*Math.PI;
	break;
	case 4:
		_offset={'xOff':8,'yOff':6};
		this.rotSpeed=4 /180*Math.PI;
		this.loadTime=1000;
		this.range=400;
		this.spread=0;
	break;
	}
	
	// Extent sprite
	this.sprite(pImg+'BuildingGun'+this.type+'.png', 4, _x, _y, -45-Math.random()*90,_offset);

	// Add object in update array
	updateObjects['onRunning'][this.id]=this;

	// Set object vars
	this.alive = true;
	this.loadedAfter=0;
	
	// AI
	this.targetId=false;

	return this;
}

AiGun.prototype.update = function() {
	if (!this.alive) {return;}
	
	// If the gun does not have a target, find the closest target
	// (Another way to find a target could be finding the target that requires less gunrotation)
	if (!updateObjects.onRunning[this.targetId]) {
		var cDist=this.range;
		for (var i in depth[5]) {
			var cObj=depth[5][i];
			
			var cObjDist=Math.min(cDist,Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2)))
			if (cObjDist<cDist) {
				cDist=cObjDist;
				this.targetId=cObj.id;
			}
		}
	}
	
	if (updateObjects.onRunning[this.targetId]) {
		var t=updateObjects.onRunning[this.targetId];
		
		// Rotate towards the target
		// Find the direction to target relative to the guns rotation
		var tDir=Math.atan2(t.y-this.y,t.x-this.x);
		var relDir=tDir-this.dir+2*Math.PI;
		
		while (relDir>Math.PI) {
			relDir-=Math.PI*2;
		}
		
		if (relDir>0) {
			this.dir+=Math.min(relDir,this.rotSpeed);
		} else {
			this.dir+=Math.max(relDir,-this.rotSpeed);
		}
		
		if (gameTime>this.loadedAfter) {
			if (Math.abs(relDir)<this.rotSpeed) {
				// All guns, except the laser, fires a bullet.
				if (this.type<4) {
					// Fire the gun's ammunition type
					new GunShot(this.type,this.dir-this.spread/2+Math.random()*this.spread,this.x,this.y,updateObjects.onRunning[this.targetId]);
				} else {
					// The laser gun has a special shot that hits instantly

					// Make laser beam on rock
					var lx=t.x+0*Math.cos(tDir+Math.PI);
					var ly=t.y+0*Math.sin(tDir+Math.PI);
					var beam=new Sprite(pImg+'GunShot4.png',6,lx,ly,0,{"opacity":0,"bmSize":1.5});
					beam.animate({"opacity":1},{'dur':200,easing:'quadIn',callback:function() {
						this.animate({"bmSize":0,"opacity":0},{"dur":400,easing:'quadOut',callback:function() {
							this.remove();
						}})
					}})
					
					// Make laser beam on canon
					var lx=this.x+24*Math.cos(tDir);
					var ly=this.y+24*Math.sin(tDir);
					var beam=new Sprite(pImg+'GunShot4.png',10,lx,ly,0,{"opacity":0,"bmSize":0});
					beam.animate({"bmSize":0.5,"opacity":1},{'dur':100,easing:'quadIn',callback:function() {
						this.animate({"bmSize":0,"opacity":0},{"dur":100,easing:'quadOut',callback:function() {
							this.remove();
						}})
					}})
					
					// Do damage
					t.damage(1000);
				}
				this.loadedAfter=gameTime+this.loadTime;
			}
		}
	}
}

AiGun.prototype.remove = function(time) {
	if (this.alive) {
		this.alive = false;
		time = time ? time : 200;
		this.parent.shieldType=0;
		this.animate({"bmSize":0},{'dur':time,callback:"purge(depth["+this.depth+"]['"+this.id+"'])",'layer':1});
		return true;
	}
	return false;
}

AiGun.prototype.cols=function() {
	// Check for collisions with rocks
	if (!this.alive) {return;}
	
	for (var i in depth[5]) {
		var cObj=depth[5][i];
		if (!cObj.alive) {continue;}
		cDist=this.bmWidth/2+cObj.bmWidth/2;
		if (Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist) {
			this.remove();
			cObj.remove();
			break;
		}
	}
}