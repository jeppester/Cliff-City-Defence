/*
UpgradeIcon:
A button for buying an upgrade

Requires:
	Sprite
	Mouse
*/

// Constructor
UpgradeIcon = function (_upgradeType, _buttonType, _level, _x, _y, _animate) {
	var spr;
	this.buttonType = _buttonType !== undefined  ?  _buttonType : 0;
	this.upgradeType = _upgradeType ? _upgradeType: false;
	this.level = _level !== undefined ? _level: false;
	this.selected = false;
	animate = _animate ? _animate: false;

	// Use the right button background
	switch (this.buttonType) {
	case 0:
		spr = '0';
		this.name = this.upgradeType.name;
		this.description = this.upgradeType.description;
		break;
	case 1:
		spr = '2';
		this.name = this.upgradeType.upgrades[this.level - 1].name;
		this.description = this.upgradeType.upgrades[this.level - 1].description;
		break;
	case 2:
		this.name = this.upgradeType.upgrades[this.level - 1].name + " (" + this.upgradeType.upgrades[this.level - 1].price + "$)";
		this.description = this.upgradeType.upgrades[this.level - 1].description;
		if (player.points < this.upgradeType.upgrades[this.level - 1].price) {
			this.name += " - Insufficient funds";
			spr = '2b';
		} else {
			spr = '1b';
		}
		break;
	case 3:
		spr = '3';
		this.name = 'Mysterious future upgrade';
		this.description = 'A description of this upgrade is not available yet.';
		break;
	}

	View.Sprite.call(this, 'Upgrades.btn' + spr, _x, _y, 0);
	this.icon = new View.Sprite('Upgrades.' + this.upgradeType.folder + '.l' + this.level + (this.buttonType === 3 ? 2: 1), _x, _y, 0);
	this.addChildren(this.icon);

	engine.currentRoom.loops.onPaused.attachFunction(this, this.update);

	if (animate) {
		this.bmSize = 0;
		this.icon.bmSize = 0;

		this.animate({bmSize: 1}, {duration: 400});
		this.icon.animate({bmSize: 1}, {duration: 400});
	}
};

UpgradeIcon.prototype = Object.create(View.Sprite.prototype);

UpgradeIcon.prototype.select = function () {
	// Deselect all other buttons
	var i = this.parent.icons.length;
	while (i --) {
		this.parent.icons[i].deselect();
	}

	// Change the buttons background sprite
	if (player.points >= this.upgradeType.upgrades[this.level - 1].price) {
		this.setSource('Upgrades.btn1c');
		this.parent.btnBuy.enable();
	}
	else {
		this.setSource('Upgrades.btn2c');
		this.parent.btnBuy.disable();
	}
	this.parent.btnBuy.animate({opacity: 1}, {duration: 500});

	// Set upgrade menu info test
	this.parent.infoCurrent = this.id;
	this.parent.infoHeader.string = this.name;
	this.parent.infoText.string = this.description;
	this.parent.iconSelected = this;
	this.selected = true;
};

UpgradeIcon.prototype.deselect = function () {
	if (this.selected) {
		if (player.points >= this.upgradeType.upgrades[this.level - 1].price) {
			this.setSource('Upgrades.btn1b');
		}
		else {
			this.setSource('Upgrades.btn2b');
		}

		this.selected = false;
	}
};

UpgradeIcon.prototype.update = function () {
	if (this.buttonType === 2) {
		if (pointer.shapeIsPressed(MOUSE_TOUCH_ANY, new Math.Rectangle(this.x - 36, this.y - 36, 72, 72))) {
			// Change menu text
			this.select();
		}
	}
};
