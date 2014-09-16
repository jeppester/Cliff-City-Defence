/*
Destroyable:
A sprite which can be destroyed (for cosmetic destroyable terrain)

Requires:
	Sprite
	Animator
*/

Destroyable = function (_src, _depth, _x, _y, _dir) {
	if (_src === undefined) {return false; }

	// Extend View.Sprite
	View.Sprite.call(this, _src, _depth, _x, _y, _dir);
	this.alive = true;

	// Add to collision checking loop
	engine.currentRoom.loops.collisionChecking.attachFunction(this, this.cols);
};

Destroyable.prototype.remove = function (time) {
	if (this.alive) {
		time = time  ?  time : 200;

		this.alive = false;
		this.animate({"size": 1.5, "opacity": 0}, {'dur': time, callback: "engine.purge('" + this.id + "')", 'layer': 1});

		return true;
	}
	return false;
};

Destroyable.prototype = Object.create(View.Sprite.prototype);

Destroyable.prototype.cols = function () {
	var rocks, i, cObj, cDist;

	// Check for collisions
	if (!this.alive) {return; }

	rocks = main.depths[5].getChildren();

	for (i = 0; i < rocks.length; i++) {
		cObj = rocks[i];

		if (!cObj.alive) {continue; }
		cDist = this.bm.width / 2 + cObj.bm.width / 2;
		if (Math.sqrt(Math.pow(cObj.x - this.x, 2) + Math.pow(cObj.y - this.y, 2)) < cDist) {
			engine.purge(this);
			cObj.impacted = true;
			cObj.remove();
		}
	}
};
