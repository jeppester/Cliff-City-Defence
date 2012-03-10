/*
Animator:
The animator handles animations inside objects based on sprites.
An animation is an eased change in a numeric variable inside an object.
The animator features different easing functions.

No requirements
*/

function Animator() {
	this.animations = new Array();
	this.animations.push(new Object(), new Object());

	//updateAll updates all animations in a layer
	this.updateAll = function(layer) {
		//"layer" decides if the animation will run also when the game is paused
		layer = layer ? layer : 0
		
		//Run through the layer an update all animations
		for (var i in this.animations[layer]) {
			this.update(this.animations[layer][i], layer);
		}
	}

	//update updates a single animation
	this.update = function(animation, layer) {
		var a = animation,
			t;

		if (layer == 0) {
			t = gameTime - a.start;
		} else {
			t = (new Date().getTime()) - a.start;
		}
		
		if (t > a.dur) {
			//If the animation has ended: delete it and set the animated properties to their end values
			delete animator.animations[layer][a.obj.id];
			for (var i = 0 in a.prop) {
				a.obj[i] = a.prop[i].end;
			}
			if (a.callback.length) {
				eval(a.callback);
			} else {
				a.callback.call(a.obj);
			}
		} else {
			//If the animation is still running: Ease the animation of each property
			for (var i = 0 in a.prop) {
				a.obj[i] = this.ease(a.easing, t, a.prop[i].begin, a.prop[i].end - a.prop[i].begin, a.dur);
			}
		}
	}

	//ease is used for easing the animation of a property
	this.ease = function(type, t, b, c, d) {
		switch (type) {
		case "linear":
			t /= d
			return b + c * t;
			break;
		case "quadIn":
			t /= d
			return b + c * t * t;
			break;
		case "quadOut":
			t /= d
			return b - c * t * (t - 2);
			break;
		case "quadInOut":
			t = t / d * 2;
			if (t < 1) {
				return b + c * t * t / 2;
			} else {
				t--;
				return b + c * (1 - t * (t - 2)) / 2;
			}
			break;
		case "powerIn":
			t /= d;

			//a determines if c is positive or negative
			a = c / Math.abs(c);

			return b + a * Math.pow(Math.abs(c), t);
			break;
		case "powerOut":
			t /= d;

			//a determines if c is positive or negative
			a = c / Math.abs(c);

			return b + c - a * Math.pow(Math.abs(c), 1 - t);
			break;
		case "powerInOut":
			t = t / d * 2;

			//a determines if c is positive or negative
			a = c / Math.abs(c);

			if (t < 1) {
				return b + a * Math.pow(Math.abs(c), t) / 2;
			} else {
				t--;
				return b + c - a * Math.pow(Math.abs(c), 1 - t) / 2;
			}
			break;
		case "sinusInOut":
			t /= d
			return b + c * (1 + Math.cos(Math.PI * (1 + t))) / 2;
			break;
		}
		return b + c;
	}
}
