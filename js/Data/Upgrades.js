// Upgrades
data.upgradeTypes = [

	// Weapon upgrades
	{
		name: 'Building weapons',
		description: 'Enable your buildings to defend themselves with automatic weapons.\nEach purchased upgrade will be available as a building enhancement.',
		folder: 'Weapons',
		lockVar: 'weaponsAvailable',
		upgrades: [
			{
				name: 'Heavy rifle',
				price: '3000',
				shopPrice: '1000',
				description: 'A heavy rifle capable of damaging rocks.',
				onBought: function () {
					this.setGun(1);
				},
			},
			{
				name: 'Minigun',
				price: '8000',
				shopPrice: '2000',
				description: 'A fully automatic machine gun capable of shooting barrages of light ammunition.',
				onBought: function () {
					this.setGun(2);
				},
			},
			{
				name: 'Rocket launcher',
				price: '14000',
				shopPrice: '4000',
				description: 'Fires highly explosive shells with a blast range.',
				onBought: function () {
					this.setGun(3);
				},
			},
			{
				name: 'Laser beamer',
				price: '20000',
				shopPrice: '8000',
				description: 'High powered laser beamer. Hits instantly with a very powerfull laser beam, that will wipe out most rocks..',
				onBought: function () {
					this.setGun(4);
				},
			},
		]
	},
	
	// Shield upgrades
	{
		name: 'Building shielding',
		description: "Buy different types of shielding for Cliff City\'s buildings.\nEach purchased upgrade will be available in the shop.",
		folder: 'Shields',
		lockVar: 'shieldsAvailable',
		upgrades: [
			{
				name: 'Tree shielding',
				price: '2000',
				shopPrice: '1000',
				description: 'Very weak but yet useable shielding.',
				onBought: function () {
					this.setShield(1);
				},
			},
			{
				name: 'Rock shielding',
				price: '4000',
				shopPrice: '1500',
				description: 'Slighty stronger than tree shielding.',
				onBought: function () {
					this.setShield(2);
				},
			},
			{
				name: 'Metal shielding',
				price: '12000',
				shopPrice: '2500',
				description: 'Strong shielding. Can take much damage.',
				onBought: function () {
					this.setShield(3);
				},
			},
			{
				name: 'Kryptonite shielding',
				price: '20000',
				shopPrice: '5000',
				description: 'Very strong shielding. Capable of resisting even the toughest rocks.',
				onBought: function () {
					this.setShield(4);
				},
			},
		]
	},

	// Blast range upgrades
	{
		name: 'Rocket Blast Ranges',
		description: 'Make the main cannon\'s rockets more deadly by upgrading their blast ranges.\nEach upgrade permanently increases all rocket\'s blast range.',
		folder: 'BlastRanges',
		lockVar: 'rocketBlastRangeLevel',
		upgrades: [
			{
				name: 'Small blast range',
				price: '3000',
				description: 'Improve the main cannon\'s rockets with a noticable but not very effective blast range.',
			},
			{
				name: 'Medium blast range',
				price: '6000',
				description: 'Improve the rockets\' blast range to a useable level.',
			},
			{
				name: 'Large blast range',
				price: '15000',
				description: 'Improve the rockets\' blast range to make them very effective against groups of rocks.',
			},
			{
				name: 'Enormeous blast range',
				price: '30000',
				description: 'Improve the rockets\' blast range to the max!',
			},
		]
	},

	// Firepower upgrades
	{
		name: 'Rocket firepower upgrades',
		description: 'Make the rocket cannons rocket\'s cause more damage to the rocks.',
		folder: 'FirePower',
		lockVar: 'rocketFirePowerLevel',
		upgrades: [
			{
				name: 'Drill rockets.',
				price: '4000',
				description: 'Upgrade to drill rockets. Increases rockets\' damage to rocks.',
			},
			{
				name: 'Fire rockets',
				price: '7000',
				description: 'Upgrade to fire rockets. Increases rocket\'s damage to rocks.',
			},
			{
				name: 'Electrical rockets',
				price: '15000',
				description: 'Upgrade to electrical rockets. Increases rocket\'s damage to rocks.',
			},
			{
				name: 'Nuclear rockets',
				price: '30000',
				description: 'Upgrade to nuclear rockets. Increases rocket\'s damage to rocks.',
			},
		]
	},

	// Ai gun aim upgrades
	{
		name: 'AI gun intelligens upgrades',
		description: 'Make the AI guns aim better',
		folder: 'AiGunAim',
		lockVar: 'weaponIntelligence',
		upgrades: [
			{
				name: 'Better idle position',
				price: '5000',
				description: 'Makes AI guns return to an optimal idle position when there are no targets.',
			},
			{
				name: 'Intelligent aim',
				price: '12000',
				description: 'Makes AI guns aware of the targetted rocks\' movement when aiming',
			},
			{
				name: 'Use the best target',
				price: '6000',
				description: 'Lets AI guns choose a better target, if the current target is moving away from the cannon.',
			},
			{
				name: 'AI gun collaboration',
				price: '6000',
				description: 'Lets AI guns collaborate better when choosing targets.',
			},
		]
	},
];

/* SPECIAL UPGRADES */
data.specialUpgrades = [
	[
		{
			"name": "Harvester",
			"info": "10% extra money from all rocks",
			"desc": "Hi Cliffy\n\nI've rebuild my harvester!\n\nIt can now harvest the small rock pieces that we would else not benefit from.\n\nWith this machine we can earn a little extra money from all rocks!",
			"onBought": function () {
				player.rockValueFactorRocket *= 1.10;
				player.rockValueFactorAiGun *= 1.10;
			},
		},
		{
			"name": "Efficient rockets",
			"info": "25% extra money from rocks shot by the main cannon",
			"desc": "Hello Mr. Cliff\n\nMy latest invention \"Ultra efficient stone explosives\" will greatly increase the amount of rock that is left after a rock has been safely neutralized by a rocket.\n\nMore rock lefterovers of course equals more money in the bank",
			"onBought": function () {
				player.rockValueFactorRocket *= 1.25;
			},
		},
		{
			"name": "Efficient guns",
			"info": "25% extra money from rocks shot by ai guns",
			"desc": "Hello Mayor!\n\nIf you can ensure me, that we are going to use excessive amounts of ammunition, I can make a deal with Guns'&'Fun that will make ammunition cheaper.",
			"onBought": function () {
				player.rockValueFactorAiGun *= 1.25;
			},
		},
	],
	[
		{
			"name": "Bouncing rockets",
			"info": "Rockets will bounce on the first cliff they hit",
			"desc": "",
			"onBought": function () {
				player.rocketBounces = 1;
			},
		},
		{
			"name": "Faster rockets",
			"info": "20% faster rockets",
			"desc": "",
			"onBought": function () {
				player.rocketSpeedFactor *= 1.2;
			},
		},
		{
			"name": "Faster rocket reload",
			"info": "25% faster rocket reload",
			"desc": "",
			"onBought": function () {
				player.rocketReloadTime *= 0.75;
			},
		},
	],
	[
		{
			"name": "Automatic shield repair",
			"info": "Building shields will automatically be repaired",
			"desc": "",
			"onBought": function () {
				player.shieldAutoRepair = 1;
			},
		},
		{
			"name": "AI firmware upgrade",
			"info": "Better ai gun aim",
			"desc": "",
			"onBought": function () {
				// TODO!
				//player.aiGunAimLevel = 1;
			},
		},
		{
			"name": "Cheaper building enhancements",
			"info": "20% cheaper building enhancements",
			"desc": "",
			"onBought": function () {
				player.buildingEnhancementPriceFactor *= 0.8;
			},
		},
	],
	[
		{
			"name": "Fully automatic main cannon",
			"info": "No need to click anymore",
			"desc": "",
			"onBought": function () {
				player.cannonAutomatic = 1;
			},
		},
		{
			"name": "Multiload madness",
			"info": "Enables the main cannon to fire multiple rockets simultaneously",
			"desc": "",
			"onBought": function () {
				player.rocketMultiLoad = 1;
			},
		},
		{
			"name": "AI guns Mk. II",
			"info": "From now on ai guns will come with a bronze star",
			"desc": "",
			"onBought": function () {
				player.aiGunInitialLevel = 1;
			},
		},
	],
	[
		{
			"name": "Shield all buildings",
			"info": "Enhance all buildings with the second best shield that you have access to.\nIf you do not have access to any shields, woodend shields will be installed.",
			"desc": "",
			"onBought": function () {
				var shieldLevel = Math.max(1, player.shieldsAvailable - 1),
					building,
					i;

				for (i = 0; i < stageController.buildings.length; i++) {
					building = stageController.buildings[i];

					if (building.life) {
						building.setShield(shieldLevel);
					}
				}
			},
		},
		{
			"name": "Arm all buildings",
			"info": "Enhance all buildings with the second best ai gun that you have access to.\nIf you do not have access to any ai guns, rock rifles will be installed.",
			"desc": "",
			"onBought": function () {
				var gunLevel = Math.max(1, player.weaponsAvailable - 1),
					building,
					i;

				for (i = 0; i < stageController.buildings.length; i++) {
					building = stageController.buildings[i];

					if (building.life) {
						building.setGun(gunLevel);
					}
				}
			},
		},
		{
			"name": "Repair / Rebuild all buildings",
			"info": "All buildings will be repaired / rebuild",
			"desc": "",
			"onBought": function () {
				var i,
					building;

				for (i = 0; i < stageController.buildings.length; i++) {
					building = stageController.buildings[i];
					building.setLife(2);
				}
			},
		},
	],
];