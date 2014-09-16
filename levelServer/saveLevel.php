<?php
require_once dirname(__FILE__).'/dbconnect.php';

// Parse json data
$level=json_decode(stripslashes($_REQUEST['json']));

// Check that there are enough rocks in the level
if (count($level->rocks)<10) {
	echo 'Not enough rocks';
	exit;
}

// Escape level data
$name=$db->esc($level->name);
$preparetime=$db->esc($level->prepareTime);
$theme=$db->esc($level->theme);

// Insert level into database
$q="insert into level (name,levelcollection,createtime,theme) values ('$name',1,NOW(),'$theme')";
$levelId=$db->ins($q);

// Insert each rock into the database
foreach ($level->rocks as $id=>$rock) {
	// Escape all rock data
	$type=$db->esc($rock->type);
	$spawndelay=$db->esc($rock->spawnDelay/100);
	$x=$db->esc($rock->x);
	$dir=$db->esc($rock->dir);
	$level=$db->esc($rock->level);

	// If no horisontal position has been set, generate one
	if ($x=="") {
		$x=100+50*rand(0,8);
	}

	// If no direction has been set, generate it
	if ($dir=="") {
		$dir=rand(1,5);
		$dir=pi()/6*$dir;
	}

	// If the rocks level has not been set, set it to 1
	if ($level=="") {
		$level=1;
	}

	// Make and execute query
	$q="insert into rock (level,`order`,type,rocklevel,spawndelay,x,dir) values ($levelId,$id,'$type',$level,$spawndelay,$x,$dir)";
	$db->ins($q);
}

// Send mail to owner
$subject="New level submitted to Cliff City Defence";
$content="A new level with the following level-ID has been submitted to the game:\n$levelId";

mail($ownerMail,$subject,$content);

// Return the levelId to Ajax caller
echo $levelId;
?>