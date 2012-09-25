/*
Explosion:
Simple explosion animation with variable width and duration

Requires:
	Sprite
	Animator
*/

jseCreateClass('Explosion');
jseExtend(Explosion, Sprite);

Explosion.prototype.explosion = function (_spr, _x, _y, _radius, _dur) {
	// Extend sprite
	this.sprite(_spr, _x, _y, Math.random() * Math.PI * 2, {bmSize: 0, opacity: 0});
	
	this.animate({bmSize: _radius / this.bmWidth, opacity: 1}, {easing: 'quadOut', dur: _dur / 2, callback: function () {
		this.animate({opacity: 0}, {dur: _dur / 2, callback: function () {
			this.remove();
		}});
	}});
};