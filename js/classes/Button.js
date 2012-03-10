/*
Button:
A simple button with a custom function for handling a click

Requires:
	Sprite
	Mouse
	TextBlock
*/

function Button(_depth,_x,_y,_dir,_text,_onClick) {
	//Extend Sprite
	Sprite.call(this, 'img/nonScalable/Button.png', _depth, _x, _y, _dir);
	
	if (!_onClick || !_text) {return false;}
	this.onClick=_onClick;
	this.textBlock=new TextBlock(_text,_depth,this.x-108,this.y-13,217,{'font':'16px Verdana','lineHeight':20,'align':'center'});
	
	this.update='onPaused';
	updateObjects[this.update][this.id]=this;
	
	this.remove = function() {
		purge(this);
		purge(this.textBlock);
	}
	
	this.update = function() {
		//Check for hover and click
		if (Math.abs(mouse.x-this.x)<84 && Math.abs(mouse.y-this.y)<27) {
			if (mouse.isPressed(1)) {
				this.onClick();
			}
			this.bm=loader.images['img/nonScalable/ButtonSelected.png'];
		} else {
			this.bm=loader.images['img/nonScalable/Button.png'];
		}
	}
}
