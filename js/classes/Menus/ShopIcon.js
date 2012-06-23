/*
UpgradeIcon:
A button for buying an upgrade

Requires:
	Sprite
	Mouse
*/

function ShopIcon() {
	// Import sprite
	importClass(this,Sprite);

	constructIfNew(this,this.shopIcon,arguments);
}

ShopIcon.prototype.shopIcon=function(_type,_level,_x,_y,_toX,_toY) {
	// Extend Sprite
	this.sprite(pImg+'Upgrades/btn11c.png', 10, _x, _y, 0);

	if (_type==undefined || _level==undefined) {return;}
	this.type=_type;
	this.level=_level;
	this.alive=true;

	this.icon=new Sprite(pImg+'Upgrades/'+this.type.folder+'/'+this.level+'1.png', 10, _x, _y, 0);
	
	updateObjects.onRunning[this.id]=this;
	updateObjects.onPaused[this.id]=this;

	this.bmSize=0;
	this.icon.opacity=0;

	this.animate({bmSize:0.4},{dur:150,callback:function() {
		this.animate({x:_toX,y:_toY},{dur:200});
	}});
}

ShopIcon.prototype.remove = function() {
	this.alive=false;
	this.icon.animate({bmSize:0.0},{dur:150,callback:function() {
		purge(this);
	}});
	this.animate({bmSize:0.0},{dur:150,callback:function() {
		purge(this);
	}});
}

ShopIcon.prototype.update = function() {
	if (!this.alive){return;}

	this.icon.x=this.x;
	this.icon.y=this.y;
	this.icon.opacity=this.opacity;
	this.icon.bmSize=this.bmSize;
	if (this.level!=0) {
		if (this.type.upgrades[this.level-1].shopPrice>player.points) {return;}

		switch (this.type.lockVar) {
		case 'weaponsAvailable':
			if (shopCircle.building.gun) {
				if (shopCircle.building.gun.type==this.level) {
					return;
				}
			}
		break;
		case 'shieldsAvailable':
			if (shopCircle.building.shield.type==this.level && shopCircle.building.shield.enabled) {
				return;
			}
		break;
		}
	}

	//Check for hover and click
	if (Math.abs(mouse.x-this.x)<15 && Math.abs(mouse.y-this.y)<15) {
		if (mouse.isPressed(1)) {
			if (this.level==0) {
				shopCircle.circleMenu(this.type);
			} else {
				if (this.type.folder=="Weapons") {
					player.weaponsBought++;
				} else {
					player.shieldsBought++;
				}

				this.type.upgrades[this.level-1].onBought();
				player.addPoints(-this.type.upgrades[this.level-1].shopPrice);
				shopCircle.remove();
			}
		}
		this.bm=loader.images[pImg+'Upgrades/btn11b.png'];
	} else {
		this.bm=loader.images[pImg+'Upgrades/btn11.png'];
	}
}