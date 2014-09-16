Cloud = function () {
	View.GameObject.call(this, 'Backgrounds.Cloud', Math.random() * engine.canvasResX, 50 + Math.random() * 100, 0, {offset: new Math.Vector(5 + Math.random() * 10, 0)});

	engine.currentRoom.loops.eachFrame.attachFunction(this, this.checkOutside);

	this.size *=  0.7 + Math.random() *  0.3;
	this.speed.x = 10 + Math.random() * 5;
};

Cloud.prototype = Object.create(View.GameObject.prototype);

Cloud.prototype.checkOutside = function () {
	if (this.x > engine.canvasResX + this.bm.width / 2) {
		this.x = 0;
	}
};
