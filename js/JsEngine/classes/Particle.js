function Particle(_src,_depth,_x,_y,_dir,_lifetime,_addOpt) {
	if (_lifetime===undefined) {
		throw new Error('Missing argument "lifetime"');
	}
	GravityObject.call(this,_src, _depth, _x, _y, _dir, _addOpt);

	this.spawnTime=gameTime;
	this.lifetime=_lifetime;
	
	this.step = function() {
		this.doGrav();
		this.updateLife();
	}
	this.updateLife=function() {
		var left=1-(gameTime-this.spawnTime)/this.lifetime;
		//this.opacity=left;
		this.bmSize=left;

		if (left<0) {purge(this)}
	}
}