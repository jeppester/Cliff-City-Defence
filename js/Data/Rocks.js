data.rocks = {
	// Orange rocks
	orange: {
		description: "A regular piece of orange cliff.",
		prefix: "Orange",
		onDestroy: function () {
			var i,
				speed,
				dir,
				dX,
				dY;

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
				life: 100,
				value: 400,
				gravity: 150,
				maxSpeed: 130
			},
			// Level 2
			{
				life: 350,
				value: 1600,
				gravity: 80,
				maxSpeed: 110
			},
			// Level 3
			{
				life: 550,
				value: 3200,
				gravity: 80,
				maxSpeed: 90
			}
		]
	},

	// Magnetic rocks
	magnetic: {
		description: "A solid and magnetic rock.",
		prefix: "Magnetic",
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
			// Only check every second frame
			if (engine.frames % 3) {return; }

			// Check for collisions
			if (!this.alive) {return; }

			var rockets = engine.depth[3].getChildren(),
				i,
				cObj,
				dist,
				dir,
				b,
				distDivider,
				acc;

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
				life: 150,
				value: 600,
				gravity: 200,
				maxSpeed: 120
			},
			// Level 2
			{
				life: 500,
				value: 2000,
				gravity: 100,
				maxSpeed: 100
			},
			// Level 3
			{
				life: 800,
				value: 4000,
				gravity: 100,
				maxSpeed: 80
			}
		]
	},

	// Fast rocks
	fast: {
		description: "A fast but not very solid rock.",
		prefix: "Fast",
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
				life: 70,
				value: 500,
				gravity: 200,
				maxSpeed: 200
			},
			// Level 2
			{
				life: 200,
				value: 1200,
				gravity: 200,
				maxSpeed: 150
			},
			// Level 3
			{
				life: 400,
				value: 3000,
				gravity: 200,
				maxSpeed: 130
			}
		]
	}
};