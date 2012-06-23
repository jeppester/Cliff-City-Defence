/*
Shield:
Building shield.

Requires;
    Sprite
    Animator
    Loader
*/

function Shield(_building,_x,_y) {
	// Import sprite
	importClass(this,Sprite);

	if (_building==undefined || _x===undefined || _y===undefined) {
		throw new Error('Arguments: building, type, x or y missing');
		return false;
	}
	this.enabled=false;
	this.type=0;
	this.building=_building;
	_spr=pImg+'Building'+this.building+'Shield1.png';
	
	// Extent sprite
	this.sprite(_spr, 4, _x, _y, 0,{'bmSize':0});
	
	this.disable=function() {
		this.animate({bmSize:2,opacity:0},{dur:300});
		this.enabled=false;
	};

	this.set=function(type) {
		this.type=type;

		if (this.type==0) {
			this.disable();
			return;
		}
	
		// Set shield offset
		switch (this.type) {
		case 1:
			this.life=100
			switch (this.building) {
			case 1:
				this.xOff=39;
				this.yOff=37;
			break;
			case 2:
				this.xOff=39
				this.yOff=47;
			break;
			case 3:
				this.xOff=38
				this.yOff=43;
			break;
			case 4:
				this.xOff=36
				this.yOff=35;
			break;
			case 5:
				this.xOff=28
				this.yOff=48;
			break;
			case 6:
				this.xOff=27
				this.yOff=40;
			break;
			}
		break;
		case 2:
			this.life=250
			switch (this.building) {
			case 1:
				this.xOff=37
				this.yOff=35;
			break;
			case 2:
				this.xOff=43
				this.yOff=45;
			break;
			case 3:
				this.xOff=42
				this.yOff=44;
			break;
			case 4:
				this.xOff=37
				this.yOff=32;
			break;
			case 5:
				this.xOff=25
				this.yOff=48;
			break;
			case 6:
				this.xOff=31
				this.yOff=38;
			break;
			}
		break;
		case 4:
			this.life=800
		case 3:
			this.life=500
			switch (this.building) {
			case 1:
				this.xOff=32;
				this.yOff=35;
			break;
			case 2:
				this.xOff=38;
				this.yOff=45;
			break;
			case 3:
				this.xOff=35;
				this.yOff=34;
			break;
			case 4:
				this.xOff=37;
				this.yOff=34;
			break;
			case 5:
				this.xOff=22;
				this.yOff=46;
			break;
			case 6:
				this.xOff=24;
				this.yOff=35;
			break;
			}
		break;
		}
		
		this.enabled=true;
		this.bm.src=loader.images[pImg+'Building'+this.building+'Shield'+this.type+'.png'].src;
		this.bmWidth=this.bm.width;
		this.bmHeight=this.bm.height;
		this.bmSize=0;
		this.animate({bmSize:1},{dur:300});
	}
}
