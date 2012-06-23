/*
Destroyable:
A sprite which can be destroyed (for cosmetic destroyable terrain)

Requires:
	Sprite
	Animator
*/

function Destroyable(_src,_depth,_x,_y,_dir) {
	// Import sprite
	importClass(this,Sprite);

	if (_src==undefined) {
		return false;
	}

	//Extend Sprite
	this.sprite(_src,_depth,_x,_y,_dir);
	
	this.alive=true;
	this.remove = function(time) {
		if (this.alive) {
			time = time ? time : 200;
		
			this.alive = false;
			this.animate({"bmSize":1.5,"opacity":0},{'dur':time,callback:"purge(depth[" + this.depth + "]['" + this.id + "'])",'layer':1});
			
			return true;
		}
		return false;
	}
	
	this.cols=function() {
		//Check for collisions
		if (!this.alive) {return;}
		
		for (var i in depth[5]) {
			cObj=depth[5][i];
			if (!cObj.alive) {continue;}
			cDist=this.bmWidth/2+cObj.bmWidth/2;
			if (Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist) {
				this.remove();
				cObj.impacted=true;
				cObj.remove();
			}
		}
	}
}
