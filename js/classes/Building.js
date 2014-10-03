/*
Building:
A building, one of the game's main elements.
Has methods for different upgrades and can be destroyed by falling rocks.

Requires:
	Sprite
	Animator
*/

Building = function (type, _x, _y, _dir) {
	// extend view
	View.Container.call(this);

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
	this.gunStand = new View.Sprite('BuildingEnhancements.GunStand', this.spritePos.gunStand.x, this.spritePos.gunStand.y, this.spritePos.gunStand.direction, {opacity: 0});
	this.gun = false;

	// Extend View.Sprite
	this.sprite = new View.GameObject('Buildings.Building' + this.type, 0, 0, _dir);

	// Prepare shield
	this.shield = new Shield(this.type, this.x, this.y);
	this.gunType = 0;

	this.addChildren(this.gunStand, this.sprite, this.shield);

	// Add to updated objects
	engine.currentRoom.loops.onRunning.attachFunction(this, this.update);
	engine.currentRoom.loops.collisionChecking.attachFunction(this, this.cols);

	this.life = 2;
};

Building.prototype = Object.create(View.Container.prototype);

Building.prototype.die = function (time) {
	if (this.life) {
		this.life = 0;
		time = time  ?  time : 200;
		this.sprite.animate({"size": 1.5, "opacity": 0}, {duration: time});

		// Remove upgrades
		this.gunStand.animate({"size": 1.5, "opacity": 0}, {duration: time});
		this.gunType = 0;
		if (this.gun) {
			engine.purge(this.gun);
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
		this.sprite.size = 0;
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

	this.sprite.animate({"size": 1}, {duration: 200});
	this.life = life;
};

// Upgrade functions
Building.prototype.setShield = function (type) {
	this.shield.setLevel(type);
};

Building.prototype.setGun = function (type) {
	// If there is already a gun on the building, remove it
	if (this.gun) {
		engine.purge(this.gun);
	}

	// Set the new gun type
	this.gunType = type;

	if (this.gunType === 0) {
		this.gunStand.animate({'opacity': 0}, {duration: 200});
		if (this.gun) {
			delete this.gun;
		}
		return;
	}

	this.gun = new AiGun(type, this.x + this.spritePos.gun.x, this.y + this.spritePos.gun.y, this);
	this.addChildren(this.gun);
	this.gunStand.size = 1;
	this.gunStand.animate({'opacity': 1}, {duration: 200});
};

Building.prototype.update = function () {
	// Use update to check for mouse clicks
	var width = this.sprite.bm.width,
		height = this.sprite.bm.height,
		len,
		b;

	if (pointer.shapeIsPressed(MOUSE_TOUCH_ANY, new Math.Rectangle(this.x - width / 2, this.y - height / 2, width, height)) && this.life) {
		if (!this.shop) {
			len = stageController.buildings.length;

			while (len --) {
				b = stageController.buildings[len];
				if (b.shop) {
					engine.purge(b.shop);
					b.shop = false;
				}
			}

			this.shop = new ShopCircle(this);
			main.depths[8].addChildren(this.shop);
		}
	}
};

Building.prototype.cols = function () {
	var rocks, i, cObj;

	// Check for collisions with rocks
	if (!this.life) {return; }

	rocks = main.depths[5].getChildren();

	for (i = 0; i < rocks.length; i ++) {
		cObj = rocks[i];
		if (!cObj.alive) {continue; }

		if (this.sprite.collidesWith(cObj)) {
			if (this.shield.enabled) {
				this.shield.life -= cObj.life;
				if (this.shield.life <= 0) {
					this.shield.disable();
				}
			} else {
				this.setLife(this.life - 1);
			}
			cObj.impacted = true;
			engine.purge(cObj);
		}
	}
};
