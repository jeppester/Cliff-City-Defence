// Function to copy all variables from one object to another
// Used mainly for loading option objects - See TextBlock for an example
copyVars = function (from, to) {
	var i;
	for (i in from) {
		if (from.hasOwnProperty(i)) {
			if (i === undefined) {continue; }
			to[i] = from[i];
		}
	}
};

jseCreateClass = function (className) {
	var constructorName;

	if (!/^\w*$/.test(className)) {throw new Error("Invalid class name: " + className); }

	constructorName = className.charAt(0).toLowerCase() + className.slice(1);
	eval('window.' + className + ' = function () {this.' + constructorName + '.apply(this, arguments); }');
	window[className].prototype[constructorName] = function () {};
	return window[className];
};

jseArrayElementByPropertyValue = function (array, property, value) {
	var i;
	for (i = 0; i < array.length; i ++) {
		if (array[i][property] === value) {
			return array[i];
		}
	}
	return undefined;
};

jseArraySortByNumericProperty = function (array, property, desc) {
	var sortedArray = [],
		copy = [],
		currentID,
		currentVal,
		i;

	Array.prototype.push.apply(copy, array);

	while (copy.length) {
		currentVal = false;

		for (i = 0; i < copy.length; i ++) {
			if (!desc) {
				if (copy[i][property] < currentVal || currentVal === false) {
					currentID = i;
					currentVal = copy[i][property];
				}
			}
			else {
				if (copy[i][property] > currentVal || currentVal === false) {
					currentID = i;
					currentVal = copy[i][property];
				}
			}
		}
		sortedArray.push(copy.splice(currentID, 1)[0]);
	}
	return sortedArray;
};

jseExtend = function (extendingClass, extendedClass) {
	var functionName;
	for (functionName in extendedClass.prototype) {
		if (typeof extendedClass.prototype[functionName] === "function") {
			extendingClass.prototype[functionName] = extendedClass.prototype[functionName];
		}
	}
};

// Function to clean every trace of an element in the engine
jsePurge = function (obj) {
	var name, loop, i;

	if (obj === undefined) {throw new Error(obj); }
	if (typeof obj === "string") {
		obj = engine.objectIndex[obj];
	}

	// Delete all references from loops
	for (name in engine.loops) {
		if (engine.loops.hasOwnProperty(name)) {
			loop = engine.loops[name];

			// From activities
			i = loop.activities.length;
			while (i --) {
				if (obj === loop.activities[i].object) {
					loop.activities.splice(i, 1);
				}
			}

			// From animations
			// FLAWED ?
			i = loop.animations.length;
			while (i --) {
				if (obj === loop.animations[i].obj) {
					loop.animations.splice(i, 1);
				}
			}
		}
	}

	// Delete from viewlist
	if (obj.parent) {
		obj.parent.removeChild(obj);
	}

	delete engine.objectIndex[obj.id];
};

jseSyncLoad = function (filePaths) {
	var i, req;

	if (typeof filePaths === "string") {
		filePaths = [filePaths];
	}

	for (i = 0; i < filePaths.length; i ++) {
		// console.log('Loading: ' + filePaths[i])
		req = new XMLHttpRequest();
		req.open('GET', filePaths[i], false);
		req.send();
		try {
			eval.call(window, req.responseText);
		}
		catch (e) {
			throw new Error('Failed loading "' + filePaths[i] + '": ' + e.type + ' "' + e.arguments[0] + '"');
		}
	}

	if (window.loadedFiles === undefined) {window.loadedFiles = []; }
	window.loadedFiles = window.loadedFiles.concat(filePaths);
};

// Function for turning an object with properties into a json string
jsonEncode = function (obj, ignore) {
	function jsonIterate(obj, ignore) {
		var ret, i;

		ignore = ignore === undefined ? []: ignore;

		switch (typeof obj) {
		// If string or number, save directly
		case 'string':
		case 'number':
			// console.log('Wrote string / number: ' + obj);
			ret += '"' + obj + '",';
			break;
		// If object, check if array or object and do accordingly
		case 'object':
			if (obj instanceof Array) {
				ret += '[';
				for (i = 0; i < obj.length; i ++) {
					ret += jsonIterate(obj[i], ignore);
				}
				ret += '],';
			} else {
				ret += '{';
				for (i in obj) {
					if (obj.hasOwnProperty(i)) {
						if (ignore.indexOf(i) !== -1) {continue; }
						ret += '"' + i + '":';
						ret += jsonIterate(obj[i], ignore);
					}
				}
				ret += '},';
			}
			break;
		}
		return ret;
	}

	var json = jsonIterate(obj, ignore);
	return json.replace(/,\}/gi, '}').replace(/,\]/gi, ']').replace(/,$/, '');
};