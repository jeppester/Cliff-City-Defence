/*
	ObjectContainer:
	An object that can contain other objects.
	Provides methods for removing automatic spawning and removement of contained objects
*/

jseCreateClass('ObjectContainer');

ObjectContainer.prototype.objectContainer = function (depth) {
	this.depth = depth !== undefined  ?  depth : undefined;
	this.children = [];
};

// Method for adding a child
ObjectContainer.prototype.addChild = function (child) {
	if (this.children === undefined) {
		this.children = [];
	}

	this.children.push(child);
	child.parent = this;

	if (child.setDepth && this.depth !== undefined) {
		child.setDepth(this.depth);
	}
	return child;
};

ObjectContainer.prototype.addChildren = function (child1, child2) {
	for (var i = 0; i < arguments.length; i ++) {
		this.addChild(arguments[i]);
	}
	return arguments;
};

ObjectContainer.prototype.insertBefore = function (insertChildren, child) {
	var arr, i;

	if (this.children === undefined) {
		this.children = [];
	}

	if (!Array.prototype.isPrototypeOf(insertChildren)) {
		arr = [];
		arr.push(insertChildren);
		insertChildren = arr;
	}

	if ((i = this.children.indexOf(child)) !== -1) {
		this.children.splice.apply(this.children, [i, 0].concat(insertChildren));
	}

	for (i = 0; i < insertChildren.length; i ++) {
		child = insertChildren[i];

		child.parent = this;
		if (child.setDepth && this.depth !== undefined) {
			child.setDepth(this.depth);
		}
	}

	return insertChildren;
};

ObjectContainer.prototype.getChildren = function () {
	return this.children !== undefined  ?  this.children : [];
};

ObjectContainer.prototype.setDepth = function (depth) {
	// Store depth and ctx in object (ctx is for improving performance)
	this.depth = depth;
	this.ctx = engine.depth[depth].ctx;

	if (this.children) {
		for (var i = 0;i < this.children.length;i ++) {
			if (this.children[i].setDepth) {
				this.children[i].setDepth(this.depth);
			}
		}
	}
};

ObjectContainer.prototype.applyToThisAndChildren = function (func) {
	func.call(this);
	if (this.children) {
		for (var i = 0;i < this.children.length;i ++) {
			this.children[i].applyToThisAndChildren(func);
		}
	}
};

// Method for removing the object and all of its children
ObjectContainer.prototype.remove = function () {
	this.removeChildren();
	jsePurge(this);
};

// Method for removing the objects children
ObjectContainer.prototype.removeChildren = function () {
	var len;

	if (this.children) {
		len = this.children.length;
		while (len --) {
			this.children[len].remove();
			this.children.splice(len, 1);
		}
	}
};

ObjectContainer.prototype.removeChild = function (child) {
	var i;

	if (this.children) {
		for (i = 0;i < this.children.length;i ++) {
			if (this.children[i] === child) {
				this.children.splice(i, 1);
			}
		}
	}
};

// Method for drawing all children
ObjectContainer.prototype.drawChildren = function () {
	var i;

	if (this.drawCanvas) {
		if (this.depth !== undefined) {
			this.drawCanvas();
		}
		else {
			console.log(this);
		}
	}

	if (this.children) {
		for (i = 0;i < this.children.length;i ++) {
			if (this.children[i].drawChildren) {
				this.children[i].drawChildren();
			}
		}
	}
};