/*
settings:
A sample file for setting JsEngine vars and game settings

Has to be loaded before main.js
*/

// Settings for the engine
var loopSpeed=30;
var loopsPerColCheck=2;

// Set number of layers
var layers=11;

// Set static layers (Static layers are layers that has to be manually redrawn)
// Use static layers as much as possible (for backgrounds and such), since non-static layers are ressource hungry.
var staticDepths=new Array(0,1,8,9);

// GAME CONSTANTS
// Upgrades
game=new Object();
game.upgradeTypes=[
	{
		name:'Building weapons',
		description:'Enable your buildings to defend themselves with automatic weapons.\nEach purchased upgrade will be available in the shop.',
		folder:'Weapons',
		lockVar:'weaponsAvailable',
		upgrades:[
			//TODO: Der skal også description på
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
				price:'10000',
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
				price:'10000',
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
		lockVar:'blastRangeLevel',
		upgrades:[
			{
				name:'Small blast range',
				price:'3000',
				description:'Improve the main cannon\'s rockets with a noticable but not very effective blast range.',
			},
			{
				name:'Medium blast range',
				price:'10000',
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
	},
];

// Levels
game.levels=[
	//Level 1
	{'name':'The first shakes',"prepareTime":5000,'rocks':[
		{'type':'RockOrange','spawnTime':1000},
		{'type':'RockOrange','spawnTime':2000},
		{'type':'RockOrange','spawnTime':6000},
		{'type':'RockOrange','spawnTime':8000},
		{'type':'RockOrange','spawnTime':10000},
		{'type':'RockOrange','spawnTime':15000},
		{'type':'RockOrange','spawnTime':16000},
		{'type':'RockOrange','spawnTime':20000},
		{'type':'RockOrange','spawnTime':20500},
		{'type':'RockOrange','spawnTime':21500},
		{'type':'RockOrange','spawnTime':25000},
		{'type':'RockOrange','spawnTime':25000},
		{'type':'RockOrange','spawnTime':27000},
		{'type':'RockOrange','spawnTime':29000},
		{'type':'RockOrange','spawnTime':31000},
		{'type':'RockOrange','spawnTime':31000},
	]},

	{'name':'Level 2',"prepareTime":7000,'rocks':[
		{'type':'RockOrange','spawnTime':0,"x":100,"dir":90},
		{'type':'RockOrange','spawnTime':1000,"x":200,"dir":90},
		{'type':'RockOrange','spawnTime':2000,"x":300,"dir":90},
		{'type':'RockOrange','spawnTime':3000,"x":400,"dir":90},
		{'type':'RockOrange','spawnTime':4000,"x":500,"dir":90},

		{'type':'RockOrange','spawnTime':8000,"x":500,"dir":90},
		{'type':'RockOrange','spawnTime':9000,"x":400,"dir":90},
		{'type':'RockOrange','spawnTime':10000,"x":300,"dir":90},
		{'type':'RockOrange','spawnTime':11000,"x":200,"dir":90},
		{'type':'RockOrange','spawnTime':12000,"x":100,"dir":90},

		{'type':'RockOrange','spawnTime':16000,"x":80,"dir":90},
		{'type':'RockOrange','spawnTime':16000,"x":120,"dir":90},
		{'type':'RockOrange','spawnTime':18000,"x":180,"dir":90},
		{'type':'RockOrange','spawnTime':18000,"x":220,"dir":90},
		{'type':'RockOrange','spawnTime':20000,"x":280,"dir":90},
		{'type':'RockOrange','spawnTime':20000,"x":320,"dir":90},
		{'type':'RockOrange','spawnTime':22000,"x":380,"dir":90},
		{'type':'RockOrange','spawnTime':22000,"x":420,"dir":90},
		{'type':'RockOrange','spawnTime':24000,"x":480,"dir":90},
		{'type':'RockOrange','spawnTime':24000,"x":520,"dir":90},
	]},
	
	//Level 2 <- Should be a higher level
	{'name':'Shake 3',"prepareTime":5000,'rocks':[
		{'type':'RockOrange','spawnTime':1000,'x':500,'dir':135},
		{'type':'RockOrange','spawnTime':1500,'x':100,'dir':45},
		
		{'type':'RockOrange','spawnTime':2000,'x':500,'dir':135},
		{'type':'RockOrange','spawnTime':2500,'x':100,'dir':45},
		
		{'type':'RockOrange','spawnTime':3000,'x':500,'dir':135},
		{'type':'RockOrange','spawnTime':3500,'x':100,'dir':45},
		
		{'type':'RockOrange','spawnTime':4000,'x':500,'dir':135},
		{'type':'RockOrange','spawnTime':4500,'x':500,'dir':45},
		
		{'type':'RockOrange','spawnTime':5000,'x':100,'dir':135},
		{'type':'RockOrange','spawnTime':5500,'x':100,'dir':45},
		
		{'type':'RockOrange','spawnTime':5000,'x':100,'dir':45},
		{'type':'RockOrange','spawnTime':5500,'x':100,'dir':45},
		{'type':'RockOrange','spawnTime':6000,'x':100,'dir':135},
		{'type':'RockOrange','spawnTime':6500,'x':100,'dir':135},

		{'type':'RockOrange','spawnTime':8000,'x':100,'dir':135},
		{'type':'RockOrange','spawnTime':8500,'x':200,'dir':135},
		{'type':'RockOrange','spawnTime':9000,'x':300,'dir':135},
		{'type':'RockOrange','spawnTime':9500,'x':400,'dir':135},
		{'type':'RockOrange','spawnTime':10000,'x':500,'dir':135},

		{'type':'RockOrange','spawnTime':11000,'x':500,'dir':45},
		{'type':'RockOrange','spawnTime':11500,'x':400,'dir':45},
		{'type':'RockOrange','spawnTime':12000,'x':300,'dir':45},
		{'type':'RockOrange','spawnTime':12500,'x':200,'dir':45},
		{'type':'RockOrange','spawnTime':13000,'x':100,'dir':45},
	]},
	
	//Level 2
	{'name':'Magnetism','rocks':[
		{'type':'RockMagnetic','spawnTime':1000},
		{'type':'RockMagnetic','spawnTime':8000},
		{'type':'RockMagnetic','spawnTime':10000},
		{'type':'RockMagnetic','spawnTime':15000},
		{'type':'RockMagnetic','spawnTime':16000},
		{'type':'RockMagnetic','spawnTime':20000},
		{'type':'RockMagnetic','spawnTime':20500},
		{'type':'RockMagnetic','spawnTime':21500},
		{'type':'RockMagnetic','spawnTime':25000},
		{'type':'RockMagnetic','spawnTime':25000},
		{'type':'RockMagnetic','spawnTime':27000},
		{'type':'RockMagnetic','spawnTime':29000},
		{'type':'RockMagnetic','spawnTime':31000},
		{'type':'RockMagnetic','spawnTime':31000},
	]},
]