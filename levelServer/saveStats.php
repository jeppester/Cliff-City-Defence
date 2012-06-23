<?php
require_once dirname(__FILE__).'/dbconnect.php';
$stats=json_decode(stripslashes($_REQUEST['json']));

// Escape stats data
foreach ($stats as &$value) {
	$value=$db->esc($value);
}

// Insert level stats into database
$q="insert into levelstats (level,impactfactor,meanfalldistance) values (".$stats->level.",".$stats->impactFactor.",".$stats->meanFallDistance.")";
$db->ins($q);

// Calculate new level hardness

// Fetch data
$q="select avg(impactfactor) as impactFactor, avg(meanfalldistance) as meanFallDistance from levelstats
	where level=".$stats->level;
$calcStats=$db->selRow($q);

$q="select sum(level) from rocks where level=".$stats->level;
$calcStats['weightedRockFrequency']=$db->selVal($q);

// Weight and summarize data
$hardness=$calcStats['meanFallDistance']/700*2 + $calcStats['impactFactor']*2 + $calcStats['weightedRockFrequency'];

// Save new hardness value
$q="update level set hardness=$hardness where lid=".$stats->level;
$db->upd($q);
?>