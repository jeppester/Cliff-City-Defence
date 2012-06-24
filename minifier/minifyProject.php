#!/usr/bin/php5
<?php
// Get all javascript includes from index.html
$incs=file_get_contents(dirname(__FILE__).'/../index.html');
$incs=preg_match_all('/src="([^\.]*\.js)"/',$incs,$files);
$files=$files[1];

// Append all these files to each other
$filesContent="";
foreach ($files as $file) {
	$filesContent.=file_get_contents($file)."\n";
}

if (in_array("--nominify",$argv)) {
	// do not minify, just concatenate all files
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
