/*
Building:
A building, one of the game's main elements.
Has methods for different upgrades and can be destroyed by falling rocks.

Requires:
	Sprite
	Animator
*/

function Building(type,_depth,_x,_y,_dir) {
	if (type==undefined) {
		return false;
	}
	
	this.type=type;
	
	switch (type) {
	case 1:
		this.spritePos={
			'gunStand':{'x':-13,'y':-28,'dir':0},
			'gun':{'x':-13,'y':-40}
		};
	break;
	case 2:
		this.spritePos={
			'gunStand':{'x':2,'y':-42,'dir':0},
			'gun':{'x':2,'y':-54}
		};
	break;
	case 3:
		this.spritePos={
			'gunStand':{'x':-4,'y':-36,'dir':0},
			'gun':{'x':-4,'y':-47}
		};
	break;
	case 4:
		this.spritePos={
			'gunStand':{'x':-4,'y':-32,'dir':0},
			'gun':{'x':-4,'y':-43}
		};
	break;
	case 5:
		this.spritePos={
			'gunStand':{'x':-20,'y':-30,'dir':-45},
			'gun':{'x':-29,'y':-39}
		};
	break;
	case 6:
		this.spritePos={
			'gunStand':{'x':0,'y':-36,'dir':0},
			'gun':{'x':0,'y':-48}
		};
	break;
	}
	
	//Prepare upgrade sprites
	this.gunStand=new Sprite(pImg+'BuildingGunStand.png',_depth-1,_x+this.spritePos.gunStand.x,_y+this.spritePos.gunStand.y,this.spritePos.gunStand.dir,{opacity:0});
	this.gun=false;

	//Extend Sprite
	Sprite.call(this,pImg+'Building'+this.type+'.png',_depth,_x,_y,_dir);
	
	this.shield=new Shield(this.type,this.x,this.y);

	//Add to updated objects
	updateObjects.onRunning[this.id]=this;
	
	this.alive=true;
	this.die = function(time) {
		if (this.alive) {
			this.alive = false;
			time = time ? time : 200;
			this.animate({"bmSize":1.5,"opacity":0},{'dur':time});
			
			//Remove upgrades
			this.gunStand.animate({"bmSize":1.5,"opacity":0},{'dur':time});
			if (this.gun) {
				this.gun.remove();
			}
			if (this.shield) {
				this.shield.remove();
			}
			
			return true;
		}
		return false;
	}

	this.update=function() {
		//Use update to check for mouse clicks
		cDist=this.bmWidth/2;
		if (mouse.isPressed(1) && this.alive) {
			if (Math.sqrt(Math.pow(mouse.x-this.x,2)+Math.pow(mouse.y-this.y,2))<cDist) {
				if (typeof shopCircle!="undefined") {
					if (shopCircle.building!=this) {
						shopCircle.remove();
						shopCircle=new ShopCircle(this);
					}
				} else {
					shopCircle=new ShopCircle(this);
				}
			}
		}
	}
	
	this.remove=function() {
		purge(this.shield);
		purge(this.gunStand);
		purge(this.gun);
	}
	
	this.cols=function() {
		//Check for collisions with invaders
		if (!this.alive) {return;}
		
		for (var i in depth[5]) {
			cObj=depth[5][i];
			if (!cObj.alive) {continue;}
			cDist=this.bmWidth/2+cObj.bmWidth/2;
			if (Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist) {
				if (this.shield.enabled) {
					this.shield.life-=cObj.life;
					if (this.shield.life<=0) {
						this.shield.disable();
					}
				} else {
					this.die();
				}
				cObj.remove();
			}
		}
	}
	
	//Upgrade functions
	this.setShield=function(type) {
		this.shield.set(type);
	}
	
	this.shieldDisable=function() {
		this.shield.animate({'opacity':0,'bmSize':1.5},{'dur':200});
		this.currentShield=false;
	}
	
	this.setGun=function(type) {
		if (this.gun) {
			this.gun.remove();
		}
		this.gun=new AiGun(type,this.x+this.spritePos.gun.x,this.y+this.spritePos.gun.y);
		this.gunStand.animate({'opacity':1},{'dur':200});
	}
}
