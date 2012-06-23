<?php
require_once dirname(__FILE__)."/mysqli2.php";
require_once dirname(__FILE__)."/../settings.php";
$db=new mysqli2($dbHost,$dbUser,$dbPass,$dbName);
?>