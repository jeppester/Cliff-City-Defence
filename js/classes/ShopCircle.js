function ShopCircle(building) {
	// TODO: Make shopcircle for buying shielding and weapons when clicking on buildings
	this.building=building;
	this.x=building.x;
	this.y=building.y;

	this.btns=new Array();

	//Add object in update array (for checking if the cursor is too far away from the menu)
	updateObjects.onRunning[this.id]=this;

	this.selectType=function() {
		this.clearButtons();
		
		if (player.shieldsAvailable>0) {
			if (player.weaponsAvailable>0) {
				this.btns.push(new ShopIcon(game.upgradeTypes[1],0,this.x,this.y,this.x+15,this.y));
				this.btns.push(new ShopIcon(game.upgradeTypes[0],0,this.x,this.y,this.x-15,this.y));
			} else {
				this.btns.push(new ShopIcon(game.upgradeTypes[1],0,this.x,this.y,this.x,this.y));
			}
		} else {
			if (player.weaponsAvailable>0) {
				this.btns.push(new ShopIcon(game.upgradeTypes[0],0,this.x,this.y,this.x,this.y));
			} else {
				this.building=false;
			}
		}
	}

	this.update=function() {
		cursorDist=Math.sqrt(Math.pow(mouse.x-this.x,2)+Math.pow(mouse.y-this.y,2));

		if (cursorDist>Math.max(this.building.bmWidth,this.building.bmHeight)+10) {
			this.remove();
		}
	}

	this.circleMenu=function(upgradeType) {
		this.clearButtons();
		var u=upgradeType;

		//TODO: ShopIcon has to be beautified!
		switch (player[u.lockVar]) {
		case 4:
			this.btns.push(new ShopIcon(u,4,this.x,this.y,this.x+15,this.y+15));
		case 3:
			this.btns.push(new ShopIcon(u,1,this.x,this.y,this.x-15,this.y-15));
			this.btns.push(new ShopIcon(u,2,this.x,this.y,this.x+15,this.y-15));
			this.btns.push(new ShopIcon(u,3,this.x,this.y,this.x-15,this.y+15));
		break;
		case 2:
			this.btns.push(new ShopIcon(u,1,this.x,this.y,this.x-15,this.y));
			this.btns.push(new ShopIcon(u,2,this.x,this.y,this.x+15,this.y));
		break;
		case 1:
			this.btns.push(new ShopIcon(u,1,this.x,this.y,this.x,this.y));
		break;
		}
	}

	this.clearButtons=function() {
		while (this.btns.length>0) {
			this.btns[0].remove();
			this.btns.splice(0,1);
		}
	}

	this.remove=function() {
		this.clearButtons();
		delete shopCircle;
	}

	// Start type selection menu
	this.selectType()
}