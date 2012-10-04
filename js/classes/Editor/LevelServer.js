jseCreateClass('LevelServer');

LevelServer.prototype.levelServer = function (serverUrl) {
	this.serverUrl = serverUrl;
};

LevelServer.prototype.doRequest = function (request, data, callback) {
	var xmlHttp;

	if (callback === undefined) {
		console.log('Doing request without callback');
		callback = function () {};
	}

	// Do http request
	xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
			callback(xmlHttp.responseText);
		}
	};
	// console.log('Requesting URL: ' + this.serverUrl + ' / ' + request + '.php?json = ' + data);
	xmlHttp.open("GET", this.serverUrl + '/' + request + '.php?json=' + data, true);
	xmlHttp.send(null);
};

LevelServer.prototype.saveLevel = function (level, callback) {
	var json = jsonEncode(level, ['markers']);

	this.doRequest('saveLevel', json, callback);
};

LevelServer.prototype.saveStats = function (level, stats) {
	var json = jsonEncode({level: level, impactFactor: stats.impactFactor, meanFallDistance: stats.meanFallDistance});
	this.doRequest('saveStats', json, function () {
		console.log('Level stats submitted');
	});
};

LevelServer.prototype.getLevel = function (levelId, onloaded) {
	console.log('Not implemented yet');
};

LevelServer.prototype.getCollections = function (onloaded) {
	console.log('Not implemented yet');
};

LevelServer.prototype.getLevelCollection = function (levelCollection, onloaded) {
	this.doRequest('getLevels', '{"levelCollection": "' + levelCollection + '"}', onloaded);
};