function onClearStage() {};

function onLoaded() {
	//Open main menu
	mainMenu=new MainMenu();
}

function onStartGame() {
	//Make score-object
	player=new Player();
	
	//Make Level controller
	levelController=new LevelController();
	
	//Make cliff
	ground = new Sprite('img/backgrounds/cliffCityGround.png',0,0,0,0,{'xOff':0,'yOff':0});
	road = new Sprite('img/backgrounds/cliffCityRoad.png',0,0,0,0,{'xOff':0,'yOff':0});
	cliff = new Sprite('img/backgrounds/cliffSide.png',8,0,0,0,{'xOff':0,'yOff':0});
	
	redrawStaticLayers();
	
	//Make some clouds
	for (var i=0;i<5;i++) {
		new Cloud();
	}
	
	//Make canon building
	cannonBuilding=new CannonBuilding();
	
	//Make buildings and trees (the order is important for depth)
	new Destroyable('img/nonScalable/Tree.png',4,421,680);
	new Destroyable('img/nonScalable/AppleTree.png',4,520,673);
	
	b1=new Building(1,4,91,665);
	b2=new Building(2,4,163,665);
	
	new Destroyable('img/nonScalable/Tree.png',4,200,690);
	
	b3=new Building(3,4,232,680);
	b4=new Building(4,4,392,687);
	b5=new Building(5,4,446,663);
	b6=new Building(6,4,490,668);
	
	new Destroyable('img/nonScalable/Tree.png',4,98,700);
	new Destroyable('img/nonScalable/AppleTree.png',4,151,725);
	new Destroyable('img/nonScalable/Tree.png',4,225,718);
	new Destroyable('img/nonScalable/AppleTree.png',4,362,700);
	new Destroyable('img/nonScalable/AppleTree.png',4,436,718);
	new Destroyable('img/nonScalable/Tree.png',4,473,694);
	
	levelController.startLevel(0);
};

function onGameStep() {
	//Keep code in objects as much as possible
};

function onFrame() {
	//Keep code in objects as much as possible
};
