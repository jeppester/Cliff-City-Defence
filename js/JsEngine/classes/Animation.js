Animation=function() {
}

Animation.prototype.animate = function(_prop, _to, _dur, _callback, _layer, _easing) {
	var anim = new Object();

	anim.obj = this;

	if (!_dur) {
		var map = _prop,
			opt = _to ? _to : {};
		if (!map) {
			return false;
		}

		var layer = opt['layer']!=undefined ? opt['layer'] : 1;
		anim.callback = opt['callback'] ? opt['callback'] : function() {};
		anim.easing = opt['easing'] ? opt['easing'] : "quadInOut";
		anim.dur = opt['dur'] ? opt['dur'] : 1000;

		anim.prop = {};
		for (var i = 0 in map) {
			anim.prop[i] = {
				begin: this[i],
				end: map[i]
			}
		}
	} else {
		if (_to === false || _to === undefined) {
			return false;
		}

		var layer = _layer!=undefined ? _layer : 1;

		anim.callback = _callback ? _callback : function() {};
		anim.easing = _easing ? _easing : "quadInOut";

		anim.prop = {};
		anim.prop[_prop] = {
			begin: this[_prop],
			end: _to
		}

		anim.dur = _dur ? _dur : 1000;
	}

	var c=0;
	for (var i in anim.prop) {
		if (anim.prop[i].begin==anim.prop[i].end) {
			delete anim.prop[i];
		} else {
			c++;
		}
	}
	if (!c && anim.callback==function(){}) {
		console.log('Animation skipped, nothing to animate');
		return;
	};

	if (layer == 0) {
		anim.start = gameTime;
	} else {
		anim.start = new Date().getTime();
	}

	if (animator.animations[layer][this.id] != undefined) {
		delete animator.animations[layer][this.id];
	}
	animator.animations[layer][this.id] = anim;

	return anim;
}