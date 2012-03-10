/*
Explosion:
Simple explosion animation with variable width and duration

Requires:
	Sprite
	Animator
*/

function Explosion(_x,_y,_radius,_dur) {
	// Extend sprite
	Sprite.call(this,pImg+'Explosion.png',7,_x,_y,0,{bmSize:0,opacity:0});

	this.animate({bmSize:_radius/100,opacity:1},{easing:'quadOut',dur:_dur/2,callback:function() {
		this.animate({opacity:0},{dur:_dur/2,callback:function() {
			this.remove();
		}})
	}})
}