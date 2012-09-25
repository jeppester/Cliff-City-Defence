jseCreateClass('ShopCircle');
jseExtend(ShopCircle, ObjectContainer);

ShopCircle.prototype.shopCircle = function (building) {
	this.building = building;
	this.x = building.x;
	this.y = building.y;

	// Add object in update array (for checking if the cursor is too far away from the menu)
	engine.registerObject(this);
	engine.addActivityToLoop(this, this.update, 'onRunning');

	// Start type selection menu
	this.selectType();
};

ShopCircle.prototype.selectType = function () {
	this.removeChildren();

	if (player.shieldsAvailable > 0) {
		if (player.weaponsAvailable > 0) {
			this.addChild(new ShopIcon(data.upgradeTypes[1], 0, this.x, this.y, this.x + 15, this.y));
			this.addChild(new ShopIcon(data.upgradeTypes[0], 0, this.x, this.y, this.x - 15, this.y));
		} else {
			this.addChild(new ShopIcon(data.upgradeTypes[1], 0, this.x, this.y, this.x, this.y));
		}
	} else {
		if (player.weaponsAvailable > 0) {
			this.addChild(new ShopIcon(data.upgradeTypes[0], 0, this.x, this.y, this.x, this.y));
		} else {
			this.building = false;
		}
	}
};

ShopCircle.prototype.update = function () {
	if (mouse.squareOutsideIsPressed(this.x - 30, this.y - 30, 60, 60)) {
		this.building.shop = false;
		this.remove();
	}
};

ShopCircle.prototype.circleMenu = function (upgradeType) {
	this.removeChildren();

	var u = upgradeType;

	switch (player[u.lockVar]) {
	case 4:
		this.addChild(new ShopIcon(u, 4, this.x, this.y, this.x + 15, this.y + 15));
	case 3:
		this.addChild(new ShopIcon(u, 1, this.x, this.y, this.x - 15, this.y - 15));
		this.addChild(new ShopIcon(u, 2, this.x, this.y, this.x + 15, this.y - 15));
		this.addChild(new ShopIcon(u, 3, this.x, this.y, this.x - 15, this.y + 15));
		break;
	case 2:
		this.addChild(new ShopIcon(u, 1, this.x, this.y, this.x - 15, this.y));
		this.addChild(new ShopIcon(u, 2, this.x, this.y, this.x + 15, this.y));
		break;
	case 1:
		this.addChild(new ShopIcon(u, 1, this.x, this.y, this.x, this.y));
		break;
	}
};