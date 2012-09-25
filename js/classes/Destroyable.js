/*
Destroyable:
A sprite which can be destroyed (for cosmetic destroyable terrain)

Requires:
	Sprite
	Animator
*/

jseCreateClass('Destroyable');
jseExtend(Destroyable, Sprite);

Destroyable.prototype.destroyable = function (_src, _depth, _x, _y, _dir) {
	if (_src === undefined) {
		return false;
	}

	// Extend Sprite
	this.sprite(_src, _depth, _x, _y, _dir);
	this.alive = true;

	// Add to collision checking loop
	engine.addActivityToLoop(this, this.cols, 'collisionChecking');
};

Destroyable.prototype.remove = function (time) {
	if (this.alive) {
		time = time  ?  time : 200;

		this.alive = false;
		this.animate({"bmSize": 1.5, "opacity": 0}, {'dur': time, callback: "jsePurge('" + this.id + "')", 'layer': 1});

		return true;
	}
	return false;
};

Destroyable.prototype.cols = function () {
	// Check for collisions
	if (!this.alive) {return; }

	var rocks = engine.depth[5].getChildren(),
		i,
		cObj,
		cDist;

	for (i = 0; i < rocks.length; i++) {
		cObj = rocks[i];

		if (!cObj.alive) {continue; }
		cDist = this.bmWidth / 2 + cObj.bmWidth / 2;
		if (Math.sqrt(Math.pow(cObj.x - this.x, 2) + Math.pow(cObj.y - this.y, 2)) < cDist) {
			this.remove();
			cObj.impacted = true;
			cObj.remove();
		}
	}
};