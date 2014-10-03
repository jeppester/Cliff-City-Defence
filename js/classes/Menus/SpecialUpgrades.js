/*
SpecialUpgrades:
A menu for buying special upgrades from different city inhabitants

Requires:
	Sprite
	TextBlock
	Button
	Mouse
*/

SpecialUpgrades = function (upgrades, callback) {
	if (upgrades === undefined) {throw new Error('Missing argument: upgrades'); }
	if (callback === undefined) {throw new Error('Missing argument: callback'); }

	// Extend view
	View.Container.call(this);

	stageController.specialUpgrades = this;

	this.upgrades = upgrades;
	this.callback = callback;

	// Add static children
	this.addChildren(
		// Make characters
		this.head1 = new SpriteButton(150, 170, function () {stageController.specialUpgrades.selectUpgrade(1); }, 'Characters.FarmerHead'),
		this.head2 = new SpriteButton(300, 162, function () {stageController.specialUpgrades.selectUpgrade(2); }, 'Characters.ScientistHead'),
		this.head3 = new SpriteButton(450, 172, function () {stageController.specialUpgrades.selectUpgrade(3); }, 'Characters.WomanHead'),
		this.character1 = new View.Sprite('Characters.Farmer', 755, 395, 0),
		this.character2 = new View.Sprite('Characters.Scientist', 1355, 395, 0),
		this.character3 = new View.Sprite('Characters.Woman', 1955, 395, 0),

		// Make upgrade header
		new View.Sprite('Dialog.HeaderBox', 300, 55, 0),
		new View.TextBlock('CHOOSE A SPECIAL OFFER: ', 0, 30, 600, {'font': 'normal 30px Verdana', 'alignment': 'center'}),

		// Make textbubble with text
		new View.Sprite('Dialog.Bubble', 390, 395, 0),
		this.upgradeDesc = new View.TextBlock(' ', 307, 270, 210),

		// Make info text
		new View.Sprite('Dialog.TextBox', 300, 638, 0),
		this.upgradeName = new View.TextBlock(' ', 88, 580, 400, {'font': 'bold 14px Verdana'}),
		this.upgradeInfo = new View.TextBlock(' ', 88, 610, 450),

		// Make buttons
		new Button(400, 710, 0, 'ACCEPT OFFER', function () {
			(function () {
				this.upgrades[this.currentIndex].onBought();
				this.callback();
				engine.purge(this);
			}).call(stageController.specialUpgrades);
			delete stageController.specialUpgrades;
		}),

		// Offer choose arrows
		this.nextArrow = new SpriteButton(570, 355, function () {
			this.parent.selectUpgrade(this.parent.currentIndex + 2);
		}, 'Dialog.NextOfferArrow'),
		this.prevArrow = new SpriteButton(30, 355, function () {
			this.parent.selectUpgrade(this.parent.currentIndex);
		}, 'Dialog.NextOfferArrow')
	);

	this.prevArrow.direction = Math.PI;
	this.prevArrow.opacity = 0.4;

	engine.currentRoom.loops.eachFrame.attachFunction(this, this.keyboardControls);

	this.currentIndex = -1;
	this.selectUpgrade(1);
};

SpecialUpgrades.prototype = Object.create(View.Container.prototype);

SpecialUpgrades.prototype.keyboardControls = function () {
	if (keyboard.isPressed(KEY_RIGHT)) {
		this.selectUpgrade(this.currentIndex + 2);
	}
	if (keyboard.isPressed(KEY_LEFT)) {
		this.selectUpgrade(this.currentIndex);
	}
}

SpecialUpgrades.prototype.selectUpgrade = function (upgradeNumber) {
	var nextIndex = upgradeNumber - 1;

	// If the upgrade number is invalid, do nothing
	if (nextIndex > 2 || nextIndex < 0) {return; }

	// If the upgrade is already selected, do nothing
	if (nextIndex === this.currentIndex) {return; }

	// Set animation time based on the "distance"
	this.animTime = 500 * Math.pow(1.5, Math.abs(nextIndex - this.currentIndex) - 1);

	// Animate characters
	switch (nextIndex) {
	case 0:
		this.character1.animate({x: 155}, {duration: this.animTime});
		this.head1.animate({opacity:  0.5}, {duration: this.animTime});

		this.character2.animate({x: 755}, {duration: this.animTime});
		this.character3.animate({x: 1355}, {duration: this.animTime});
		this.head2.animate({opacity: 1}, {duration: this.animTime});
		this.head3.animate({opacity: 1}, {duration: this.animTime});

		this.nextArrow.animate({opacity: 1}, {duration: this.animTime});
		this.prevArrow.animate({opacity: 0.3}, {duration: this.animTime});
		break;
	case 1:
		this.character2.animate({x: 155}, {duration: this.animTime});
		this.head2.animate({opacity:  0.5}, {duration: this.animTime});

		this.character1.animate({x: - 445}, {duration: this.animTime});
		this.character3.animate({x: 755}, {duration: this.animTime});
		this.head1.animate({opacity: 1}, {duration: this.animTime});
		this.head3.animate({opacity: 1}, {duration: this.animTime});

		this.nextArrow.animate({opacity: 1}, {duration: this.animTime});
		this.prevArrow.animate({opacity: 1}, {duration: this.animTime});
		break;
	case 2:
		this.character3.animate({x: 155}, {duration: this.animTime});
		this.head3.animate({opacity:  0.5}, {duration: this.animTime});

		this.character1.animate({x: - 1045}, {duration: this.animTime});
		this.character2.animate({x: - 445}, {duration: this.animTime});
		this.head1.animate({opacity: 1}, {duration: this.animTime});
		this.head2.animate({opacity: 1}, {duration: this.animTime});

		this.nextArrow.animate({opacity: 0.3}, {duration: this.animTime});
		this.prevArrow.animate({opacity: 1}, {duration: this.animTime});
		break;
	}

	// Update text
	this.upgradeDesc.animate({opacity: 0}, {duration: this.animTime / 2, callback: function () {
		(function () {
			this.upgradeDesc.string = this.upgrades[this.currentIndex].desc;
			this.upgradeDesc.animate({opacity: 1}, {duration: this.animTime / 2});
		}).call(stageController.specialUpgrades);
	}});
	this.upgradeInfo.animate({opacity: 0}, {duration: this.animTime / 2, callback: function () {
		(function () {
			this.upgradeInfo.string = this.upgrades[this.currentIndex].info;
			this.upgradeInfo.animate({opacity: 1}, {duration: this.animTime / 2});
		}).call(stageController.specialUpgrades);
	}});
	this.upgradeName.animate({opacity: 0}, {duration: this.animTime / 2, callback: function () {
		(function () {
			this.upgradeName.string = this.upgrades[this.currentIndex].name + ": ";
			this.upgradeName.animate({opacity: 1}, {duration: this.animTime / 2});
		}).call(stageController.specialUpgrades);
	}});
	this.currentIndex = nextIndex;
};
