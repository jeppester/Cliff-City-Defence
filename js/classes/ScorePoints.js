/*
ScorePoints:
The flying points that appear when the player gains points.

Requires:
	TextBlock
	Sprite
	Animator
	Player
*/

ScorePoints = function (points, _x, _y) {
	this.points = points ? points: 0;

	// Inherit from View.TextBlock
	View.TextBlock.call(this, "+" + this.points.toString() + "$", _x, _y, 200, {'font': 'bold 30px Verdana', 'alignment': 'right', offset: new Math.Vector(200, 40), 'size': 0, 'color': '#ff2200'});

	this.animate({'x': 590, 'y': 700, 'size': 1}, {'dur': 300, 'easing': 'quadOut', 'callback': function () {
		if (typeof player !== "undefined") {
			player.addPoints(this.points);
		}

		this.animate({'opacity': 0}, {'dur': 1000, 'easing': 'linear', 'callback': function () {
			engine.purge(this);
		}});
	}});
};

ScorePoints.prototype = Object.create(View.TextBlock.prototype);
