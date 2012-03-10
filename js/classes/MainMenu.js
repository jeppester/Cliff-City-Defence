/*
MainMenu:
The game's main menu

Requires:
	Sprite
	Button
	TextBlock
	MouseIndex
*/

function MainMenu() {
	this.elms=[];
	
	//Background
	this.elms.push(new Sprite(pBg+'MainMenu.png',9,300,375,0));
	
	//Make buttons
	this.elms.push(new Button(10,421,500,0,'START GAME',function() {
		mainMenu.remove();
		startGame();
	}));
	this.elms.push(new Button(10,421,571,0,'HIGHSCORES',function() {
		console.write('BTN 2 clicked')
	}));
	this.elms.push(new Button(10,421,642,0,'INSTRUCTIONS',function() {
		console.write('BTN 3 clicked')
	}));
	
	redrawStaticLayers();
	
	this.remove=function() {
		for (var i=0; i<this.elms.length; i++) {
			this.elms[i].remove();
		}
	}
}
