/*
Loader:
Object for loading and storing ressources

No requirements
*/

function Loader() {
	this.sounds = new Object();
	this.images = new Object();
	this.loaded = new Object();
	this.loaded.images = 0;
	this.loaded.sounds = 0;

	this.loadImages = function(_paths) {
		for (var i in _paths) {
			var fPath = _paths[i];
			this.images[fPath] = new Image;

			this.images[fPath].src = fPath;
			this.images[fPath].onload = function() {
				loader.loaded.images++;
				if (loader.loaded.images==Object.keys(loader.images).length) {
					console.write(loader.loaded.images+' images loaded');
					onLoaded();
				}
			}
		}
		
	}

	this.loadSounds = function(_paths) {
		for (var i in _paths) {
			var fPath = _paths[i];
			this.sounds[fPath] = new Audio(_paths[i]);
			this.sounds[fPath].addEventListener("canplaythrough", function() {
				loader.loaded.sounds++;
			});
		}
	}
}
