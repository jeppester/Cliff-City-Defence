function resizeCanvas() {
	var h, w;

	// Check if the window is wider og heigher than the game's canvas
	windowWH = window.innerWidth / window.innerHeight;
	gameWH = engine.canvasResX / engine.canvasResY;
	
	if (windowWH>gameWH) {
		h = window.innerHeight;
		w = engine.canvasResX / engine.canvasResY * h;
	} else {
		w = window.innerWidth;
		h = engine.canvasResY / engine.canvasResX * w;
	}

	w=Math.min(w, engine.canvasResX);
	h=Math.min(h, engine.canvasResY);
	
	arena.style.top="50%";
	arena.style.left="50%";
	arena.style.marginTop=-h/2+"px";
	arena.style.marginLeft=-w/2+"px";
	arena.style.height=h+"px";
	arena.style.width=w+"px";
}

window.addEventListener('resize',resizeCanvas,false);
resizeCanvas();
