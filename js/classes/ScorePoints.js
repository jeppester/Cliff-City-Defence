/*
ScorePoints:
The flying points that appear when the player gains points.

Requires:
	TextBlock
	Sprite
	Animator
	Player
*/

function ScorePoints () {
	// Import textblock
	importClass(this,TextBlock);

	constructIfNew(this,this.scorePoints,arguments);
}

ScorePoints.prototype.scorePoints=function(points,_x,_y) {
	this.points=points?points:0;

	//Inherit from textblock
	this.textBlock("+"+this.points.toString()+"$",10,_x,_y,200,{'font':'bold 30px Verdana','align':'right','xOff':200,'yOff':40,'bmSize':0,'fillStyle':'#ff2200'});
	
	this.animate({'x':590,'y':700,'bmSize':1},{'dur':300,'easing':'quadOut','callback':function () {
		player.addPoints(this.points);
		
		this.animate({'opacity':0},{'dur':1000,'easing':'linear','callback':function () {
			this.remove();
		}});
	}});
}
