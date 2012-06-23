/*
TextBlock:
A block of text with a limited width

No requirements
*/

function TextBlock() {
	// Import class
	importClass(this,Animation);
	importClass(this,ObjectContainer);

	constructIfNew(this,this.textBlock,arguments);
}

// Constructor
TextBlock.prototype.textBlock=function(_string, _depth, _x, _y, _width, _addOpt) {
	if (_x===undefined || _y===undefined || !_string || _depth===undefined || !_width) {
		return false;
	}

	this.x = _x;
	this.y = _y;
	this.string=_string;
	this.width=_width;
	this.depth = _depth ? _depth : 0;
	
	//Load default options
	this.font='normal 14px Verdana';
	this.align='left';
	this.xOff=0;
	this.yOff=0;
	this.fillStyle="#000000";
	this.opacity=1;
	this.bmSize=1;
	
	//Load additional options
	copyVars(_addOpt,this);
	this.lineHeight=this.lineHeight?this.lineHeight:this.font.match(/[.0-9]+/)*1.25;
	
	this.lines=[];
	this.lineWidth=[];
	this.cache=document.createElement('canvas');
	this.cacheCtx=this.cache.getContext('2d');
	this.cache.width=this.width;
	this.cache.height=1000;
	this.id = "obj" + curId;
	curId++;
	depth[this.depth][this.id] = this;
	this.stringToLines();
	this.cacheRendering();
}

TextBlock.prototype.setString=function(_str) {
	this.string=_str;
	this.stringToLines();
	this.cacheRendering();
}

TextBlock.prototype.cacheRendering=function() {
	this.cacheCtx.clearRect(0,0,this.cache.width,this.cache.height);
	this.cacheCtx.font=this.font;
	this.cacheCtx.fillStyle=this.fillStyle;
	for (var i=0; i < this.lines.length; i++) {
		var xOffset=0;
		
		switch (this.align) {
		case 'left':
			xOffset=0;
		break;
		case 'right':
			xOffset=this.width-this.lineWidth[i];
		break;
		case 'center':
			xOffset=(this.width-this.lineWidth[i]) / 2;
		break;
		}
		
		if (this.lines[i]) {
			this.cacheCtx.fillText(this.lines[i], xOffset, this.lineHeight * (1+i));
		}
	}
}

TextBlock.prototype.drawCanvas = function() {
	//Tegn spriten på canvas
	var c = depthMap[this.depth];
	c.save();
	c.translate(this.x, this.y);
	c.globalAlpha = this.opacity;
	c.drawImage(this.cache, -this.xOff*this.bmSize, -this.yOff*this.bmSize, this.cache.width*this.bmSize, this.cache.height*this.bmSize);
	c.restore();
}

TextBlock.prototype.stringToLines = function () {
	var lt=document.createElement('span');
	lt.style.font=this.font;
	lt.style.visibility='hidden';
	document.body.appendChild(lt);

	var line=0;
	this.lines[line]='';
	
	var paragraphs = this.string.split("\n");

	for (var pid=0; pid < paragraphs.length; pid++) {
		var words = paragraphs[pid].split(' ');

		for (var wid=0; wid < words.length; wid++) {
			var word=words[wid];

			lt.innerHTML += word+" ";
			if (lt.offsetWidth > this.width) {
				line++;
				this.lines[line]='';
				lt.innerHTML='';
				lt.innerHTML += word+" ";
			}
			else {
				this.lineWidth[line] = lt.offsetWidth;
			}
			
			this.lines[line] += word+" ";
		}
		
		line++;
		lt.innerHTML='';
		this.lines[line]='';
	}
	lt.parentNode.removeChild(lt);
}