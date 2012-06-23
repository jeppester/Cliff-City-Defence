/*
buttonIndex:
An object containing the current state of all buttons.

Requires:
	arena to be set
*/

function MouseIndex() {
	arena.addEventListener('mousedown', function(event) {
		mouse.onMouseDown.call(mouse, event)
	},false);
	arena.addEventListener('mouseup', function(event) {
		mouse.onMouseUp.call(mouse, event)
	},false);
	document.addEventListener('mousemove', function(event) {
		mouse.onMouseMove.call(mouse, event)
	},false);
	
	//Set x and y (the mouse position, relative to the arena)
	this.x=0;
	this.y=0;
	
	//Set x and y (the mouse position, relative to the window)
	this.windowX=0;
	this.windowY=0;
	
	//Create key event array
	this.events=new Array();
	
	this.onMouseDown = function(event) {
		var frame=frames;
		
		if (updatesPerformed) {
			frame++;
		}
		
		this.cleanUp(event.which);
		this.events.push({'button':event.which,'frame':frame,'type':'pressed'});
	}
	
	this.onMouseUp = function(event) {
		var frame=frames;
		
		for (var i=this.events.length-1; i>=0; i--) {
			var evt=this.events[i];
			
			if (evt.button==event.which) {
				if (evt.frame>=frames) {
					frame=evt.frame+1;
				}
			}
		}
		
		this.cleanUp(event.which);
		this.events.push({'button':event.which,'frame':frame,'type':'released'});
	}
	
	this.onMouseMove = function(event) {
		this.windowX=event.pageX;
		this.windowY=event.pageY;
		
		this.x=this.windowX-arena.offsetLeft+document.body.scrollLeft;
		this.y=this.windowY-arena.offsetTop+document.body.scrollTop;

		this.x=this.x/arena.offsetWidth*canvasResX;
		this.y=this.y/arena.offsetHeight*canvasResY;
	}
	
	this.cleanUp = function(button) {
		var clean=false;
		for (var i=this.events.length-1; i>=0; i--) {
			var evt=this.events[i];
			
			if (evt.button==button) {
				if (clean) {
					this.events.splice(i,1);
				}
				
				if (evt.frame<=frames) {
					clean=true;
				}
			}
		}
	}
	
	this.isDown = function(button) {
		for (var i=this.events.length-1; i>=0; i--) {
			var evt=this.events[i];
			
			if (evt.button==button && evt.frame<=frames) {
				return (evt.type=='pressed');
			}
		}
		return false;
	}
	
	this.isPressed = function(button) {
		for (var i=this.events.length-1; i>=0; i--) {
			var evt=this.events[i];
			
			if (evt.button==button) {
				if (evt.frame==frames && evt.type=='pressed') {
					return true;
				}
			} 
		}
		return false;
	}
	
	this.outside= function() {
		if (this.x<0 || this.x>arena.offsetWidth || this.y<0 || this.y>arena.offsetHeight) {
			return true;
		} else {
			return false;
		}
	}
}
