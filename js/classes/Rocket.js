/*
Rocket:
A rocket fired from the main cannon

Requires:
	Sprite
	Player
	GravityObject
	Explosion
	Animator
*/

function Rocket(_dir) {	
	//Extend GravityObject
	var acc=20000;
	var x=canvasResX/2;
	var y=canvasResY-120;
	var dX=Math.cos(_dir)*acc*loopSpeed/1000;
	var dY=Math.sin(_dir)*acc*loopSpeed/1000;
	GravityObject.call(this, pImg+'Rocket.png', 3, x, y, _dir, {'dX':dX,'dY':dY,'gravity':300});

	// Set the number of bounces
	// Indicates how many times the rocket has hit a wall and bounced
	this.bounces=0;

	// Set blast range
	switch (player.rocketBlastRangeLevel) {
	case 1:
		this.blastRange=10;
	break;
	case 2:
		this.blastRange=30;
	break;
	case 3:
		this.blastRange=60;
	break;
	case 4:
		this.blastRange=100;
	break;
	default:
		this.blastRange=0;
	break;
	}
	
	this.doBorders = function() {
		var border = false;
		if (this.x < 50 || this.x > canvasResX - 50) {

			// Bounce if the rocket has not already bounced the allowed number of times
			if (this.bounces>=player.rocketBounces) {
				this.remove();
			}
			this.bounces++;

			// Move the rock untill it's outside the wall
			while (this.x < this.bmSize / 2 || this.x > canvasResX - this.bmSize / 2) {
				this.x -= this.dX / Math.abs(this.X);
			}

			// Negate the horisontal speed
			this.dX = -this.dX;
		}

		// If the rocket is too close to the buildings, selfdestroy it
		if (this.y > canvasResY - 200 && this.dY>0) {
			this.remove();
		}
		
		// Set the sprites direction to the direction of the rockets vector
		this.dir=Math.atan2(this.dY,this.dX);
	}
	
	this.cols=function() {
		// Check for collisions with rocks
		if (!this.alive) {return;}
		
		for (var i in depth[5]) {
			var cObj=depth[5][i];
			if (!cObj.alive) {continue;}
			
			var cDist=this.bmWidth/2+cObj.bmWidth/2;
			if (Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist) {
				this.remove();

				// Do blastrange
				if (this.blastRange) {
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
							bObj.damage(150);
						} else {
							if (objDist<this.bmWidth+this.blastRange) {
								// Damage the rock according to the distance
								var blastDist=objDist-this.bmWidth;

								if (blastDist<0) {
									var dmg=150;
								} else {
									var dmg=150-blastDist/this.blastRange*150;
								}
								bObj.damage(dmg);
							}
						}
					}
				} else {
					cObj.damage(150);
				}

				break;
			}
		}
	}
}