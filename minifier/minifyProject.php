#!/usr/bin/php5
<?php

// Get all javascript files in /js dir
/* function scanDirForJSFiles($dir = '/../js') {
    $dirpointer = opendir($dir);
    $files = array();
    
    while (false !== ($entry = readdir($dirpointer))) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        if (is_dir($dir.'/'.$entry)) {
            $files = array_merge($files, scanDirForJSFiles($dir.'/'.$entry));
        } else {
            if (preg_match('/\.js$/', $entry)) {
                $files[] = $dir.'/'.$entry;
            }
        }
    }
    
    return $files;
}

$files = scanDirForJSFiles(dirname(__FILE__).'/../js');
 */
$files = array('js/JsEngine/jseFunctions.js','js/JsEngine/JsEngine.js');
$files = array_merge($files, json_decode('["js/JsEngine/classes/Loader.js","js/JsEngine/classes/Animation.js","js/JsEngine/classes/Animator.js","js/JsEngine/classes/ObjectContainer.js","js/JsEngine/classes/Director.js","js/JsEngine/classes/Sprite.js","js/JsEngine/classes/TextBlock.js","js/JsEngine/classes/GameObject.js","js/JsEngine/classes/GravityObject.js","js/JsEngine/classes/KeyboardIndex.js","js/JsEngine/classes/MouseIndex.js","js/JsEngine/classes/Particle.js","js/Game.js","js/Data/Upgrades.js","js/Data/Rocks.js","js/Data/Editor.js","js/classes/GameModes/StoryModeController.js","js/classes/GameModes/TestModeController.js","js/classes/GameModes/CustomLevelModeController.js","js/classes/Rocket.js","js/classes/Cloud.js","js/classes/Destroyable.js","js/classes/Building.js","js/classes/CannonBuilding.js","js/classes/AiGun.js","js/classes/Shield.js","js/classes/StageController.js","js/classes/ScorePoints.js","js/classes/Player.js","js/classes/Rock.js","js/classes/Explosion.js","js/classes/GunShot.js","js/classes/Menus/CustomMenu.js","js/classes/Menus/UpgradeMenu.js","js/classes/Menus/UpgradeIcon.js","js/classes/Menus/ShopCircle.js","js/classes/Menus/ShopIcon.js","js/classes/Menus/SpecialUpgrades.js","js/classes/Menus/Button.js","js/classes/SpriteButton.js","js/classes/FadeMessage.js","js/classes/Editor/Editor.js","js/classes/Editor/LevelServer.js"]'));

/*print_r($files);
exit;*/

// Append all these files to each other
$filesContent="";
foreach ($files as $file) {
	$filesContent.=file_get_contents(dirname(__FILE__).'/../'.$file)."\n";
}

if (in_array("--nominify",$argv)) {
	// do not minify, just append all files to each other
	echo $filesContent;
	exit;
};

if (!in_array("--keepcomments",$argv)) {
	// remove all occurrences of "console.log([something])"
	$filesContent=preg_replace ('/console\.log[^\n|;]*(\n|;)/', '', $filesContent);
};

require dirname(__FILE__).'/jsmin.php';

echo JSMin::minify($filesContent);
?>
