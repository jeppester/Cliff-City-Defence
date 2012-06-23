function Rock(_spr,_dmgSpr,_x,_dir,_grav,_life,_value,_maxSpeed,_onStep,_onDestroy) {
	if (_dmgSpr===undefined) {
		throw new Error('Missing argument "dmgSpr"');
	}
	if (_life===undefined) {
		throw new Error('Missing argument "life"');
	}
	if (_value===undefined) {
		throw new Error('Missing argument "value"');
	}
	if (_grav===undefined) {
		throw new Error('Missing argument "grav"');
	}
	if (_maxSpeed===undefined) {
		throw new Error('Missing argument "maxSpeed"');
	}

	// Set onStep and onDestroy functions
	this.onStep = _onStep===undefined ? function() {} : _onStep;
	this.onDestroy = _onDestroy===undefined ? function() {} : _onDestroy;

	// Extend GravityObject
	var acc=5000;
	var x=_x
	var y=-25;
	var dX=Math.cos(_dir)*acc*loopSpeed/1000;
	var dY=Math.sin(_dir)*acc*loopSpeed/1000;
	GravityObject.call(this, _spr, 5, x, y, _dir, {'dX':dX, 'dY':dY, 'gravity':_grav});
	
	this.dmgSprite=new Sprite(_dmgSpr,5, x, y, _dir);
	this.dmgSprite.opacity=0;

	this.maxLife=_life
	this.life=_life;
	this.value=_value;
	this.maxSpeed=_maxSpeed;
	this.impacted=false;
	
	this.damage=function(dhp) {
		this.life=Math.max(0,this.life-dhp);
		
		this.dmgSprite.opacity=(this.maxLife-this.life)/this.maxLife;
		if (this.life==0) {
			this.remove();
			player.rocksDestroyed++;

			// Calculate the points, based on how far the rock got
			var relDist=1-(this.y-150)/450;
			var value=Math.min(1,relDist)*this.value;
			var value=Math.round(value/10)*10;

			new ScorePoints(value,this.x,this.y);
		}
	}
	
	this.step=function() {
		this.dmgSprite.x=this.x;
		this.dmgSprite.y=this.y;
		this.dmgSprite.dir=this.dir;
		this.doGrav();
		this.doBorders();
		this.onStep();
	}

	this.remove = function(time) {
		if (this.alive) {
			this.alive = false;
			time = time ? time : 150;
			var animOpt={'bmSize':1.5,'opacity':0};
			this.animate(animOpt,{'dur':time,callback:"purge(depth["+this.depth+"]['"+this.id+"'])",'layer':1});
			this.dmgSprite.animate(animOpt,{'dur':time,callback:"purge(depth["+this.dmgSprite.depth+"]['"+this.dmgSprite.id+"'])",'layer':1});
			stageController.stats.rocks.push({
				fallDistance:this.y,
				impacted:this.impacted
			});
			this.onDestroy();
			return true;
		}
	}
	
	this.doBorders = function() {
		var border = false;
		if (this.x < 50 || this.x > canvasResX - 50) {

			while (this.x < 50 || this.x > canvasResX - 50) {
				this.x -= this.dX * (now - last) / 1000;
			}

			this.dX = -this.dX;
		}

		if (this.y > canvasResY-35) {
			this.impacted=true;
			this.remove();
		}
		
		if (this.dY>this.maxSpeed) {
			this.dY=this.maxSpeed;
		}
		
		this.dir=Math.atan2(this.dY,this.dX);
	}
}
