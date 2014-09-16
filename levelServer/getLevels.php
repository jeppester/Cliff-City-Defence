<?php
require_once dirname(__FILE__).'/dbconnect.php';
$data=json_decode(stripslashes($_REQUEST['json']));

function fetchLevel($level) {
	global $db;

	// Fetch level data
	$q="select lid, name, theme from level
		where lid=$level";
	$data=$db->selRow($q);
	$data['rocks']=array();

	// Fetch rocks
	$q="select type, rocklevel, spawndelay, x, dir from rock
		where level=$level
		order by `order`";
	$rocks=$db->sel($q);

	foreach ($rocks as $r) {
		$data['rocks'][]=array('type'=>$r['type'],'level'=>$r['rocklevel']*1,'spawnDelay'=>$r['spawndelay']*100,'x'=>$r['x']*1,'dir'=>$r['dir']*1);
	}
	
	return $data;
}

// If a level collection is set, fetch all levels from this collection
if (isset($data->levelCollection)) {
	// Escape data
	$collection=$db->esc($data->levelCollection);

	if (strtolower($collection)=="null" || $collection=="undefined" || $collection=="") {
		$data=array("name"=>'No collection',"levels"=>array());

		// Fetch levels with no collection
		$q="select lid from level
			where levelcollection is Null
			order by hardness, name";
		$levels=$db->selCol($q);

	} else {
		// Fetch level collection data
		$q="select name from levelcollection
			where lcid=$collection";
		$data=$db->selRow($q);
		$data['levels']=array();

		// Fetch all levels belonging to the level collection
		$q="select lid from level
			where levelcollection=$collection
			order by `order`, hardness, name";
		$levels=$db->selCol($q);
	}

	foreach ($levels as $l) {
		$data['levels'][]=fetchLevel($l);
	}

	echo json_encode($data);
	exit;
}

// If a level collection is not set and a level is set, fetch the specific level
if (isset($data->level)) {
	// Escape data
	$level=$db->esc($data->level);

	echo json_encode(fetchLevel($level));
	exit;
}
?>