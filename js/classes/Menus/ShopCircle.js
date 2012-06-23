function ShopCircle(building) {
	// Import classes
	importClass(this,ObjectContainer);

	// TODO: Make shopcircle for buying shielding and weapons when clicking on buildings
	this.building=building;
	this.x=building.x;
	this.y=building.y;

	//Add object in update array (for checking if the cursor is too far away from the menu)
	this.id="shopCircle";
	updateObjects.onRunning[this.id]=this;

	this.selectType=function() {
		this.removeChildren();
		
		if (player.shieldsAvailable>0) {
			if (player.weaponsAvailable>0) {
				this.addChild(new ShopIcon(game.upgradeTypes[1],0,this.x,this.y,this.x+15,this.y));
				this.addChild(new ShopIcon(game.upgradeTypes[0],0,this.x,this.y,this.x-15,this.y));
			} else {
				this.addChild(new ShopIcon(game.upgradeTypes[1],0,this.x,this.y,this.x,this.y));
			}
		} else {
			if (player.weaponsAvailable>0) {
				this.addChild(new ShopIcon(game.upgradeTypes[0],0,this.x,this.y,this.x,this.y));
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
		this.removeChildren();

		var u=upgradeType;

		//TODO: ShopIcon has to be beautified!
		switch (player[u.lockVar]) {
		case 4:
			this.addChild(new ShopIcon(u,4,this.x,this.y,this.x+15,this.y+15));
		case 3:
			this.addChild(new ShopIcon(u,1,this.x,this.y,this.x-15,this.y-15));
			this.addChild(new ShopIcon(u,2,this.x,this.y,this.x+15,this.y-15));
			this.addChild(new ShopIcon(u,3,this.x,this.y,this.x-15,this.y+15));
		break;
		case 2:
			this.addChild(new ShopIcon(u,1,this.x,this.y,this.x-15,this.y));
			this.addChild(new ShopIcon(u,2,this.x,this.y,this.x+15,this.y));
		break;
		case 1:
			this.addChild(new ShopIcon(u,1,this.x,this.y,this.x,this.y));
		break;
		}
	}

	// Start type selection menu
	this.selectType()
}

ShopCircle.prototype.remove=function() {
	this.removeChildren();
	purge(this);
	delete shopCircle;
}