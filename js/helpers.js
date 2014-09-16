Object.prototype.importProperties = function (from, copyIfPossible) {
    var i;

    for (i in from) {
        if (from.hasOwnProperty(i)) {
            if (i === undefined) {continue; }

            if (!copyIfPossible || typeof from[i] !== 'object') {
                this[i] = from[i];
            }
            else {
                if (from[i].copy) {
                    this[i] = from[i].copy();
                }
                else if (from[i].clone) {
                    this[i] = from[i].clone();
                }
                else {
                    this[i] = from[i];
                }
            }
        }
    }
};

// Function for turning an object with properties into a json string, functions are ignored
jsonEncode = function (obj, ignore) {
  function jsonIterate(obj, ignore) {
    var ret, i;

    ignore = ignore === undefined ? []: ignore;

    switch (typeof obj) {
    // If string or number, save directly
    case 'string':
    case 'number':
    case 'boolean':
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
