/*
Button:
A simple button with a custom function for handling a click

Requires:
	Sprite
	Mouse
	TextBlock
*/

function Button() {
	// Import sprite
	importClass(this,Sprite);

	constructIfNew(this,this.button,arguments);
}

// Constructor
Button.prototype.button=function(_depth,_x,_y,_dir,_text,_onClick) {
	// Extend Sprite
	this.sprite(pImg+'Button.png', _depth, _x, _y, _dir);

	this.disabled=false;
	
	if (!_onClick || !_text) {return false;}
	this.onClick=_onClick;
	this.textBlock=this.addChild(new TextBlock(_text,_depth,this.x-108,this.y-13,217,{'font':'16px Verdana','lineHeight':20,'align':'center'}));
		
	updateObjects['onPaused'][this.id]=this;
	updateObjects['onRunning'][this.id]=this;
}

Button.prototype.enable = function() {
	this.disabled=false;
}

Button.prototype.disable = function() {
	this.disabled=true;
}

Button.prototype.update = function() {
	this.textBlock.x=this.x-108;
	this.textBlock.y=this.y-13;
	this.textBlock.opacity=this.opacity;

	if (this.disabled) {
		this.bm=loader.images[pImg+'ButtonDisabled.png'];
		return;
	}

	//Check for hover and click
	if (Math.abs(mouse.x-this.x)<84 && Math.abs(mouse.y-this.y)<27) {
		if (mouse.isPressed(1)) {
			this.onClick();
		}
		this.bm=loader.images[pImg+'ButtonSelected.png'];
	} else {
		this.bm=loader.images[pImg+'Button.png'];
	}
}