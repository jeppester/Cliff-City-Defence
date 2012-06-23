// Upgrades
game={
	upgradeTypes:[
		{
			name:'Building weapons',
			description:'Enable your buildings to defend themselves with automatic weapons.\nEach purchased upgrade will be available as a building enhancement.',
			folder:'Weapons',
			lockVar:'weaponsAvailable',
			upgrades:[
				{
					name:'Heavy rifle',
					price:'3000',
					shopPrice:'1000',
					description:'A heavy rifle capable of damaging rocks.',
					onBought:function() {
						shopCircle.building.setGun(1);
					},
				},
				{
					name:'Minigun',
					price:'7000',
					shopPrice:'2000',
					description:'A fully automatic machine gun capable of shooting barrages of light ammunition.',
					onBought:function() {
						shopCircle.building.setGun(2);
					},
				},
				{
					name:'Rocket launcher',
					price:'20000',
					shopPrice:'4000',
					description:'Fires highly explosive shells with a blast range.',
					onBought:function() {
						shopCircle.building.setGun(3);
					},
				},
				{
					name:'Laser beamer',
					price:'40000',
					shopPrice:'8000',
					description:'High powered laser beamer. Hits instantly with a very powerfull laser beam, that will wipe out most rocks..',
					onBought:function() {
						shopCircle.building.setGun(4);
					},
				},
			]
		},
		{
			name:'Building shielding',
			description:"Buy different types of shielding for Cliff City\'s buildings.\nEach purchased upgrade will be available in the shop.",
			folder:'Shields',
			lockVar:'shieldsAvailable',
			upgrades:[
				{
					name:'Tree shielding',
					price:'3000',
					shopPrice:'1000',
					description:'Very weak but yet useable shielding.',
					onBought:function() {
						shopCircle.building.setShield(1);
					},
				},
				{
					name:'Rock shielding',
					price:'7000',
					shopPrice:'2000',
					description:'Slighty stronger than tree shielding.',
					onBought:function() {
						shopCircle.building.setShield(2);
					},
				},
				{
					name:'Metal shielding',
					price:'20000',
					shopPrice:'4000',
					description:'Strong shielding. Can take much damage.',
					onBought:function() {
						shopCircle.building.setShield(3);
					},
				},
				{
					name:'Kryptonite shielding',
					price:'40000',
					shopPrice:'8000',
					description:'Very strong shielding. Capable of resisting even the toughest rocks.',
					onBought:function() {
						shopCircle.building.setShield(4);
					},
				},
			]
		},
		{
			name:'Rocket Blast Ranges',
			description:'Make the main cannon\'s rockets more deadly by upgrading their blast ranges.\nEach upgrade permanently increases all rocket\'s blast range.',
			folder:'BlastRanges',
			lockVar:'rocketBlastRangeLevel',
			upgrades:[
				{
					name:'Small blast range',
					price:'3000',
					description:'Improve the main cannon\'s rockets with a noticable but not very effective blast range.',
				},
				{
					name:'Medium blast range',
					price:'7000',
					description:'Improve the rockets\' blast range to a useable level.',
				},
				{
					name:'Large blast range',
					price:'20000',
					description:'Improve the rockets\' blast range to make them very effective against groups of rocks.',
				},
				{
					name:'Enormeous blast range',
					price:'40000',
					description:'Improve the rockets\' blast range to the max!',
				},
			]
		}
	]
}