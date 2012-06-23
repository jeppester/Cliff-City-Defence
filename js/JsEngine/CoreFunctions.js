// Function to copy all variables from one object to another
// Used mainly for loading option objects - See TextBlock for an example
function copyVars(from,to) {
	for (var i in from) {
		if (i==undefined) {continue;}
		to[i]=from[i];
	}
}

// Function for inheritage of other class' functions and properties
function importClass(importer,Class) {
	// Check that the className is not a code string
	if (typeof Class!=="function") {
		throw new Error('Invalid className');
	}

	var inheritFrom = new Class;
	importerClass={};
	importerClass=Object.getPrototypeOf(importer);

	for (var i in inheritFrom) {
		if (i==undefined || typeof(importerClass[i])=="function") {continue;}
		importer[i]=inheritFrom[i];
	}

	return true;
}

// Function for enabling construction of object with
// "new Class(Argument1,Argument2)"
// only if arguments are supplied,
// and using a custom constructor.
// Important for class inheritance
function constructIfNew(object,constructor,arguments) {
	if (arguments.length>0) {
		constructor.apply(object,arguments);
	}
}

// Function to clean every trace of an element in the engine
function purge(obj) {
	if (obj.bm!==undefined) {
		delete obj.bm;
	}
	if (updateObjects['onRunning'][obj.id]!==undefined) {
		delete updateObjects['onRunning'][obj.id];
	}
	if (updateObjects['onPaused'][obj.id]!==undefined) {
		delete updateObjects['onPaused'][obj.id];
	}
	if (obj.depth!==undefined) {
		delete depth[obj.depth][obj.id];
	}
}

// Function for turning an object with properties into a json string
jsonEncode=function(obj,ignore) {
	function jsonIterate(obj,ignore) {
		var ignore=ignore==undefined?[]:ignore;
		var ret='';

		switch (typeof obj) {
			// If string or number, save directly
			case 'string':
			case 'number':
				//console.log('Wrote string/number:'+obj);
				ret+='"'+obj+'",';
			break;
			// If object, check if array or object and do accordingly
			case 'object':
				if (obj instanceof Array) {
					//console.log('Writing array')
					ret+='['
					for (var i=0; i<obj.length; i++) {
						ret+=jsonIterate(obj[i],ignore);
					}
					ret+='],'
				} else {
					ret+='{';
					//console.log('Writing object')
					for (var i in obj) {
						if (ignore.indexOf(i)!=-1) {continue};
						ret+='"'+i+'":';
						ret+=jsonIterate(obj[i],ignore);
					}
					ret+='},'
				}
			break;
		}
		return ret;
	}

	var json=jsonIterate(obj,ignore);
	return json.replace(/,\}/gi,'}').replace(/,\]/gi,']').replace(/,$/,'');
}