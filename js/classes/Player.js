/*
Player:
The object containing all player related vars, for instance points and permanent upgrades.

Requires:
	TextBlock
	Animator
	Sprite
*/

function Player() {
	this.points=0;
	this.pointsTotal=0;
	
	this.shieldsAvailable=0;
	this.weaponsAvailable=0;
	this.weaponIntelligence=0;
	
	this.cannonDmgLevel=0;
	this.blastRangeLevel=0;
	
	//Make in-game score
	this.inGameScore=new TextBlock(this.points.toString()+"$",10,590,740,200,{'font':'bold 30px Verdana','align':'right','xOff':200,'yOff':40,'fillStyle':'#ff2200'});
	
	this.addPoints=function(points) {
		this.points+=points;
		this.pointsTotal+=points;
		this.inGameScore.setString(this.points.toString()+"$");
	}
}