/*
UpgradeIcon:
A button for buying an upgrade

Requires:
	Sprite
	Mouse
*/

ShopIcon = function (_type, _level, _x, _y, _toX, _toY) {
	if (_type === undefined || _level === undefined) {return; }

	// Extend view
	View.Container.call(this);

	this.type = _type;
	this.level = _level;
	this.alive = true;

	this.x = _x;
	this.y = _y;
	this.size = 0;
	this.opacity = 1;

	this.bg = new View.Sprite('Upgrades.btn1', _x, _y, 0, {size: this.size, opacity: this.opacity});
	this.icon = new View.Sprite('Upgrades.' + this.type.folder + '.l' + this.level + '1', _x, _y, 0, {size: this.size, opacity: this.opacity});

	this.addChildren(this.bg, this.icon);

	engine.currentRoom.loops.eachFrame.attachFunction(this, this.update);

	this.animate({size: 0.4}, {duration: 150, callback: function () {
		this.animate({x: _toX, y: _toY}, {duration: 200});
	}});
};

ShopIcon.prototype = Object.create(View.Container.prototype);
ShopIcon.prototype.import(Mixin.Animatable);

ShopIcon.prototype.update = function () {
	if (!this.alive) {return; }

	this.bg.x = this.x;
	this.bg.y = this.y;
	this.bg.opacity = this.opacity;
	this.bg.size = this.size;
	this.icon.x = this.x;
	this.icon.y = this.y;
	this.icon.opacity = this.opacity;
	this.icon.size = this.size;

	if (this.level !== 0) {
		this.bg.setSource('Upgrades.btn0');

		if (this.type.upgrades[this.level - 1].shopPrice * player.buildingEnhancementPriceFactor > player.points) {
			return;
		}

		switch (this.type.lockVar) {
		case 'weaponsAvailable':
			if (this.parent.building.gun && this.parent.building.gun.type === this.level) {
				return;
			}
			break;
		case 'shieldsAvailable':
			if (this.parent.building.shield.type === this.level && this.parent.building.shield.enabled) {
				return;
			}
			break;
		}
		this.bg.setSource('Upgrades.btn1');
	}

	// Check for click
	if (pointer.shapeIsPressed(MOUSE_TOUCH_ANY, new Math.Rectangle(this.x - 15, this.y - 15, 30, 30))) {
		if (this.level === 0) {
			this.parent.circleMenu(this.type);
		} else {
			if (this.type.folder === "Weapons") {
				player.weaponsBought ++;
			} else {
				player.shieldsBought ++;
			}

			this.type.upgrades[this.level - 1].onBought.call(this.parent.building);
			player.addPoints(-this.type.upgrades[this.level - 1].shopPrice * player.buildingEnhancementPriceFactor);

			pointer.unPress(MOUSE_TOUCH_ANY);

			this.parent.building.shop = false;
			this.parent.remove();
		}
	}
};
