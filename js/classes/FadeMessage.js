/*
A fading in block of text that is displayed on the screen for a limited time and then faded out

Requires:
	TextBlock
	StageController
*/

// Constructor
FadeMessage = function (text, y, spawnTime, lifeTime, additionalProperties) {
	engine.currentRoom.loops.onRunning.attachFunction(this, this.update);
	this.loop = engine.currentRoom.loops.onRunning;

	View.TextBlock.call(this, text, 0, y, 600, additionalProperties);
	this.timeOfBirth = this.loop.time + spawnTime;
	this.spawned = false;
	this.timeOfDeath = this.loop.time + spawnTime + lifeTime - 300;
	this.dead = false;

	stageController.messages[this.id] = this;
};

FadeMessage.prototype = Object.create(View.TextBlock.prototype);

FadeMessage.prototype.update = function () {
	if (this.loop.time > this.timeOfBirth && this.spawned === false) {
		this.spawned = true;
		this.animate({opacity: 1}, {duration: 300});
	}

	if (this.loop.time > this.timeOfDeath && this.dead === false) {
		this.dead = true;

		// Fade out and destroy object
		this.animate({opacity: 0}, {duration: 300, callback: function () {
			delete stageController.messages[this.id];
			engine.purge(this);
		}});
	}
};
