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
				}
			},
			{
				name: 'Minigun',
				price: '8000',
				shopPrice: '2000',
				description: 'A fully automatic machine gun capable of shooting barrages of light ammunition.',
				onBought: function () {
					this.setGun(2);
				}
			},
			{
				name: 'Rocket launcher',
				price: '14000',
				shopPrice: '4000',
				description: 'A rocket launcher which fires explosive shells.',
				onBought: function () {
					this.setGun(3);
				}
			},
			{
				name: 'Laser beamer',
				price: '20000',
				shopPrice: '8000',
				description: 'High powered laser beamer. Hits instantly with a very powerfull laser beam, which will wipe out most rocks..',
				onBought: function () {
					this.setGun(4);
				}
			},
		]
	},
	
	// Shield upgrades
	{
		name: 'Building shields',
		description: "Buy different types of shielding for Cliff City\'s buildings.\nEach purchased upgrade will be available in the shop.",
		folder: 'Shields',
		lockVar: 'shieldsAvailable',
		upgrades: [
			{
				name: 'Tree shield',
				price: '2000',
				shopPrice: '1000',
				description: 'Very weak but useable shield.',
				onBought: function () {
					this.setShield(1);
				}
			},
			{
				name: 'Rock shielding',
				price: '4000',
				shopPrice: '1500',
				description: 'Slighty stronger than tree shield.',
				onBought: function () {
					this.setShield(2);
				}
			},
			{
				name: 'Metal shielding',
				price: '12000',
				shopPrice: '2500',
				description: 'Strong shield. Can take much damage.',
				onBought: function () {
					this.setShield(3);
				}
			},
			{
				name: 'Kryptonite shielding',
				price: '20000',
				shopPrice: '5000',
				description: 'Very strong shield. Capable of resisting some of the toughest rocks.',
				onBought: function () {
					this.setShield(4);
				}
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
				description: 'Improves the rockets to have a very small blast range, letting them push and damage multiple rocks'
			},
			{
				name: 'Medium blast range',
				price: '6000',
				description: 'Improve blast range of the rockets to a useable level.'
			},
			{
				name: 'Large blast range',
				price: '15000',
				description: 'Improve blast range of the rockets to make them effective against groups of rocks.'
			},
			{
				name: 'Enormeous blast range',
				price: '30000',
				description: 'Highest blast range available!'
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
				description: 'Upgrade to drill rockets. Increases rockets\' damage to rocks.'
			},
			{
				name: 'Fire rockets',
				price: '7000',
				description: 'Upgrade to fire rockets. Increases rocket\'s damage to rocks.'
			},
			{
				name: 'Electrical rockets',
				price: '15000',
				description: 'Upgrade to electrical rockets. Increases rocket\'s damage to rocks.'
			},
			{
				name: 'Nuclear rockets',
				price: '30000',
				description: 'Upgrade to nuclear rockets. Increases rocket\'s damage to rocks.'
			},
		]
	},

	// building weapon aim upgrades
	{
		name: 'Building weapon intelligens upgrades',
		description: 'Make the building weapons aim better',
		folder: 'AiGunAim',
		lockVar: 'weaponIntelligence',
		upgrades: [
			{
				name: 'Better idle position',
				price: '5000',
				description: 'Makes building weapons return to an optimal idle position when there are no targets. Decreases the aim time.'
			},
			{
				name: 'Intelligent aim',
				price: '12000',
				description: 'Makes building weapons aware of the targetted rocks\' movement when aiming. This upgrade drastically improves the building weapons\' aim'
			},
			{
				name: 'Use the best target',
				price: '5000',
				description: 'Makes building weapons choose a better target, if the current target is moving away from the cannon. Slightly improves the efficiency of the building weapons.'
			},
			{
				name: 'building weapon collaboration',
				price: '5000',
				description: 'Makes building weapons collaborate better when choosing targets. Improves the performance of a group of building weapons against a group of rocks.'
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
			"desc": "Hi Cliffy,\n\nI've modified my harvester so that it can harvest the small rock pieces that we would else not benefit from.\n\nWith this machine we can earn a little extra money from all rocks!",
			"onBought": function () {
				player.rockValueFactorRocket *= 1.10;
				player.rockValueFactorAiGun *= 1.10;
			}
		},
		{
			"name": "Efficient rockets",
			"info": "25% extra money from rocks shot by the main cannon",
			"desc": "Hello Mr. Cliff,\n\nMy latest invention \"Ultra efficient stone explosives\" will greatly increase the amount of rock that is left after a rock has been safely neutralized by a rocket.\n\nMore rock lefterovers of course equals more money in the bank",
			"onBought": function () {
				player.rockValueFactorRocket *= 1.25;
			}
		},
		{
			"name": "Efficient guns",
			"info": "25% extra money from rocks shot by building weapons",
			"desc": "Hello Mayor!,\n\nIf you can ensure me, that we are going to use excessive amounts of ammunition, I can make a deal with Guns'&'Fun that will make ammunition cheaper.",
			"onBought": function () {
				player.rockValueFactorAiGun *= 1.25;
			}
		},
	],
	[
		{
			"name": "Faster rocket reload",
			"info": "25% faster rocket reload",
			"desc": "Hello Cliffy,\n\nIf you let me turn some screws and oil some [lejere] I'm sure I can tweak your rocket cannons reloading mechanism.",
			"onBought": function () {
				player.rocketReloadTime *= 0.75;
			}
		},
		{
			"name": "Bouncing rockets",
			"info": "Rockets will bounce when hitting the cliffs",
			"desc": "Hi Mr. Cliff,\n\nI just happened to invent an intelligent coating material - \"Clever rubber\" - which will let those rockets of yours bounce of the cliff side, but still explode when hitting rocks.",
			"onBought": function () {
				player.rocketBounces = 10;
			}
		},
		{
			"name": "Faster rockets",
			"info": "20% faster rockets",
			"desc": "Hello Mayor!,\n\nGuns'&'fun wants us to test their new rocket fuel which improves the speed of the rockets.",
			"onBought": function () {
				player.rocketSpeedFactor *= 1.2;
			}
		},
	],
	[
		{
			"name": "Automatic shield repair",
			"info": "Building shields will automatically repair themselves",
			"desc": "",
			"onBought": function () {
				player.shieldAutoRepair = 1;
			}
		},
		{
			"name": "AI firmware upgrade",
			"info": "Better building weapon aim",
			"desc": "",
			"onBought": function () {
				// TODO!
				//player.aiGunAimLevel = 1;
			}
		},
		{
			"name": "Cheaper building enhancements",
			"info": "20% cheaper building enhancements",
			"desc": "",
			"onBought": function () {
				player.buildingEnhancementPriceFactor *= 0.8;
			}
		},
	],
	[
		{
			"name": "Fully automatic main cannon",
			"info": "No need to click anymore",
			"desc": "Hi Cliffy,\n\nI just found an old motor behind my second silo. If you let me hook it up with your fancy rocket cannon's reloading mechanism, I can make it fully automatic.",
			"onBought": function () {
				player.cannonAutomatic = 1;
			}
		},
		{
			"name": "Multiload madness",
			"info": "Enables the main cannon load multiple rockets and then fire them simultaneously",
			"desc": "Hi Mr. Cliff,\n\nI just made my most groundbreaking discovery yet! I have discovered a third dimension! We can use this third dimension to stack multiple rockets inside the rocket cannon, and then firing them simultaneously into our world's two dimensions.",
			"onBought": function () {
				player.rocketMultiLoad = 1;
			}
		},
		{
			"name": "Building weapons Mk. II",
			"info": "From now on building weapons will come with a bronze star",
			"desc": "Hello Mayor!,\n\n",
			"onBought": function () {
				player.aiGunInitialLevel = 1;
			}
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
			}
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
			}
		},
		{
			"name": "Arm all buildings",
			"info": "Enhance all buildings with the second best building weapon that you have access to.\nIf you do not have access to any building weapons, rock rifles will be installed.",
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
			}
		},
	],
];