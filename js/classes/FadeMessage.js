/*
A fading in block of text that is displayed on the screen for a limited time and then faded out

Requires:
	TextBlock
	StageController
*/

function FadeMessage() {
	// Import textblock
	importClass(this,TextBlock);

	// Enable creation with "new [Class]"
	constructIfNew(this,this.fadeMessage,arguments);
}

// Constructor
FadeMessage.prototype.fadeMessage=function(text,depth,y,spawnTime,lifeTime,addOpt) {
	this.textBlock(text,depth,300,y,600,addOpt);

	this.timeOfBirth=gameTime+spawnTime;
	this.spawned=false;
	this.timeOfDeath=gameTime+spawnTime+lifeTime-300;
	this.dead=false;

	updateObjects.onRunning[this.id]=this;
	stageController.messages[this.id]=this;
}

FadeMessage.prototype.update = function() {
	if (gameTime > this.timeOfBirth && this.spawned===false) {
		this.spawned=true;
		this.animate({bmSize:1,opacity:1},{dur:300});
	}

	if (gameTime > this.timeOfDeath && this.dead===false) {
		this.dead=true;

		// Fade out and destroy object
		this.animate({bmSize:3,opacity:0},{dur:300,callback:function() {
			delete stageController.messages[this.id];
			purge(this);
		}});
	}
}