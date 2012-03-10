function Rock(_spr,_dmgSpr,_x,_dir,_grav,_life,_value) {
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

	//Extend GravityObject
	var acc=5000;
	var x=_x
	var y=-50;
	var dX=Math.cos(_dir/180*Math.PI)*acc*loopSpeed/1000;
	var dY=Math.sin(_dir/180*Math.PI)*acc*loopSpeed/1000;
	GravityObject.call(this, _spr, 5, x, y, _dir, {'dX':dX, 'dY':dY, 'gravity':_grav});
	
	this.dmgSprite=new Sprite(_dmgSpr,5, x, y, _dir);
	this.dmgSprite.opacity=0;

	this.maxLife=_life
	this.life=_life;
	this.value=_value;
	
	this.damage=function(dhp) {
		this.life=Math.max(0,this.life-dhp);
		
		this.dmgSprite.opacity=(this.maxLife-this.life)/100;
		if (this.life==0) {
			this.remove();
			new ScorePoints(this.value,this.x,this.y);
		}
	}
	
	this.step=function() {
		this.dmgSprite.x=this.x;
		this.dmgSprite.y=this.y;
		this.dmgSprite.dir=this.dir;
		this.doGrav();
		this.doBorders();
	}
	
	this.remove = function(time) {
		if (this.alive) {
		    this.alive = false;
		    time = time ? time : 150;
		    var animOpt={'bmSize':1.5,'opacity':0};
		    this.animate(animOpt,{'dur':time,callback:"purge(depth["+this.depth+"]['"+this.id+"'])",'layer':1});
		    this.dmgSprite.animate(animOpt,{'dur':time,callback:"purge(depth["+this.dmgSprite.depth+"]['"+this.dmgSprite.id+"'])",'layer':1});
		    return true;
		}
		return false;
	}
	
	this.doBorders = function() {
		var border = false;
		if (this.x < 50 || this.x > (arena.style.width.replace('px', '') * 1) - 50) {

			while (this.x < 50 || this.x > (arena.style.width.replace('px', '') * 1) - 50) {
				this.x -= this.dX * (now - last) / 1000;
			}

			this.dX = -this.dX;
		}

		if (this.y > arena.style.height.replace('px', '')-35) {
			this.remove();
		}
		
		if (this.dY>120) {
			this.dY=120;
		}
		
		this.dir=Math.atan2(this.dY,this.dX)/Math.PI*180;
	}
}
