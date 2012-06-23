/*
	ObjectContainer:
	An object that can contain other objects.
	Provides methods for removing automatic spawning and removement of contained objects
*/

function ObjectContainer() {
	this.children=[];
}

// Method for adding a child
ObjectContainer.prototype.addChild=function(child) {
	this.children.push(child);
	return child;
}

// Method for removing the object and all of its children
ObjectContainer.prototype.remove=function() {
	this.removeChildren();
	purge(this);
}

// Method for removing the objects children
ObjectContainer.prototype.removeChildren=function() {
	while (this.children.length>0) {
		this.children[this.children.length-1].remove();
		this.children.pop();
	}
}