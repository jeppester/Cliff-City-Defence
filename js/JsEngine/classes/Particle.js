jseCreateClass('Particle');
jseExtend(Particle, GameObject);

Particle.prototype.particle = function (_src, _x, _y, _dir, _lifetime, _addOpt) {
	if (_lifetime === undefined) {
		throw new Error('Missing argument "lifetime"');
	}
	this.gameObject(_src, _x, _y, _dir, _addOpt);

	this.spawnTime = engine.gameTime;
	this.lifetime = _lifetime;

	engine.addActivityToLoop(this, this.updateLife, this.loop);
};

Particle.prototype.updateLife = function () {
	var left = 1 - (engine.gameTime - this.spawnTime) / this.lifetime;

	// this.opacity = left;
	this.bmSize = left;

	if (left < 0) {
		jsePurge(this);
	}
};