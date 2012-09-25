jseCreateClass('Cloud');
jseExtend(Cloud, GameObject);

Cloud.prototype.cloud = function () {
	this.gameObject('Backgrounds.Cloud', Math.random() * engine.canvasResX, 50 + Math.random() * 100, 0, {'dX': 5 + Math.random() * 10, 'dY': 0});

	engine.addActivityToLoop(this, this.checkOutside, 'eachFrame');

	this.bmWidth *=  0.7 + Math.random() *  0.3;
	this.bmHeight *=  0.7 + Math.random() *  0.3;
};

Cloud.prototype.checkOutside = function () {
	if (this.x > engine.canvasResX + this.bmWidth / 2) {
		this.x = 0;
	}
};