Particle = function (source, x, y, dir, lifeTime, additionalProperties) {
	if (source === undefined) {throw new Error('Missing argument: source'); }
	if (x === undefined) {throw new Error('Missing argument: x'); }
	if (y === undefined) {throw new Error('Missing argument: y'); }
	if (dir === undefined) {throw new Error('Missing argument: dir'); }
	if (lifeTime === undefined) {throw new Error('Missing argument: lifeTime'); }

	if (lifeTime === undefined) {
		throw new Error('Missing argument "lifetime"');
	}
	View.GameObject.call(this, source, x, y, dir, additionalProperties);

	this.spawnTime = engine.gameTime;
	this.lifetime = lifeTime;

	this.loop.attachFunction(this, this.updateLife);
};

Particle.prototype = Object.create(View.GameObject.prototype);

Particle.prototype.updateLife = function () {
	var left = 1 - (engine.gameTime - this.spawnTime) / this.lifetime;

	// this.opacity = left;
	this.size = left;

	if (left < 0) {
		engine.purge(this);
	}
};
