ShopCircle = function (building) {
	// Extend view
	View.Container.call(this);

	this.building = building;
	this.x = building.x;
	this.y = building.y;

	// Add object in update array
	engine.registerObject(this);
	engine.currentRoom.loops.onRunning.attachFunction(this, this.update);

	// Start type selection menu
	this.selectType();
};

ShopCircle.prototype = Object.create(View.Container.prototype);

ShopCircle.prototype.selectType = function () {
	this.removeAllChildren();

	if (player.shieldsAvailable > 0) {
		if (player.weaponsAvailable > 0) {
			this.addChildren(new ShopIcon(data.upgradeTypes[1], 0, 0, 0, 15, 0));
			this.addChildren(new ShopIcon(data.upgradeTypes[0], 0, 0, 0, -15, 0));
		} else {
			this.addChildren(new ShopIcon(data.upgradeTypes[1], 0, 0, 0, 0, 0));
		}
	} else {
		if (player.weaponsAvailable > 0) {
			this.addChildren(new ShopIcon(data.upgradeTypes[0], 0, 0, 0, 0, 0));
		} else {
			this.building = false;
		}
	}
};

ShopCircle.prototype.update = function () {
	if (pointer.shapeIsPressed(MOUSE_TOUCH_ANY, new Math.Rectangle(this.x - 30, this.y - 30, 60, 60), true)) {
		this.building.shop = false;
		engine.purge(this);
	}
};

ShopCircle.prototype.circleMenu = function (upgradeType) {
	var u;

	this.removeAllChildren();

	u = upgradeType;

	switch (player[u.lockVar]) {
	case 4:
		this.addChildren(new ShopIcon(u, 4, 0, 0, 15, 15));
	case 3:
		this.addChildren(new ShopIcon(u, 1, 0, 0, -15, -15));
		this.addChildren(new ShopIcon(u, 2, 0, 0, 15, -15));
		this.addChildren(new ShopIcon(u, 3, 0, 0, -15, 15));
		break;
	case 2:
		this.addChildren(new ShopIcon(u, 1, 0, 0, -15, 0));
		this.addChildren(new ShopIcon(u, 2, 0, 0, 15, 0));
		break;
	case 1:
		this.addChildren(new ShopIcon(u, 1, this.x, this.y, this.x, this.y));
		break;
	}
};
