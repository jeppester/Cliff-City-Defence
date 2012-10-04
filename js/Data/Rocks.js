if (window.data === undefined) {window.data = {}; }
data.rocks = {
	// Orange rocks
	orange: {
		description: "A regular piece of orange cliff.",
		onDestroy: function () {
			var i, speed, dir, dX, dY;

			for (i = 0;i < 5;i ++) {
				speed = 100 + Math.random() * 100;
				dir = Math.random() * 2 * Math.PI;
				dX = Math.cos(dir) * speed;
				dY = Math.sin(dir) * speed;

				engine.depth[2].addChild(
					new Particle('Particles.OrangeFracture', this.x, this.y, dir, 300 + Math.random() * 300, {dX: dX, dY: dY})
				);
			}
		},
		levels: [
			// Level 1
			{
				sprite: "Rocks.Orange1",
				damageSprite: "Rocks.Orange1Cracks",
				life: 100,
				value: 400,
				gravity: 150,
				maxSpeed: 130
			},
			// Level 2
			{
				sprite: "Rocks.Orange2",
				damageSprite: "Rocks.Orange2Cracks",
				life: 350,
				value: 1600,
				gravity: 80,
				maxSpeed: 110,
				onDamaged: function (damagedBy, damage) {
					if (this.life > 0) {
						if (Rocket.prototype.isPrototypeOf(damagedBy)) {
							if (damage !== damagedBy.dmg) {return; }
						}
						else {
							if (damagedBy.type < 3 || damage !== damagedBy.bulletDamage) {
								return;
							}
						}
					}

					// If damaged by a rocket, spawn a level 1 rock
					stageController.scheduleTask(function() {
						engine.depth[5].insertBefore(
							new Rock(this.x, this.y, this.type, this.level - 1, - Math.random() * Math.PI, 5000 * engine.loopSpeed / 1000),
						this);
					}, 1, 'onRunning', undefined, this);
				}
			},
			// Level 3
			{
				sprite: "Rocks.Orange3",
				damageSprite: "Rocks.Orange3Cracks",
				life: 550,
				value: 3200,
				gravity: 80,
				maxSpeed: 90,
				onDamaged: function (damagedBy, damage) {
					if (this.life > 0) {
						if (Rocket.prototype.isPrototypeOf(damagedBy)) {
							if (damage !== damagedBy.dmg) {return; }
						}
						else {
							if (damagedBy.type < 3 || damage !== damagedBy.bulletDamage) {
								return;
							}
						}
					}

					// If damaged by a rocket, spawn a level 1 rock
					stageController.scheduleTask(function() {
						engine.depth[5].insertBefore(
							new Rock(this.x, this.y, this.type, this.level - 1, - Math.random() * Math.PI, 5000 * engine.loopSpeed / 1000),
						this);
					}, 1, 'onRunning', undefined, this);
				}
			}
		]
	},

	// Magnetic rocks
	magnetic: {
		description: "A solid and magnetic rock.",
		onDestroy: function () {
			var i,
				speed,
				dir,
				dX,
				dY;

			for (i = 0;i < 5;i ++) {
				speed = 100 + Math.random() * 100,
				dir = Math.random() * 2 * Math.PI,
				dX = Math.cos(dir) * speed,
				dY = Math.sin(dir) * speed;

				engine.depth[4].addChild(
					new Particle('Particles.MagneticFracture', this.x, this.y, dir, 300 + Math.random() * 300, {dX: dX, dY: dY})
				);
			}
		},
		onStep: function () {
			var rockets, i, cObj, dist, dir, b, distDivider, acc;

			// Only check every second frame
			if (engine.frames % 3) {return; }

			// Check for collisions
			if (!this.alive) {return; }

			rockets = engine.depth[3].getChildren();
			for (i = 0; i < rockets.length; i ++) {
				cObj = rockets[i];

				if (!cObj.alive) {continue; }

				dist = Math.sqrt(Math.pow(cObj.x - this.x, 2) + Math.pow(cObj.y - this.y, 2));
				dir = Math.atan2(this.y - cObj.y, this.x - cObj.x);

				b = 0.9;
				distDivider = 5 - this.maxLife / 180;
				acc = 100 * Math.pow(b, dist / distDivider);

				this.dX += Math.cos(dir) * acc;
				this.dY += Math.sin(dir) * acc;
			}
		},
		levels: [
			// Level 1
			{
				sprite: 'Rocks.Magnetic1',
				damageSprite: 'Rocks.Magnetic1Cracks',
				life: 150,
				value: 600,
				gravity: 200,
				maxSpeed: 120
			},
			// Level 2
			{
				sprite: 'Rocks.Magnetic2',
				damageSprite: 'Rocks.Magnetic2Cracks',
				life: 500,
				value: 2000,
				gravity: 100,
				maxSpeed: 100,
				onDamaged: function (damagedBy, damage) {
					if (this.life > 0) {
						if (Rocket.prototype.isPrototypeOf(damagedBy)) {
							if (damage !== damagedBy.dmg) {return; }
						}
						else {
							if (damagedBy.type < 3 || damage !== damagedBy.bulletDamage) {
								return;
							}
						}
					}

					// If damaged by a rocket, spawn a level 1 rock
					stageController.scheduleTask(function() {
						engine.depth[5].insertBefore(
							new Rock(this.x, this.y, this.type, this.level - 1, - Math.random() * Math.PI, 5000 * engine.loopSpeed / 1000),
						this);
					}, 1, 'onRunning', undefined, this);
				}
			},
			// Level 3
			{
				sprite: 'Rocks.Magnetic3',
				damageSprite: 'Rocks.Magnetic3Cracks',
				life: 800,
				value: 4000,
				gravity: 100,
				maxSpeed: 80,
				onDamaged: function (damagedBy, damage) {
					if (this.life > 0) {
						if (Rocket.prototype.isPrototypeOf(damagedBy)) {
							if (damage !== damagedBy.dmg) {return; }
						}
						else {
							if (damagedBy.type < 3 || damage !== damagedBy.bulletDamage) {
								return;
							}
						}
					}

					// If damaged by a rocket, spawn a level 1 rock
					stageController.scheduleTask(function() {
						engine.depth[5].insertBefore(
							new Rock(this.x, this.y, this.type, this.level - 1, - Math.random() * Math.PI, 5000 * engine.loopSpeed / 1000),
						this);
					}, 1, 'onRunning', undefined, this);
				}
			}
		]
	},

	// Fast rocks
	fast: {
		description: "A fast but not very solid rock.",
		onDestroy: function () {
			var i,
				speed,
				dir,
				dX,
				dY;

			for (i = 0; i < 5; i ++) {
				speed = 100 + Math.random() * 100;
				dir = Math.random() * 2 * Math.PI;
				dX = Math.cos(dir) * speed;
				dY = Math.sin(dir) * speed;
				engine.depth[3].addChild(
					new Particle('Particles.OrangeFracture', this.x, this.y, dir, 300 + Math.random() * 300, {dX: dX, dY: dY})
				);
			}
		},
		levels: [
			// Level 1
			{
				sprite: 'Rocks.Fast1',
				damageSprite: 'Rocks.Fast1Cracks',
				life: 70,
				value: 500,
				gravity: 200,
				maxSpeed: 200
			},
			// Level 2
			{
				sprite: 'Rocks.Fast2',
				damageSprite: 'Rocks.Fast2Cracks',
				life: 200,
				value: 1200,
				gravity: 200,
				maxSpeed: 150,
				onDamaged: function (damagedBy, damage) {
					if (this.life > 0) {
						if (Rocket.prototype.isPrototypeOf(damagedBy)) {
							if (damage !== damagedBy.dmg) {return; }
						}
						else {
							if (damagedBy.type < 3 || damage !== damagedBy.bulletDamage) {
								return;
							}
						}
					}

					// If damaged by a rocket, spawn a level 1 rock
					stageController.scheduleTask(function() {
						engine.depth[5].insertBefore(
							new Rock(this.x, this.y, this.type, this.level - 1, - Math.random() * Math.PI, 5000 * engine.loopSpeed / 1000),
						this);
					}, 1, 'onRunning', undefined, this);
				}
			},
			// Level 3
			{
				sprite: 'Rocks.Fast3',
				damageSprite: 'Rocks.Fast3Cracks',
				life: 400,
				value: 3000,
				gravity: 200,
				maxSpeed: 130,
				onDamaged: function (damagedBy, damage) {
					if (this.life > 0) {
						if (Rocket.prototype.isPrototypeOf(damagedBy)) {
							if (damage !== damagedBy.dmg) {return; }
						}
						else {
							if (damagedBy.type < 3 || damage !== damagedBy.bulletDamage) {
								return;
							}
						}
					}

					// If damaged by a rocket, spawn a level 1 rock
					stageController.scheduleTask(function() {
						engine.depth[5].insertBefore(
							new Rock(this.x, this.y, this.type, this.level - 1, - Math.random() * Math.PI, 5000 * engine.loopSpeed / 1000),
						this);
					}, 1, 'onRunning', undefined, this);
				}
			}
		]
	}
};