/*
Game object:
An object with movement

Requires;
    Sprite
    Animator
    Loader
*/

jseCreateClass('GameObject');
jseExtend(GameObject, Sprite);

GameObject.prototype.gameObject = function (_src, _x, _y, _dir, _addOpt) {
	this.sprite(_src, _x, _y, _dir, _addOpt);

	// Add object to right loop
	this.loop = this.loop ? this.loop: 'eachFrame';
	engine.addActivityToLoop(this, this.update, this.loop);

	// Create movement variables
	this.dX = this.dX  ?  this.dX : 0;
	this.dY = this.dY  ?  this.dY : 0;
	this.alive = true;
};

GameObject.prototype.remove = function (time) {
	if (this.alive) {
		this.alive = false;
		time = time  ?  time : 200;
		this.animate({"bmSize": 0}, {'dur': time, callback: "jsePurge('" + this.id + "')", 'layer': 1});
		return true;
	}
	return false;
};

GameObject.prototype.update = function () {
	if (this.alive) {
		// Kør funktion til tilføjelse af yderligere til update(), kaldet "step";
		this.x += this.dX * (engine.now - engine.last) / 1000;
		this.y += this.dY * (engine.now - engine.last) / 1000;
	}
};