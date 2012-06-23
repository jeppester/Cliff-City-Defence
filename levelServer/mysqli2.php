<?php
class mysqli2 {
	public $mysqli;
	
	public function __construct ($dbHost,$dbUser,$dbPass,$dbName) {
		$this->mysqli=new mysqli($dbHost,$dbUser,$dbPass,$dbName);

		global $debug;
		$debug=false;
		if (isset($_REQUEST['debug'])) {
			$debug=true;
		}
	}
	
	// Compatibility functions
	public function query ($q) {
		global $debug;
		if ($debug) {echo $q;}

		$op=$this->mysqli->query($q);
		if (!$op) {
			return false;
		}
		
		if (preg_match('/^\s*select/',strtolower($q))!==false) {
			return $op;
		} elseif (preg_match('/^\s*insert/',strtolower($q))!==false) {
			return $this->mysqli->insert_id;
		}
		
		return true;
	}
	public function real_escape_string($str) {
		return $this->esc($str);
	}

	// Shortcut functions
	//Escape
	public function esc($str) {
		return $this->mysqli->real_escape_string($str);
	}
	//Select
	public function sel($q) {
		global $debug;
		if ($debug) {echo $q;}

		$op=$this->mysqli->query($q);
		if (!$op) {
			return false;
		}
		
		$ret=array();
		while ($row=$op->fetch_assoc()) {
			$ret[]=$row;
		}
		return $ret;
	}
	//Select a single value
	public function selVal ($q) {
		global $debug;
		if ($debug) {echo $q;}

		$op=$this->mysqli->query($q);
		if (!$op || $op->num_rows==0) {
			return false;
		}
		
		$op=$op->fetch_array();
		return $op[0];
	}
	//Select row
	public function selRow ($q) {
		global $debug;
		if ($debug) {echo $q;}

		$op=$this->mysqli->query($q);
		if (!$op || $op->num_rows==0) {
			return false;
		}
		
		$op=$op->fetch_assoc();
		return $op;
	}

	public function selCol ($q) {
		global $debug;
		if ($debug) {echo $q;}

		$op=$this->mysqli->query($q);
		if (!$op || $op->num_rows==0) {
			return false;
		}

		$col=array();
		while ($row=$op->fetch_array()) {
			$col[]=$row[0];
		}

		return $col;
	}

	//Insert
	public function ins($q) {
		global $debug;
		if ($debug) {echo $q;}

		$op=$this->mysqli->query($q);
		if (!$op) {
			return false;
		}
		
		return $this->mysqli->insert_id;
	}
	//Update
	public function upd($q) {
		global $debug;
		if ($debug) {echo $q;}

		$op=$this->mysqli->query($q);
		return $op===false ? false : true;
	}
	//Delete
	public function del($q) {
		global $debug;
		if ($debug) {echo $q;}

		$op=$this->mysqli->query($q);
		return $op===false ? false : true;
	}
}
?>
