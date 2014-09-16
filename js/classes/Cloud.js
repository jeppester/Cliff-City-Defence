Cloud = function () {
	View.GameObject.call(this, 'Backgrounds.Cloud', Math.random() * engine.canvasResX, 50 + Math.random() * 100, 0);

	engine.currentRoom.loops.eachFrame.attachFunction(this, this.checkOutside);

	this.size *=  0.7 + Math.random() *  0.3;
	this.speed.x = -5 - Math.random() * 10;
};

Cloud.prototype = Object.create(View.GameObject.prototype);

Cloud.prototype.checkOutside = function () {
	if (this.x < -this.bm.width / 2) {
		this.x = engine.canvasResX + this.bm.width / 2;
	}
};
