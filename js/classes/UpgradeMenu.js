/*
UpgradeMenu:
A menu for buying upgrades

Requires:
	Sprite
	TextBlock
	UpgradeIcon
	Mouse
	Shop
*/

function UpgradeMenu() {
	// Make upgrade header
	this.headerBox = new Sprite(pImg+'HeaderBox.png',9,300,55,0);
	this.headerText = new TextBlock('UPGRADES AVAILABLE:',9,0,24,600,{'font':'normal 36px Verdana','align':'center'});
	this.icons=[];

	// Always pause the game when showing the upgrade menu
	pause=1;
	
	// Function for drawing upgrade "tree"
	this.makeUpgradeTree=function (_animate) {
		var animate=_animate?_animate:0;

		while (this.icons.length>0) {
			test=this.icons[0];
			this.icons[0].remove();
			this.icons.splice(0,1);
		}
		var c=0;

		for (var i in game.upgradeTypes) {
			c++;
			var t=game.upgradeTypes[i];

			// Make category icon
			this.icons.push(new UpgradeIcon(t,0,0,10,c*100,140,animate));

			for (var ii=1; ii<5; ii++) {
				var lock=ii-player[t.lockVar]+1;
				if (lock>3) {
					break;
				}
				lock=Math.max(lock,1);

				this.icons.push(new UpgradeIcon(t,lock,ii,10,c*100,220+(ii-1)*74,animate));
			}
		}
	}

	this.resetInfo=function() {
		if (this.infoCurrent=='default') {
			return;
		}
		this.infoCurrent='default';
		this.infoHeader.setString('UPGRADES');
		this.infoText.setString('Buy different upgrades to enhance Cliff City\'s defence against the falling rocks.')
	}

	// Make info text (638)
	this.infoBox = new Sprite(pImg+'TextBox.png',9,300,568,0);
	this.infoHeader = new TextBlock(' ',10,80,510,400,{'font':'bold 14px Verdana'});
	this.infoText = new TextBlock(' ',10,80,540,440);
	this.infoCurrent='';
	this.resetInfo();
	
	// Make buttons	
	this.btnNext = new Button(10,400,710,0,'CONTINUE',function() {
		upgradeMenu.remove();
		pause=0;
		levelController.startLevel(levelController.level+1)
	});

	// Draw upgrade "tree"
	this.makeUpgradeTree(1);

	redrawStaticLayers();

	this.remove=function() {
		this.headerBox.remove();
		this.headerText.remove();
		this.infoBox.remove();
		this.infoHeader.remove();
		this.infoText.remove();
		this.btnNext.remove();

		while (this.icons.length>0) {
			this.icons[this.icons.length-1].remove();
			this.icons.splice(this.icons.length-1,1);
		}

		redrawStaticLayers();
		purge(this);
	}
}
