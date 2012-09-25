/*
Player:
The object containing all player related vars, for instance points and permanent upgrades.

Requires:
	TextBlock
	Animator
	Sprite
 */

jseCreateClass('Player');

Player.prototype.player = function () {
	// Set player points and stats
	this.points = 0;

	this.pointsTotal = 0;
	this.rocksDestroyed = 0;
	this.buildingsLost = 0;
	this.buildingsDamaged = 0;
	this.weaponsBought = 0;
	this.shieldsBought = 0;

	// Set main upgrade vars
	this.shieldsAvailable = 0;
	this.weaponsAvailable = 0;
	this.weaponIntelligence = 0;
	this.rocketBlastRangeLevel = 0;
	this.rocketFirePowerLevel = 0;

	// Special offer 1
	this.rockValueFactorRocket = 1;
	this.rockValueFactorAiGun = 1;

	// Special offer 2
	this.rocketBounces = 0;
	this.rocketSpeedFactor = 1;
	this.rocketReloadTime = 700;

	// Special offer 3
	this.shieldAutoRepair = 0;
	// this.aiGunAimLevel = 0;
	this.buildingEnhancementPriceFactor = 1;

	// Special offer 4
	this.cannonAutomatic = 0;
	this.rocketMultiLoad = 0;
	this.aiGunInitialLevel = 0;

	// Make in - game score
	this.inGameScore = new TextBlock(this.points.toString() + "$", 590, 740, 200, {'font': 'bold 30px Verdana', 'align': 'right', 'xOff': 200, 'yOff': 40, 'fillStyle': '#ff2200'});
	engine.depth[8].addChild(this.inGameScore);

	this.addPoints = function (points) {
		this.points += points;
		this.pointsTotal += Math.max(0, points);
		this.inGameScore.setString(this.points.toString() + "$");
	};
};