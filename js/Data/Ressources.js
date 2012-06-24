//Ressources to load
pImg='img/';
pBg='img/Backgrounds/';

var images=new Array(
	pImg+'GameLogo.png',
	pImg+'GameLogoPipes.png',
	pImg+'GameComplete.png',
	pImg+'Positioner.png',
	pImg+'Rocket.png',
	pImg+'Explosion.png',
	pImg+'GunShot1.png',
	pImg+'GunShot2.png',
	pImg+'GunShot3.png',
	pImg+'GunShot4.png',
	pImg+'Cloud.png',
	pImg+'Cannon.png',
	pImg+'RocketBuilding.png',
	pImg+'Building1.png',
	pImg+'Building2.png',
	pImg+'Building3.png',
	pImg+'Building4.png',
	pImg+'Building5.png',
	pImg+'Building6.png',
	pImg+'Building1Damaged.png',
	pImg+'Building2Damaged.png',
	pImg+'Building3Damaged.png',
	pImg+'Building4Damaged.png',
	pImg+'Building5Damaged.png',
	pImg+'Building6Damaged.png',
	pImg+'Building1Shield1.png',
	pImg+'Building2Shield1.png',
	pImg+'Building3Shield1.png',
	pImg+'Building4Shield1.png',
	pImg+'Building5Shield1.png',
	pImg+'Building6Shield1.png',
	pImg+'Building1Shield2.png',
	pImg+'Building2Shield2.png',
	pImg+'Building3Shield2.png',
	pImg+'Building4Shield2.png',
	pImg+'Building5Shield2.png',
	pImg+'Building6Shield2.png',
	pImg+'Building1Shield3.png',
	pImg+'Building2Shield3.png',
	pImg+'Building3Shield3.png',
	pImg+'Building4Shield3.png',
	pImg+'Building5Shield3.png',
	pImg+'Building6Shield3.png',
	pImg+'Building1Shield4.png',
	pImg+'Building2Shield4.png',
	pImg+'Building3Shield4.png',
	pImg+'Building4Shield4.png',
	pImg+'Building5Shield4.png',
	pImg+'Building6Shield4.png',
	pImg+'BuildingGunStand.png',
	pImg+'BuildingGun1.png',
	pImg+'BuildingGun2.png',
	pImg+'BuildingGun3.png',
	pImg+'BuildingGun4.png',
	pImg+'Tree.png',
	pImg+'AppleTree.png',
	pImg+'Mayor.png',
	pImg+'Scientist.png',
	pImg+'ScientistHead.png',
	pImg+'ScientistHeadSelected.png',
	pImg+'Farmer.png',
	pImg+'FarmerHead.png',
	pImg+'FarmerHeadSelected.png',
	pImg+'Woman.png',
	pImg+'WomanHead.png',
	pImg+'WomanHeadSelected.png',
	pImg+'Bubble.png',
	pImg+'Button.png',
	pImg+'ButtonSelected.png',
	pImg+'ButtonDisabled.png',
	pImg+'ButtonShadowless.png',
	pImg+'ButtonShadowlessSelected.png',
	pImg+'HeaderBox.png',
	pImg+'TextBox.png',
	pBg+'cliffCityGround.png',
	pBg+'cliffCityRoad.png',
	pBg+'cliffSide.png',
	pBg+'MainMenu.png',
	pBg+'Instructions.png',
	pBg+'EnhancementInstructions.png',
	pBg+'EditorDenial.png',

	// Upgrades
	pImg+'Upgrades/btn0.png',
	pImg+'Upgrades/btn1.png',
	pImg+'Upgrades/btn11.png',
	pImg+'Upgrades/btn11b.png',
	pImg+'Upgrades/btn11c.png',
	pImg+'Upgrades/btn2a.png',
	pImg+'Upgrades/btn2b.png',
	pImg+'Upgrades/btn2c.png',
	pImg+'Upgrades/btn3.png',

	pImg+'Upgrades/BlastRanges/01.png',
	pImg+'Upgrades/BlastRanges/11.png',
	pImg+'Upgrades/BlastRanges/21.png',
	pImg+'Upgrades/BlastRanges/22.png',
	pImg+'Upgrades/BlastRanges/31.png',
	pImg+'Upgrades/BlastRanges/32.png',
	pImg+'Upgrades/BlastRanges/41.png',
	pImg+'Upgrades/BlastRanges/42.png',

	pImg+'Upgrades/Weapons/01.png',
	pImg+'Upgrades/Weapons/11.png',
	pImg+'Upgrades/Weapons/21.png',
	pImg+'Upgrades/Weapons/22.png',
	pImg+'Upgrades/Weapons/31.png',
	pImg+'Upgrades/Weapons/32.png',
	pImg+'Upgrades/Weapons/41.png',
	pImg+'Upgrades/Weapons/42.png',

	pImg+'Upgrades/Shields/01.png',
	pImg+'Upgrades/Shields/11.png',
	pImg+'Upgrades/Shields/21.png',
	pImg+'Upgrades/Shields/22.png',
	pImg+'Upgrades/Shields/31.png',
	pImg+'Upgrades/Shields/32.png',
	pImg+'Upgrades/Shields/41.png',
	pImg+'Upgrades/Shields/42.png',

	// Rocks
	pImg+'Rocks/Orange1.png',
	pImg+'Rocks/Orange1Cracks.png',
	pImg+'Rocks/Orange2.png',
	pImg+'Rocks/Orange2Cracks.png',
	pImg+'Rocks/Magnetic1.png',
	pImg+'Rocks/Magnetic1Cracks.png',
	pImg+'Rocks/Magnetic2.png',
	pImg+'Rocks/Magnetic2Cracks.png',
	pImg+'Rocks/Fast1.png',
	pImg+'Rocks/Fast1Cracks.png',
	pImg+'Rocks/Fast2.png',
	pImg+'Rocks/Fast2Cracks.png',

	// Particles
	pImg+'Particles/MagneticFracture.png',
	pImg+'Particles/OrangeFracture.png',

	// Editor
	pImg+'Editor/SpawnArrow.png',
	pImg+'Editor/RockButtonBackground.png',
	pImg+'Editor/RockSelectorBox.png',
	pImg+'Editor/EditorLine.png',
	pImg+'Editor/Up.png',
	pImg+'Editor/Down.png',
	pImg+'Editor/IntervalTimer.png',
	pImg+'Editor/Cross.png',
	pImg+'Editor/Floppy.png',
	pImg+'Editor/Play.png',
	pImg+'Editor/Stop.png',
	pImg+'Editor/Quit.png',
	pImg+'Editor/Pause.png',
	pBg+'EditorHelp.png',
	pBg+'EditorSaved.png',
	pBg+'EditorNotEnoughRocks.png'
)
var sounds=new Array(
	'sfx/astroid1.wav',
	'sfx/explosion3.wav',
	'sfx/shield2.wav',
	'sfx/powerup2.wav',
	'sfx/Gun412.wav',
	'sfx/Gun422.wav',
	'sfx/Gun432.wav',
	'sfx/Gun442.wav'
)