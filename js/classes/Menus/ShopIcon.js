/*
UpgradeIcon:
A button for buying an upgrade

Requires:
	Sprite
	Mouse
*/

jseCreateClass('ShopIcon');
jseExtend(ShopIcon, ObjectContainer);
jseExtend(ShopIcon, Animation);

ShopIcon.prototype.shopIcon = function (_type, _level, _x, _y, _toX, _toY) {
	if (_type === undefined || _level === undefined) {return; }
	this.type = _type;
	this.level = _level;
	this.alive = true;

	this.x = _x;
	this.y = _y;
	this.bmSize = 0;
	this.opacity = 1;

	this.bg = new Sprite('Upgrades.btn1', _x, _y, 0, {bmSize: this.bmSize, opacity: this.opacity});
	this.icon = new Sprite('Upgrades.' + this.type.folder + '.l' + this.level + '1', _x, _y, 0, {bmSize: this.bmSize, opacity: this.opacity});

	this.addChildren(this.bg, this.icon);

	engine.addActivityToLoop(this, this.update, 'eachFrame');

	this.animate({bmSize: 0.4}, {dur: 150, callback: function () {
		this.animate({x: _toX, y: _toY}, {dur: 200});
	}});
};

ShopIcon.prototype.update = function () {
	if (!this.alive) {return; }

	this.bg.x = this.x;
	this.bg.y = this.y;
	this.bg.opacity = this.opacity;
	this.bg.bmSize = this.bmSize;
	this.icon.x = this.x;
	this.icon.y = this.y;
	this.icon.opacity = this.opacity;
	this.icon.bmSize = this.bmSize;

	if (this.level !== 0) {
		if (this.type.upgrades[this.level - 1].shopPrice * player.buildingEnhancementPriceFactor > player.points) {
			this.bg.setSource('Upgrades.btn0');
			return;
		}
		this.bg.setSource('Upgrades.btn1');

		switch (this.type.lockVar) {
		case 'weaponsAvailable':
			if (this.parent.building.gun) {
				if (this.parent.building.gun.type === this.level) {
					return;
				}
			}
			break;
		case 'shieldsAvailable':
			if (this.parent.building.shield.type === this.level && this.parent.building.shield.enabled) {
				return;
			}
			break;
		}
	}

	// Check for click
	if (mouse.squareIsPressed(this.x - 15, this.y - 15, 30, 30)) {
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

			mouse.unPress(1);

			this.parent.building.shop = false;
			this.parent.remove();
		}
	}
};