/*
Console:
A console to write debug messages to.
Uses a block-element to contain the output.

No requirements
*/

function Console(id) {
	//Id is the id of the default output element
	this.console = id;
	
	this.write = function(output, _col,_id,_single) {
		//A specified output can be set using _id
		var id=_id?_id:this.console;
		//_single determines if the output should only show one line at a time
		//_single is good for tracking variables when debugging.
		var single=_single?_single:false;
		var op=document.getElementById(id);
		
		var col = _col ? _col : "#fff";
		var t=this.time();
		
		if (single) {op.innerHTML='';}
		
		op.innerHTML += /*"<span style=\"color:#bbb\">" + t.hours + ":" + t.minutes + ":" + t.seconds + ": </span>"+*/"<span style=\"color:" + col + "\">" + output + "<span><br/>\n";
		
		op.scrollTop = op.scrollHeight;
	}
	
	this.time = function() {
		var now = new Date();
		var hours = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();
		if (hours < 10) hours = "0" + hours;
		if (minutes < 10) minutes = "0" + minutes;
		if (seconds < 10) seconds = "0" + seconds;
		
		return {'hours':hours,'minutes':minutes,'seconds':seconds};
	}

	this.clear = function() {
		this.console.innerHTML = '';
	}
}
