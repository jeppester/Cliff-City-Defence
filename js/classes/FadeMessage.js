/*
A fading in block of text that is displayed on the screen for a limited time and then faded out

Requires:
	TextBlock
	StageController
*/

jseCreateClass('FadeMessage');
jseExtend(FadeMessage, TextBlock);

// Constructor
FadeMessage.prototype.fadeMessage = function (text, y, spawnTime, lifeTime, addOpt) {
	engine.addActivityToLoop(this, this.update, 'onRunning');
	this.loop = engine.loops.onRunning;

	this.textBlock(text, 300, y, 600, addOpt);
	this.timeOfBirth = this.loop.time + spawnTime;
	this.spawned = false;
	this.timeOfDeath = this.loop.time + spawnTime + lifeTime - 300;
	this.dead = false;

	stageController.messages[this.id] = this;
};

FadeMessage.prototype.update = function () {
	if (this.loop.time > this.timeOfBirth && this.spawned === false) {
		this.spawned = true;
		this.animate({bmSize: 1, opacity: 1}, {dur: 300});
	}

	if (this.loop.time > this.timeOfDeath && this.dead === false) {
		this.dead = true;

		// Fade out and destroy object
		this.animate({bmSize: 3, opacity: 0}, {dur: 300, callback: function () {
			delete stageController.messages[this.id];
			jsePurge(this);
		}});
	}
};