function resizeCanvas() {
	// Check if the window is wider og heigher than the game's canvas
	windowWH=window.innerWidth/window.innerHeight;
	gameWH=canvasResX/canvasResY;
	
	if (windowWH>gameWH) {
		var h=window.innerHeight;
		var w=canvasResX/canvasResY*h;
	} else {
		var w=window.innerWidth;
		var h=canvasResY/canvasResX*w;
	}

	w=Math.min(w,canvasResX);
	h=Math.min(h,canvasResY);
	
	arena.style.top="50%";
	arena.style.left="50%";
	arena.style.marginTop=-h/2+"px";
	arena.style.marginLeft=-w/2+"px";
	arena.style.height=h+"px";
	arena.style.width=w+"px";
}

window.addEventListener('resize',resizeCanvas,false)
resizeCanvas();
