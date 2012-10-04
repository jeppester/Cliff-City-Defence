jseCreateClass('Animation');

Animation.prototype.animate = function (_prop, _options) {
	var anim, i, c, loop, map, opt;

	anim = {},
	map = _prop,
	opt = _options  ?  _options : {};

	if (!map) {
		return false;
	}

	anim.obj = this;

	loop = opt.loop !== undefined  ?  opt.loop : engine.defaultAnimationLoop;
	anim.callback = opt.callback !== undefined  ?  opt.callback : function () {};
	anim.easing = opt.easing !== undefined ?  opt.easing : "quadInOut";
	anim.dur = opt.dur !== undefined ?  opt.dur : 1000;

	anim.prop = {};
	for (i in map) {
		if (map.hasOwnProperty(i)) {
			anim.prop[i] = {
				begin: this[i],
				end: map[i]
			};
		}
	}

	// Remove properties that are equal to their end value
	c = 0;
	for (i in anim.prop) {
		if (anim.prop[i].begin === anim.prop[i].end) {
			delete anim.prop[i];
		} else {
			c ++;
		}
	}

	// If there are no properties left to animate and the animation does not have a callback function, do nothing
	if (!c && anim.callback === function () {}) {
		console.log('Animation skipped, nothing to animate');
		return;
	}

	animator.addAnimation(anim, loop);
};