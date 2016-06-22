var stanag = require('./lib'),
  formatting = require('../../formatting');


/**
  * @param data, binary data as hexadecimal string
  *
  */

module.exports = function(data) {

  var result = new Object();
  var i = 0;

  while (i < data.length) {

    var name, units, formatted;
    var tag = parseInt(data.slice(i,i+2),16);
    var length = parseInt(data.slice(i+2,i+4),16);
    var value = data.slice(i+4, i+4+length * 2);

    value = stanag[tag].formula(value);
    name = stanag[tag].name;
    units = stanag[tag].units;
    formatted = formatting(value, units)

    result[tag] = {
      tag: tag,
      length: length,
      name: name,
      units: units,
      value: value,
      formatted: formatted
    };

    i += 4 + length * 2;

  }



  // some values are depended on other Tags' values (Tags 26-33), so we can add it only after all Tags are parsed.

  var keys = Object.keys(result);
  keys = keys.slice(keys.indexOf('26'), keys.indexOf('33')+1)
  keys.forEach(function(key){
    result[key].value += result[23 + key % 2].value;
    result[key].formatted = formatting(result[key].value, result[key].units)
  })

  return result;

}

