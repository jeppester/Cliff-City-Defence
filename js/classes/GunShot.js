function GunShot(_type,_dir,_x,_y) {
	this.type=_type ? _type : 1;
	var _acc=0;
	switch (this.type) {
	case 1:
		this.damage=50;
		this.blastRange=0;
		_acc=800;
	break;
	case 2:
		this.damage=30;
		this.blastRange=0;
		_acc=600;
	break;
	case 3:
		this.damage=100;
		this.blastRange=30;
		_acc=400;
	break;
	}

	//Extend gameObject
	var _x=_x?_x:0;
	var _y=_y?_y:0;
	var _dX=Math.cos(_dir/180*Math.PI)*_acc;
	var _dY=Math.sin(_dir/180*Math.PI)*_acc;
	
	GameObject.call(this, pImg+'GunShot'+this.type+'.png', 2, _x, _y, _dir, {'dX':_dX,'dY':_dY,'update':'onRunning','xOff':17,'yOff':1});
	
	this.step=function() {
	}
	
	this.cols=function() {
		//Destroy the bullet if it's outside the level
		this.doBorders();
	
		//Check for collisions with rocks
		if (!this.alive) {return;}
		
		for (var i in depth[5]) {
			var cObj=depth[5][i];
			if (!cObj.alive) {continue;}
			
			var cDist=10+cObj.bmWidth/2;
			
			if (Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist) {
				this.remove();

				// If there is no blastrange do regular damage
				if (!this.blastRange) {
					cObj.damage(this.damage);
				} else {
					// Do blastrange damage
					// Make explosion
					new Explosion(this.x,this.y,this.blastRange+this.bmWidth,400);

					for (var i in depth[5]) {
						var bObj=depth[5][i];
						if (!bObj.alive) {continue;}
						
						// Calculate the collision distance
						var cDist2=this.bmWidth/2+cObj.bmWidth/2;

						// Calculate the distance between the objects
						var objDist=Math.sqrt(Math.pow(bObj.x-this.x,2)+Math.pow(bObj.y-this.y,2));

						// Check that the rock is within blast range
						if (objDist<cDist2) {
							bObj.damage(this.damage);
						} else {
							if (objDist<this.bmWidth+this.blastRange) {
								var blastDist=objDist-this.bmWidth;

								if (blastDist<0) {
									var dmg=this.damage;
								} else {
									var dmg=this.damage-blastDist/this.blastRange*this.damage;
								}

								// Damage the rock according to the distance
								bObj.damage(dmg);
							}
						}
					}
				}
			}
		}
	}
	
	this.doBorders = function() {
		if (this.x < 40 || this.x > arena.offsetWidth - 40) {
			this.remove();
		}

		if (this.y > arena.offsetHeight - 200 && this.dY > 0) {
			this.remove();
		}
		if (this.y < -17) {
			this.remove();
		}
	}
}
