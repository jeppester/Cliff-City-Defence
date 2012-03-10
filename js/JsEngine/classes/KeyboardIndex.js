/*
KeyboardIndex:
An object containing the current state of all keys.

No requirements
*/

function KeyboardIndex() {
	document.addEventListener('keydown', function(event) {
		keyboard.onKeyDown.call(keyboard, event)
	});
	document.addEventListener('keyup', function(event) {
		keyboard.onKeyUp.call(keyboard, event)
	});
	
	//Create key event array
	this.events=new Array();
	
	this.onKeyDown = function(event) {
		if (this.isDown(event.keyCode)) {
			return;
		}
		
		var frame=frames;
		
		if (updatesPerformed) {
			frame++;
		}
		
		this.cleanUp(event.keyCode);
		
		this.events.push({'key':event.keyCode,'frame':frame,'type':'pressed'});
	}
	
	this.onKeyUp = function(event) {
		var frame=frames;
		
		for (var i=this.events.length-1; i>=0; i--) {
			var evt=this.events[i];
			
			if (evt.key==event.keyCode) {
				if (evt.frame>=frames) {
					frame=evt.frame+1;
				}
			}
		}
		
		this.cleanUp(event.keyCode);
		
		this.events.push({'key':event.keyCode,'frame':frame,'type':'released'});
	}
	
	this.cleanUp = function(button) {
		var clean=false;
		for (var i=this.events.length-1; i>=0; i--) {
			var evt=this.events[i];
			
			if (evt.key==button) {
				if (clean) {
					this.events.splice(i,1);
				}
				
				if (evt.frame<=frames) {
					clean=true;
				}
			}
		}
	}
	
	this.isDown = function(key) {
		for (var i=this.events.length-1; i>=0; i--) {
			var evt=this.events[i];
			
			if (evt.key==key && evt.frame<=frames) {
				return (evt.type=='pressed');
			}
		}
		return false;
	}
	
	this.isPressed = function(key) {
		for (var i=this.events.length-1; i>=0; i--) {
			var evt=this.events[i];
			
			if (evt.key==key) {
				if (evt.frame==frames && evt.type=='pressed') {
					return true;
				}
			}
		}
		return false;
	}
}
