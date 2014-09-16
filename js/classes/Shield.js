/*
Shield:
Building shield.

Requires;
    View.Sprite
    Animator
    Loader
*/

Shield = function (_building, _x, _y) {
	var _spr;
	if (_building === undefined || _x === undefined || _y === undefined) {
		throw new Error('Arguments: building, x or y missing');
	}
	this.enabled = false;
	this.type = 0;
	this.building = _building;

	// Extent sprite
	_spr = 'BuildingEnhancements.Building' + this.building + 'Shield1';
	View.Sprite.call(this, _spr, _x, _y, 0, {'size': 0});
	engine.currentRoom.loops.eachFrame.attachFunction(this, this.fade);
	this.fadeStart = Math.random() * Math.PI * 2;
	this.lastRepair = 0;
};

Shield.prototype = Object.create(View.Sprite.prototype);

// Function for fading the shield in and out based on how damaged it is
Shield.prototype.fade = function () {
	var damageFactor, time;

	if (this.enabled === false || this.life === this.maxLife) {
		return;
	}

	damageFactor = (this.life / this.maxLife);
	time = engine.currentRoom.loops.onRunning.time;

	this.opacity = 1 - (1 - damageFactor) * Math.cos(time / (100 + 400 * damageFactor) + this.fadeStart);

	if (player.shieldAutoRepair) {
		if (this.opacity >  0.9 && this.lastRepair + 20000 < time) {
			this.autoRepair();
		}
	}
};

Shield.prototype.autoRepair = function () {
	var time = engine.currentRoom.loops.onRunning.time,
		cross;

	this.lastRepair = time;
	this.fadeStart = time;
	this.life = Math.min(this.life + this.maxLife / 5, this.maxLife);

	cross = new View.Sprite('Upgrades.RedCross', this.x, this.y - 10, 0, {opacity: 0});
	main.depths[8].addChildren(cross);

	cross.animate({y: this.y - 60}, {duration: 3000});
	cross.animate({opacity: 1}, {duration: 1500, callback: function () {
		this.animate({opacity: 0}, {duration: 1500});
	}});
};

Shield.prototype.disable = function () {
	this.animate({size: 2, opacity: 0}, {duration: 300});
	this.enabled = false;
};

Shield.prototype.setLevel = function (type) {
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
			this.offset.x = 39;
			this.offset.y = 37;
			break;
		case 2:
			this.offset.x = 39;
			this.offset.y = 47;
			break;
		case 3:
			this.offset.x = 38;
			this.offset.y = 43;
			break;
		case 4:
			this.offset.x = 36;
			this.offset.y = 35;
			break;
		case 5:
			this.offset.x = 28;
			this.offset.y = 48;
			break;
		case 6:
			this.offset.x = 27;
			this.offset.y = 40;
			break;
		}
		break;
	case 2:
		this.life = 250;
		switch (this.building) {
		case 1:
			this.offset.x = 37;
			this.offset.y = 35;
			break;
		case 2:
			this.offset.x = 43;
			this.offset.y = 45;
			break;
		case 3:
			this.offset.x = 42;
			this.offset.y = 44;
			break;
		case 4:
			this.offset.x = 37;
			this.offset.y = 32;
			break;
		case 5:
			this.offset.x = 25;
			this.offset.y = 48;
			break;
		case 6:
			this.offset.x = 31;
			this.offset.y = 38;
			break;
		}
		break;
	case 4:
		this.life = 800;
	case 3:
		this.life = 500;
		switch (this.building) {
		case 1:
			this.offset.x = 32;
			this.offset.y = 35;
			break;
		case 2:
			this.offset.x = 38;
			this.offset.y = 45;
			break;
		case 3:
			this.offset.x = 35;
			this.offset.y = 34;
			break;
		case 4:
			this.offset.x = 37;
			this.offset.y = 34;
			break;
		case 5:
			this.offset.x = 22;
			this.offset.y = 46;
			break;
		case 6:
			this.offset.x = 24;
			this.offset.y = 35;
			break;
		}
		break;
	}

	this.maxLife = this.life;

	this.enabled = true;
	this.setSource('BuildingEnhancements.Building' + this.building + 'Shield' + this.type);
	this.size = 0;
	this.opacity = 1;
	this.animate({size: 1}, {duration: 300});
};
