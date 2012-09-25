/*
Shield:
Building shield.

Requires;
    Sprite
    Animator
    Loader
*/

jseCreateClass('Shield');
jseExtend(Shield, Sprite);

Shield.prototype.shield = function (_building, _x, _y) {
	if (_building === undefined || _x === undefined || _y === undefined) {
		throw new Error('Arguments: building, x or y missing');
	}
	this.enabled = false;
	this.type = 0;
	this.building = _building;

	// Extent sprite
	var _spr = 'BuildingEnhancements.Building' + this.building + 'Shield1';
	this.sprite(_spr, _x, _y, 0, {'bmSize': 0});
	engine.addActivityToLoop(this, this.fade, 'eachFrame');
	this.fadeStart = Math.random() * Math.PI * 2;
	this.lastRepair = 0;
};

// Function for fading the shield in and out based on how damaged it is
Shield.prototype.fade = function () {
	if (this.enabled === false || this.life === this.maxLife) {
		return;
	}
	var damageFactor = (this.life / this.maxLife),
		time = engine.loops.onRunning.time;

	this.opacity = 1 - (1 - damageFactor) * Math.cos(time / (100 + 400 * damageFactor) + this.fadeStart);

	if (player.shieldAutoRepair) {
		if (this.opacity >  0.9 && this.lastRepair + 20000 < time) {
			this.autoRepair();
		}
	}
};

Shield.prototype.autoRepair = function () {
	var time = engine.loops.onRunning.time,
		cross;

	this.lastRepair = time;
	this.fadeStart = time;
	this.life = Math.min(this.life + this.maxLife / 5, this.maxLife);

	cross = new Sprite('Upgrades.RedCross', this.x, this.y - 10, 0, {opacity: 0});
	engine.depth[8].addChild(cross);

	cross.animate({y: this.y - 60}, {dur: 3000});
	cross.animate({opacity: 1}, {dur: 1500, callback: function () {
		this.animate({opacity: 0}, {dur: 1500});
	}});
};

Shield.prototype.disable = function () {
	this.animate({bmSize: 2, opacity: 0}, {dur: 300});
	this.enabled = false;
};

Shield.prototype.set = function (type) {
	this.type = type;

	if (this.type === 0) {
		this.disable();
		return;
	}

	// Set shield offset
	switch (this.type) {
	case 1:
		this.life = 100;
		switch (this.building) {
		case 1:
			this.xOff = 39;
			this.yOff = 37;
			break;
		case 2:
			this.xOff = 39;
			this.yOff = 47;
			break;
		case 3:
			this.xOff = 38;
			this.yOff = 43;
			break;
		case 4:
			this.xOff = 36;
			this.yOff = 35;
			break;
		case 5:
			this.xOff = 28;
			this.yOff = 48;
			break;
		case 6:
			this.xOff = 27;
			this.yOff = 40;
			break;
		}
		break;
	case 2:
		this.life = 250;
		switch (this.building) {
		case 1:
			this.xOff = 37;
			this.yOff = 35;
			break;
		case 2:
			this.xOff = 43;
			this.yOff = 45;
			break;
		case 3:
			this.xOff = 42;
			this.yOff = 44;
			break;
		case 4:
			this.xOff = 37;
			this.yOff = 32;
			break;
		case 5:
			this.xOff = 25;
			this.yOff = 48;
			break;
		case 6:
			this.xOff = 31;
			this.yOff = 38;
			break;
		}
		break;
	case 4:
		this.life = 800;
	case 3:
		this.life = 500;
		switch (this.building) {
		case 1:
			this.xOff = 32;
			this.yOff = 35;
			break;
		case 2:
			this.xOff = 38;
			this.yOff = 45;
			break;
		case 3:
			this.xOff = 35;
			this.yOff = 34;
			break;
		case 4:
			this.xOff = 37;
			this.yOff = 34;
			break;
		case 5:
			this.xOff = 22;
			this.yOff = 46;
			break;
		case 6:
			this.xOff = 24;
			this.yOff = 35;
			break;
		}
		break;
	}

	this.maxLife = this.life;

	this.enabled = true;
	this.setSource('BuildingEnhancements.Building' + this.building + 'Shield' + this.type);
	this.bmWidth = this.bm.width;
	this.bmHeight = this.bm.height;
	this.bmSize = 0;
	this.opacity = 1;
	this.animate({bmSize: 1}, {dur: 300});
};