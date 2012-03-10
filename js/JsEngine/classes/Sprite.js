/*
Sprite:
A drawn bitmap with rotation and size.
Usually all graphical objects in a game extends a sprite.

No requirements
*/

function Sprite(_src, _depth, _x, _y, _dir, _addOpt) {
	this.x = _x ? _x : 0;
	this.y = _y ? _y : 0;
	this.dir = _dir ? _dir : 0;
	this.depth = _depth ? _depth : 0;
	this.id = "obj" + curId;
	curId++
	

	// Load default options
	this.bmSize  = 1;
	this.opacity = 1;

	// Load additional options
	copyVars(_addOpt,this);

	if (!useCanvas) {
		this.bm = new Image();
		this.bm.src = loader.images[_src].src;
		this.bm.style.position = "absolute";
	} else {
		this.bm = loader.images[_src];
	}
	
	if (this.bm==undefined) {
		console.write(_src);
	}
	this.bmWidth = this.bm.width;
	this.bmHeight= this.bm.height;
	this.xOff = this.xOff!=undefined ? this.xOff : this.bmWidth/2;
	this.yOff = this.yOff!=undefined ? this.yOff : this.bmHeight/2;
	
	// Add object in array
	depth[this.depth][this.id] = this;

	if (!useCanvas) {
		this.bm.style.zIndex = this.depth;
		this.bm.style.top = this.y - this.bm.width / 2 + "px";
		this.bm.style.left = this.x - this.bm.height / 2 + "px";
		this.bm.style.webkitTransform = "rotate(" + this.dir + "deg)";
		this.bm.style.msTransform = "rotate(" + this.dir + "deg)";
		this.bm.style.MozTransform = "rotate(" + this.dir + "deg)";
		arena.appendChild(this.bm);
	}

	this.cols = function() {};

	this.remove = function() {
		purge(this)
	};

	this.drawHTML = function() {
		// Opdatér spriten med HTML
		this.bm.style.width = this.bmSize + "px";
		this.bm.style.height = this.bmSize + "px";
		this.bm.style.opacity = this.opacity;
		this.bm.style.webkitTransform = "rotate(" + this.dir + "deg)";
		this.bm.style.MozTransform = "rotate(" + this.dir + "deg)";
		this.bm.style.msTransform = "rotate(" + this.dir + "deg)";
		this.bm.style.top = this.y - this.bmSize / 2 + "px";
		this.bm.style.left = this.x - this.bmSize / 2 + "px";
	}
	this.drawCanvas = function() {
		// Tegn spriten på canvas
		var c=depthMap[this.depth];
		c.save();
		c.translate(this.x, this.y);
		c.globalAlpha = this.opacity;
		c.rotate(this.dir * Math.PI / 180);
		c.drawImage(this.bm, -this.xOff*this.bmSize, -this.yOff*this.bmSize, this.bmWidth*this.bmSize, this.bmHeight*this.bmSize);
		c.restore();
	}
	// Can also be called with (_prop,_options)
	this.animate = function(_prop, _to, _dur, _callback, _layer, _easing) {
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
}
