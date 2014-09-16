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

UpgradeMenu = function (onContinue) {
	// Extend view
	View.Container.call(this);

	// Make upgrade header
	this.headerBox = new View.Sprite('Dialog.HeaderBox', 300, 55, 0);
	this.headerText = new View.TextBlock('UPGRADES AVAILABLE: ', 0, 24, 600, {'font': 'normal 36px Verdana', 'alignment': 'center'});
	this.icons = [];
	this.onContinue = onContinue ? onContinue: function () {};
	this.iconSelected = false;

	// Make info text
	this.infoBox = new View.Sprite('Dialog.TextBox', 300, 568, 0);
	this.infoHeader = new View.TextBlock(' ', 80, 510, 400, {'font': 'bold 14px Verdana'});
	this.infoText = new View.TextBlock(' ', 80, 540, 440);
	this.infoCurrent = '';

	// Make buy button
	this.btnBuy = new Button(300, 628, 0, 'BUY UPGRADE', function () {
		var upgrade = this.parent.iconSelected;
		player[upgrade.upgradeType.lockVar] ++;
		player.addPoints(-upgrade.upgradeType.upgrades[upgrade.level - 1].price);

		this.parent.makeUpgradeTree();
		this.parent.resetInfo();
	}, {opacity: 0});

	// Make next button
	this.btnNext = new Button(300, 710, 0, 'CONTINUE', function () {
		pause = 0;
		this.parent.onContinue();
		this.parent.remove();
	});

	this.addChildren(this.headerBox, this.headerText, this.infoBox, this.infoHeader, this.infoText, this.btnBuy, this.btnNext);

	// Draw upgrade "tree"
	this.makeUpgradeTree(1);
	this.resetInfo();

	engine.redraw(1);
};

UpgradeMenu.prototype = Object.create(View.Container.prototype);

// Function for drawing upgrade "tree"
UpgradeMenu.prototype.makeUpgradeTree = function (_animate) {
	var animate, c, t, i, ii, lock;

	animate = _animate ? _animate : 0;

	while (this.icons.length > 0) {
		this.icons[0].remove();
		this.icons.splice(0, 1);
	}
	c = 0;

	for (i in data.upgradeTypes) {
		if (data.upgradeTypes.hasOwnProperty(i)) {
			c ++;
			t = data.upgradeTypes[i];

			// Make category icon
			this.icons.push(new UpgradeIcon(t, 0, 0, c * 100, 140, animate));

			for (ii = 1; ii < 5; ii ++) {
				if (t.lockVar) {
					lock = ii - player[t.lockVar] + 1;
					if (lock > 3) {
						break;
					}
					lock = Math.max(lock, 1);
				}
				else {
					lock = 2;
				}

				this.icons.push(new UpgradeIcon(t, lock, ii, c * 100, 220 + (ii - 1) * 74, animate));
			}
		}
	}

	this.addChildren.apply(this, this.icons);
};

UpgradeMenu.prototype.resetInfo = function () {
	if (this.infoCurrent === 'default') {
		return;
	}
	this.infoCurrent = 'default';
	this.infoHeader.string = 'UPGRADES';
	this.infoText.string = 'Click on an update see a description of it.\nTo purchase an upgrade, click the "BUY" - button below it\'s description. You can only purchase an upgrade if you have enough game points.';
	this.iconSelected = false;
	this.btnBuy.disable();
	this.btnBuy.animate({opacity: 0}, {duration: 200});
};
