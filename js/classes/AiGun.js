/*
AiGun:
An automatic gun.

Requires:
    Sprite
    Animator
    Loader
*/

jseCreateClass('AiGun');
jseExtend(AiGun, Sprite);

AiGun.prototype.aiGun = function (_type, _x, _y, _parent) {
	var _offSet;
	if (_type === undefined || _x === undefined || _y === undefined || _parent === undefined) {
		return false;
	}
	
	this.type = _type;
	this.parent = _parent;
	this.bulletBmSource = 'Projectiles.GunShot' + this.type;
	this.level = 0;
	this.kills = 0;

	// Set gun offset
	switch (this.type) {
	case 1:
		_offset = {'xOff': 10, 'yOff': 5.5};
		this.rotSpeed = 4 / 180 * Math.PI;
		this.loadTime = 500;
		this.range = 400;
		this.spread = 8 / 180 * Math.PI;

		this.bulletDamage = 50;
		this.bulletBlastRange = 0;
		this.bulletSpeed = 700;
		break;
	case 2:
		_offset = {'xOff': 10, 'yOff': 9};
		this.rotSpeed = 6 / 180 * Math.PI;
		this.loadTime = 75;
		this.range = 300;
		this.spread = 20 / 180 * Math.PI;

		this.bulletDamage = 20;
		this.bulletBlastRange = 0;
		this.bulletSpeed = 600;
		break;
	case 3:
		_offset = {'xOff': 10, 'yOff': 9};
		this.rotSpeed = 5 / 180 * Math.PI;
		this.loadTime = 700;
		this.range = 400;
		this.spread = 10 / 180 * Math.PI;

		this.bulletDamage = 150;
		this.bulletBlastRange = 75;
		this.bulletSpeed = 400;
		break;
	case 4:
		_offset = {'xOff': 8, 'yOff': 6};
		this.rotSpeed = 4 / 180 * Math.PI;
		this.loadTime = 1200;
		this.range = 400;
		this.spread = 0;

		this.bulletDamage = 350;
		this.bulletBlastRange = 0;
		this.bulletSpeed = 0;
		break;
	}

	// Extent sprite
	this.sprite('BuildingEnhancements.Gun' + this.type, _x, _y, -Math.random() * Math.PI, _offset);

	// Add object in update array
	engine.addActivityToLoop(this, this.update, 'onRunning');
	engine.addActivityToLoop(this, this.cols, 'collisionChecking');

	// Set object vars
	this.alive = true;
	this.loadedAfter = 0;

	// AI
	this.targetId = false;

	this.addLevel(player.aiGunInitialLevel);

	return this;
};

AiGun.prototype.addKill = function () {
	this.kills ++;

	switch (this.level) {
	case 0:
		this.addLevel(this.kills === 5);
		break;
	case 1:
		this.addLevel(this.kills === 9);
		break;
	case 2:
		this.addLevel(this.kills === 16);
		break;
	}
};

AiGun.prototype.addLevel = function (levels) {
	if (!levels) {return; }

	this.level += levels;
	this.kills = 0;

	if (this.levelStar) {
		this.levelStar.animate({opacity: 0, bmSize: 0, dir: Math.PI}, {dur: 1000, callback: function () {
			this.remove();
		}});
	}

	this.levelStar = new Sprite('Upgrades.Star' + this.level, this.x + 12, this.y + 12, 0, {opacity: 0, dir: - Math.PI, bmSize: 20});
	this.addChild(this.levelStar);
	this.levelStar.animate({bmSize: 1, opacity: 1, dir: 0}, {dur: 1000});
};

AiGun.prototype.findTarget = function (compareBy, ignoreList) {
	/*  compareBy is used to determine how the target should be compared
		0: Distance
		1: Move distance

		ignore is used to define a rock that should be ignored.
		This is for forcing the aigun to select another rock that the already selected
	*/

	var bestVal, best, rocks, i, ii, building, rock, rockDist, rockDir, relDir, dirDist;

	rocks = engine.depth[5].getChildren();
	bestVal = false;
	best = false;
	for (i = 0; i < rocks.length; i ++) {
		rock = rocks[i];
		if (ignoreList !== undefined && ignoreList.indexOf(rock.id) !== -1) {
			continue;
		}

		rockDist = Math.sqrt(Math.pow(rock.x - this.x, 2) + Math.pow(rock.y - this.y, 2));
		if (rockDist > this.range || rock.y > this.y) {
			continue;
		}

		switch (compareBy) {
		case 0:
			if (bestVal === false || rockDist < bestVal) {
				bestVal = rockDist;
				best = rock.id;
			}
			break;
		case 1:
			rockDir = Math.atan2(rock.y - this.y, rock.x - this.x);
			relDir = rockDir - this.dir + 2 * Math.PI;

			while (relDir > Math.PI) {
				relDir -= Math.PI * 2;
			}
			dirDist = Math.abs(relDir);

			if (bestVal === false || dirDist < bestVal) {
				bestVal = dirDist;
				best = rock.id;
			}
			break;
		}
	}
	return best;
};

AiGun.prototype.findShootDirection = function (target, dT) {
	// Find new rock position
	var nextX = target.x + target.dX * (engine.now - engine.last) / 1000 * (dT + 2),
		nextY = target.y + target.dY * (engine.now - engine.last) / 1000 * (dT + 2),

		// Calculate how long it will take for a shot to reach the new rock location
		dist = Math.sqrt(Math.pow(nextX - this.x, 2) + Math.pow(nextY - this.y, 2)),
		reachT = dist / (this.bulletSpeed * (engine.now - engine.last) / 1000 * dT);

	// If the new rock position can be reached with a bullet, return the direction to the new position
	if (reachT <= dT) {
		return {
			dir: Math.atan2(nextY - this.y, nextX - this.x),
			dist: dist,
			lastDist: Math.sqrt(Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2)),
			steps: dT
		};
	}
	else {
		return this.findShootDirection(target, dT + 4);
	}
};

AiGun.prototype.getOccupiedTargets = function () {
	var i, target, dist1, dist2, targets;

	// Check that no other building is aiming for the same target
	targets = [];
	for (i = 0; i < stageController.buildings.length; i++) {
		building = stageController.buildings[i];
		if (building !== this.parent && building.gun && building.gun.targetId) {
			// if the target is closer to this gun, don't put it on the list

			target = engine.objectIndex[building.gun.targetId];
			if (target === undefined) {
				continue;
			}

			dist1 = Math.sqrt(Math.pow(building.gun.x - target.x, 2) + Math.pow(building.gun.y - target.y, 2));
			dist2 = Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2));

			if (dist1 < dist2) {
				targets.push(building.gun.targetId);
			}
		}
	}
	return targets;
};

AiGun.prototype.update = function () {
	var t, relDir, tDir, findDirRes, dDist, otherGunTargets, ignoreList, newTarget, id, lx, ly, beam, i;

	if (!this.alive) {return; }

	// If the gun does not have a target, find a target
	t = engine.objectIndex[this.targetId];
	if (!t || t.y > this.y) {
		if (player.weaponIntelligence > 3) {
			this.targetId = this.findTarget(0, this.getOccupiedTargets());
			if (this.targetId === false) {	
				this.targetId = this.findTarget(0);
			}
		}
		else {
			this.targetId = this.findTarget(0);
		}
	}

	t = engine.objectIndex[this.targetId];
	if (!t) {
		if (player.weaponIntelligence > 0) {
			// If there is no target, move to PI / 2 (facing up)
			relDir = Math.PI * 1.5 - this.dir + 2 * Math.PI;
			while (relDir > Math.PI) {
				relDir -= Math.PI * 2;
			}

			if (relDir > 0) {
				this.dir += Math.min(relDir, this.rotSpeed);
			} else {
				this.dir += Math.max(relDir, - this.rotSpeed);
			}
		}
	}
	else {
		// Rotate towards the target
		// Find the direction to the target relative to the guns rotation
		if (player.weaponIntelligence < 2 || this.type === 4) {
			tDir = Math.atan2(t.y - this.y, t.x - this.x);
		}
		else {
			findDirRes = this.findShootDirection(t, 4);
			tDir = findDirRes.dir;

			if (player.weaponIntelligence > 2) {
				// Check that the distance to the target is not increasing
				ignoreList = [];

				if (player.weaponIntelligence > 3) {
					Array.prototype.push.apply(ignoreList, this.getOccupiedTargets());

					if (ignoreList.indexOf(this.targetId) !== -1) {
						// console.log('Aiming a same target as other gun');
						newTarget = this.findTarget(0, ignoreList);
						if (newTarget) {
							// console.log('New target found');
							this.targetId = newTarget;
						}
					}
				}

				dDist = findDirRes.dist - findDirRes.lastDist;

				if (dDist > 0) {
					// If the distance to current target is increasing, check if there is a better target
					ignoreList.push(this.targetId);

					newTarget = false;
					
					while (id = this.findTarget(0, ignoreList)) {
						ignoreList.push(id);
						findDirRes = this.findShootDirection(engine.objectIndex[id], 5);

						if (findDirRes.dist - findDirRes.lastDist < dDist) {
							newTarget = id;
						}
					}

					// If a better target has been found, target it.
					if (newTarget) {
						this.targetId = newTarget;
					}
				}
			}
		}

		// Move towards target
		relDir = tDir - this.dir + 2 * Math.PI;
		while (relDir > Math.PI) {
			relDir -= Math.PI * 2;
		}
		if (relDir > 0) {
			this.dir += Math.min(relDir, this.rotSpeed);
		} else {
			this.dir += Math.max(relDir, - this.rotSpeed);
		}

		// Shoot if the gun is loaded
		if (engine.gameTime > this.loadedAfter) {
			if (Math.abs(relDir) < this.rotSpeed) {
				// All guns, except the laser, fires a bullet.
				if (this.type < 4) {
					// Fire the gun's ammunition type
					engine.depth[2].addChild(
						new GunShot(
							this.x,
							this.y,
							this.dir - this.spread / 2 + Math.random() * this.spread,
							this.bulletSpeed,
							this.bulletDamage * Math.pow(1.3, this.level),
							this.bulletBlastRange,
							this.bulletBmSource,
							engine.objectIndex[this.targetId],
							this
						)
					);
				} else {
					// The laser gun has a special shot that hits instantly

					// Make laser beam on rock
					lx = t.x + 0 * Math.cos(tDir + Math.PI);
					ly = t.y + 0 * Math.sin(tDir + Math.PI);
					beam = new Sprite('Effects.Beam', lx, ly, 0, {"opacity": 0, "bmSize": 1.5});
					engine.depth[6].addChild(beam);
					beam.animate({"opacity": 1}, {'dur': 200, easing: 'quadIn', callback: function () {
						this.animate({"bmSize": 0, "opacity": 0}, {"dur": 400, easing: 'quadOut', callback: function () {
							this.remove();
						}});
					}});

					// Make laser beam on canon
					lx = this.x + 24 * Math.cos(tDir);
					ly = this.y + 24 * Math.sin(tDir);
					beam = new Sprite('Effects.Beam', lx, ly, 0, {"opacity": 0, "bmSize": 0});
					engine.depth[8].addChild(beam);
					beam.animate({"bmSize": 0.5, "opacity": 1}, {'dur': 100, easing: 'quadIn', callback: function () {
						this.animate({"bmSize": 0, "opacity": 0}, {"dur": 100, easing: 'quadOut', callback: function () {
							this.remove();
						}});
					}});

					// Do damage
					t.damage(this.bulletDamage, this);
				}
				this.loadedAfter = engine.gameTime + this.loadTime;
			}
		}
	}
};

 /*
AiGun.prototype.remove = function (time) {
	if (this.alive) {
		this.alive = false;
		time = time  ?  time : 200;
		this.animate({"bmSize": 0}, {'dur': time, callback: "jsePurge('" + this.id + "')", 'layer': 1});
		this.parent.gun = false;
		this.parent.gunType = 0;
		return true;
	}
	return false;
}
 */

AiGun.prototype.cols = function () {
	var rocks, i, cObj, cDist;

	// Check for collisions with rocks
	if (!this.alive) {return; }

	rocks = engine.depth[5].getChildren();

	for (i = 0; i < rocks.length; i ++) {
		cObj = rocks[i];

		if (!cObj.alive) {continue; }
		cDist = this.bmWidth / 2 + cObj.bmWidth / 2;
		if (Math.sqrt(Math.pow(cObj.x - this.x, 2) + Math.pow(cObj.y - this.y, 2)) < cDist) {
			cObj.remove();
			this.parent.setGun(0);
			break;
		}
	}
};