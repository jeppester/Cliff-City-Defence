function RockFast(_x,_dir,_level) {
	var spr=pImg+'Rocks/Fast1.png';
	var dmgSpr=pImg+'Rocks/Fast1Cracks.png';
	var life=70;
	var value=200;
	var grav=200;
	var maxSpeed=200;

	switch (_level) {
	case 2:
		var spr=pImg+'Rocks/Fast2.png';
		var dmgSpr=pImg+'Rocks/Fast2Cracks.png';
		var life=200;
		var value=400;
		var grav=200;
		var maxSpeed=150;
	break;
	}
	
	Rock.call(this, spr, dmgSpr, _x, _dir, grav, life, value, maxSpeed);
}