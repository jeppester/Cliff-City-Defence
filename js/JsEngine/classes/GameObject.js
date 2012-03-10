/*
Game object:
An object with movement

Requires;
    Sprite
    Animator
    Loader
*/

function GameObject(_src, _depth, _x, _y, _dir,_addOpt) {
	//Extent sprite
	Sprite.call(this, _src, _depth, _x, _y, _dir,_addOpt);

	//Add object in update array
	this.update=this.update?this.update:'onRunning';
	updateObjects[this.update][this.id]=this;

	//Tilføj bevægelsesvarible
	this.dX = this.dX ? this.dX : 0;
	this.dY = this.dY ? this.dY : 0;
	this.alive = true;

	this.remove = function(time) {
		if (this.alive) {
			this.alive = false;
			time = time ? time : 200;
			this.animate({"bmSize":0},{'dur':time,callback:"purge(depth["+this.depth+"]['"+this.id+"'])",'layer':1});
			return true;
		}
		return false;
	}

	this.update = function() {
		if (this.alive) {
			//Kør funktion til tilføjelse af yderligere til update(), kaldet "step";
			this.x += this.dX * (now - last) / 1000;
			this.y += this.dY * (now - last) / 1000;

			this.step();
		}
	}
	this.step = function() {}

	return this;
}
