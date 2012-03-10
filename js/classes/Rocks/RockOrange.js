function RockOrange(_x,_dir) {
	var spr=pImg+'Rock.png';
	var dmgSpr=pImg+'RockCracks.png';
	var life=100;
	var value=200;
	var grav=150;
	
	Rock.call(this, spr, dmgSpr, _x, _dir, grav, life, value);
}
