function RockMagnetic(_x,_dir) {
	var spr=pImg+'RockMagnetic.png';
	var dmgSpr=pImg+'RockCracks2.png';
	var life=150;
	var value=500;
	var grav=500;
	
	Rock.call(this, spr, dmgSpr, _x, _dir, grav, life, value);
	
	this.cols=function() {
		//Check for collisions
		if (!this.alive) {return;}
		
		for (var i in depth[3]) {
			var cObj=depth[3][i];
			if (!cObj.alive) {continue;}
			
			var dist=Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))
			var dir=Math.atan2(this.y-cObj.y,this.x-cObj.x);
			
			var b=0.9;
			var acc=100*Math.pow(b,dist/5);
			
			this.dX += Math.cos(dir)*acc;
			this.dY += Math.sin(dir)*acc;
		}
	}
}
