function Cloud() {
	//Extend GameObject
	GameObject.call(this,'img/nonScalable/Cloud.png',2,Math.random()*arena.style.width.replace('px',''),50+Math.random()*100,0,{'dX':5+Math.random()*10,'dY':0});
	
	this.bmWidth*=.7+Math.random()*.3
	this.bmHeight*=.7+Math.random()*.3
	
	this.step=function() {
		if (this.x>arena.style.width.replace('px','')) {
			this.x=0;
		}
	}
}
