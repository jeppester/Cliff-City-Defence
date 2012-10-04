/*
Building:
A building, one of the game's main elements.
Has methods for different upgrades and can be destroyed by falling rocks.

Requires:
	Sprite
	Animator
*/

jseCreateClass('Building');
jseExtend(Building, ObjectContainer);

Building.prototype.building = function (type, _x, _y, _dir) {
	if (type === undefined) {
		return false;
	}

	this.type = type;
	this.x = _x;
	this.y = _y;
	this.shop = false;

	switch (type) {
	case 1:
		this.spritePos = {
			'gunStand': {'x': - 13, 'y': - 28, 'dir': 0},
			'gun': {'x': - 13, 'y': - 40}
		};
		break;
	case 2:
		this.spritePos = {
			'gunStand': {'x': 2, 'y': - 42, 'dir': 0},
			'gun': {'x': 2, 'y': - 54}
		};
		break;
	case 3:
		this.spritePos = {
			'gunStand': {'x': - 4, 'y': - 36, 'dir': 0},
			'gun': {'x': - 4, 'y': - 47}
		};
		break;
	case 4:
		this.spritePos = {
			'gunStand': {'x': - 4, 'y': - 32, 'dir': 0},
			'gun': {'x': - 4, 'y': - 43}
		};
		break;
	case 5:
		this.spritePos = {
			'gunStand': {'x': - 20, 'y': - 30, 'dir': - Math.PI / 4},
			'gun': {'x': - 29, 'y': - 39}
		};
		break;
	case 6:
		this.spritePos = {
			'gunStand': {'x': 0, 'y': - 36, 'dir': 0},
			'gun': {'x': 0, 'y': - 48}
		};
		break;
	}

	// Prepare upgrade sprites
	this.gunStand = new Sprite('BuildingEnhancements.GunStand', this.x + this.spritePos.gunStand.x, this.y + this.spritePos.gunStand.y, this.spritePos.gunStand.dir, {opacity: 0});
	this.addChild(this.gunStand);
	this.gun = false;

	// Extend Sprite
	this.sprite = new Sprite('Buildings.Building' + this.type, this.x, this.y, _dir);
	this.addChild(this.sprite);

	// Prepare shield
	this.shield = new Shield(this.type, this.x, this.y);
	this.addChild(this.shield);
	this.gunType = 0;

	// Add to updated objects
	engine.addActivityToLoop(this, this.update, 'onRunning');
	engine.addActivityToLoop(this, this.cols, 'collisionChecking');

	this.life = 2;
};

Building.prototype.die = function (time) {
	if (this.life) {
		this.life = 0;
		time = time  ?  time : 200;
		this.sprite.animate({"bmSize": 1.5, "opacity": 0}, {'dur': time});

		// Remove upgrades
		this.gunStand.animate({"bmSize": 1.5, "opacity": 0}, {'dur': time});
		this.gunType = 0;
		if (this.gun) {
			this.gun.remove();
			delete this.gun;
		}

		return true;
	}
	return false;
};

Building.prototype.setLife = function (life) {
	if (this.life === life) {
		return;
	}

	if (this.life === 0) {
		this.sprite.bmSize = 0;
		this.sprite.opacity = 1;
	}

	switch (life) {
	case 0:
		this.die();
		return;
	case 1:
		this.sprite.setSource('Buildings.Building' + this.type + 'Damaged');
		break;
	case 2:
		this.sprite.setSource('Buildings.Building' + this.type);
		break;
	}

	this.sprite.animate({"bmSize": 1}, {'dur': 200});
	this.life = life;
};

// Upgrade functions
Building.prototype.setShield = function (type) {
	this.shield.set(type);
};

Building.prototype.setGun = function (type) {
	// If there is already a gun on the building, remove it
	if (this.gun) {
		this.gun.remove();
	}

	// Set the new gun type
	this.gunType = type;

	if (this.gunType === 0) {
		this.gunStand.animate({'opacity': 0}, {'dur': 200});
		if (this.gun) {
			delete this.gun;
		}
		return;
	}

	this.gun = new AiGun(type, this.x + this.spritePos.gun.x, this.y + this.spritePos.gun.y, this);
	this.addChild(this.gun);
	this.gunStand.bmSize = 1;
	this.gunStand.animate({'opacity': 1}, {'dur': 200});
};

Building.prototype.update = function () {
	// Use update to check for mouse clicks
	var cDist = this.sprite.bmWidth / 2,
		len,
		b;

	if (mouse.circleIsPressed(this.x, this.y, cDist) && this.life) {
		if (!this.shop) {
			len = stageController.buildings.length;

			while (len --) {
				b = stageController.buildings[len];
				if (b.shop) {
					b.shop.remove();
					b.shop = false;
				}
			}

			this.shop = new ShopCircle(this);
			engine.depth[8].addChild(this.shop);
		}
	}
};

Building.prototype.cols = function () {
	var rocks, i, cObj, cDist;

	// Check for collisions with rocks
	if (!this.life) {return; }

	rocks = engine.depth[5].getChildren();
	for (i = 0; i < rocks.length; i ++) {
		cObj = rocks[i];

		if (!cObj.alive) {continue; }

		cDist = this.sprite.bmWidth / 2 + cObj.bmWidth / 2;
		if (Math.sqrt(Math.pow(cObj.x - this.x, 2) + Math.pow(cObj.y - this.y, 2)) < cDist) {
			if (this.shield.enabled) {
				this.shield.life -= cObj.life;
				if (this.shield.life <= 0) {
					this.shield.disable();
				}
			} else {
				this.setLife(this.life - 1);
			}
			cObj.impacted = true;
			cObj.remove();
		}
	}
};