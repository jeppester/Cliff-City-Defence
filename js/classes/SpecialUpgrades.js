/*
SpecialUpgrades:
A menu for buying special upgrades from different city inhabitants

Requires:
	Sprite
	TextBlock
	Button
	Mouse
*/

function SpecialUpgrades() {
	//Make upgrade header
	new Sprite(pImg+'HeaderBox.png',9,300,55,0);
	new TextBlock('SPECIAL OFFERS:',9,0,24,600,{'font':'normal 36px Verdana','align':'center'});
	
	//Make heads
	new Sprite(pImg+'FarmerHeadSelected.png',9,150,170,0);
	new Sprite(pImg+'ScientistHead.png',9,300,162,0);
	new Sprite(pImg+'WomanHead.png',9,450,172,0);
	
	//Make charactor
	new Sprite(pImg+'Farmer.png',9,155,395,0);
	
	//Make textbubble with text
	new Sprite(pImg+'Bubble.png',9,390,395,0);
	text = 'I\'ve looked around my barn and I\'ve managed to find a large pile of wood boards behind one of my silos.\n\nThe boards will make a weak but yet useful defence against the rocks, if we cover our buildings with them.\n\nI\'ll do the work if you take care of my cows meanwhile.\n\nDo we have a deal? (2000$)';
	new TextBlock(text,9,307,270,210);
	
	//Make info text
	new Sprite(pImg+'TextBox.png',9,300,638,0);
	text="Upgrade info:";
	new TextBlock(text,9,88,580,400,{'font':'bold 14px Verdana'});
	text = 'All buildings will be covered with wood, making them more resistant to the rocks.';
	new TextBlock(text,9,88,610,450);
	
	//Make buttons
	new Button(10,400,710,0,'ACCEPT OFFER',function() {console.write('BTN 2 clicked')});
	
	redrawStaticLayers();
}
