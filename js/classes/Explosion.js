/*
Explosion:
Simple explosion animation with variable width and duration

Requires:
	Sprite
	Animator
*/

Explosion = function (_spr, _x, _y, _radius, _dur) {
	// Extend sprite
	View.Sprite.call(this, _spr, _x, _y, Math.random() * Math.PI * 2, {size: 0, opacity: 0});

	this.animate({size: _radius / this.bm.width, opacity: 1}, {easing: 'quadOut', duration: _dur / 2, callback: function () {
		this.animate({opacity: 0}, {duration: _dur / 2, callback: function () {
			engine.purge(this);
		}});
	}});
};

Explosion.prototype = Object.create(View.Sprite.prototype);
