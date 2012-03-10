/*
UpgradeIcon:
A button for buying an upgrade

Requires:
	Sprite
	Mouse
*/

function UpgradeIcon(_upgradeType,_buttonType,_level,_depth,_x,_y,_animate) {
	// Extend Sprite
	this.buttonType=_buttonType!=undefined ? _buttonType : 0;
	this.upgradeType=_upgradeType?_upgradeType:false;
	this.level=_level!=undefined?_level:false;
	animate=_animate?_animate:0;

	// Use the right button background
	var spr
	switch (this.buttonType) {
		case 0:
		spr='0';
		this.name=this.upgradeType.name
		this.description=this.upgradeType.description;
		break;
		case 1:
		spr='1';
		this.name=this.upgradeType.upgrades[this.level-1].name
		this.description=this.upgradeType.upgrades[this.level-1].description;
		break;
		case 2:
		this.name=this.upgradeType.upgrades[this.level-1].name+" ("+this.upgradeType.upgrades[this.level-1].price+"$)";
		this.description=this.upgradeType.upgrades[this.level-1].description;
		if (player.points<this.upgradeType.upgrades[this.level-1].price) {
			this.name+=" - Insufficient funds";
			spr='2c';
		} else {
			spr='2a';
		}
		break;
		case 3:
		spr='3';
		this.name='Mysterious future upgrade';
		this.description='A description of this upgrade is not available yet.';
		break;
	}

	Sprite.call(this,'img/nonScalable/Upgrades/btn'+spr+'.png', _depth, _x, _y, 0);
	this.icon=new Sprite(pImg+'Upgrades/'+this.upgradeType.folder+'/'+this.level+(this.buttonType==3?2:1)+'.png', _depth, _x, _y, 0);

	this.update='onPaused';
	updateObjects[this.update][this.id]=this;
	
	this.remove = function() {
		purge(this);
		purge(this.icon)
	}

	this.update = function() {
		//Check for hover and click
		if (Math.abs(mouse.x-this.x)<36 && Math.abs(mouse.y-this.y)<36) {
			if (mouse.isPressed(1) && this.buttonType==2 && player.points>=this.upgradeType.upgrades[this.level-1].price) {
				player[this.upgradeType.lockVar]++;
				player.addPoints(-this.upgradeType.upgrades[this.level-1].price);

				upgradeMenu.makeUpgradeTree();
			}
			if (this.buttonType==2 && player.points>=this.upgradeType.upgrades[this.level-1].price) {
				this.bm=loader.images['img/nonScalable/Upgrades/btn2b.png'];
			}

			// Change menu text
			if (upgradeMenu.infoCurrent!=this.id) {
				upgradeMenu.infoCurrent=this.id;
				upgradeMenu.infoHeader.setString(this.name);
				upgradeMenu.infoText.setString(this.description);
			}
		} else {
			if (this.buttonType==2 && player.points>=this.upgradeType.upgrades[this.level-1].price) {
				this.bm=loader.images['img/nonScalable/Upgrades/btn2a.png'];
			}
			
			// Set infotext to default
			if (upgradeMenu.infoCurrent==this.id) {
				upgradeMenu.resetInfo();
			}
		}
	}

	if (animate) {
		this.bmSize=0;
		this.icon.bmSize=0;

		this.animate({bmSize:1},{dur:400});
		this.icon.animate({bmSize:1},{dur:400});
	}
}