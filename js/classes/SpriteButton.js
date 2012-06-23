function SpriteButton() {
	// Import Sprite
	importClass(this,Sprite);

	// Enable creation with "new [Class]"
	constructIfNew(this,this.spriteButton,arguments);
}

SpriteButton.prototype.spriteButton=function(x, y, depth, onClick, sprite1, sprite2) {
	if (x===undefined) {throw new error('Argument missing: x')}
	if (y===undefined) {throw new error('Argument missing: y')}
	if (depth===undefined) {throw new error('Argument missing: depth')}
	if (sprite1===undefined) {throw new error('Argument missing: sprite1')}
	if (onClick===undefined) {throw new error('Argument missing: onClick')}

	this.sprite(sprite1,depth,x,y,0);
	
	this.disabled=false;

	updateObjects.onRunning[this.id]=this;
	updateObjects.onPaused[this.id]=this;

	this.onClick=onClick;	
	this.fg = sprite2===undefined ? false : this.addChild(new Sprite(sprite2,depth,x,y,0));
}

SpriteButton.prototype.enable = function() {
	this.disabled=false;
}

SpriteButton.prototype.disable = function() {
	this.disabled=true;
}

SpriteButton.prototype.update = function() {
	if (this.fg) {
		this.fg.x=this.x;
		this.fg.y=this.y;
		this.fg.opacity=this.opacity;
	}

	if (this.disabled) {
		return;
	}

	//Check for hover and click
	var sprX=this.x-this.xOff,
		sprY=this.y-this.yOff;

	if (mouse.x>sprX && mouse.x<sprX+this.bmWidth && mouse.y>sprY && mouse.y<sprY+this.bmHeight) {
		if (mouse.isPressed(1)) {
			this.onClick(1);
		}
		if (mouse.isPressed(3)) {
			this.onClick(3);
		}
	}
}