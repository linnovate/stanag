

var stanag4609 = require('./standards/4609');


/**
  * @param data, data String to be parsed.
  *
  */

var tlv = function(data) {

  var result = new Object();
  var i = 0;

  while (i < data.length) {

    var name, units;
    var tag = parseInt(data.slice(i,i+2),16);
    var length = parseInt(data.slice(i+2,i+4),16);
    var value = data.slice(i+4, i+4+length * 2);

    value = stanag4609[tag].formula(value);
    name = stanag4609[tag].name;
    units = stanag4609[tag].units;

    result[tag] = {
      tag: tag,
      length: length,
      name: name,
      units: units,
      value: value
    };

    i += 4 + length * 2;

  }



  // some Values of Tags depends on other Tags' values, so we can add it only after all Tags are parsed.

  if(result[26]) result[26].value += result[23].value
  if(result[27]) result[27].value += result[24].value
  if(result[28]) result[28].value += result[23].value
  if(result[29]) result[29].value += result[24].value
  if(result[30]) result[30].value += result[23].value
  if(result[31]) result[31].value += result[24].value
  if(result[32]) result[32].value += result[23].value
  if(result[33]) result[33].value += result[24].value


  return result;

}





var checksum = function(data, checksum) {

  data = data.slice(0, data.lastIndexOf('0102' + checksum) + 4);
  data += data & 2;

  var sum = 0;

  for (var i=0; i<data.length; i+=4) {
    sum += parseInt(data.slice(i,i+4),16);
  }

  sum = sum.toString(16).slice(-4)

  if(sum === checksum) {
    return 'correct';
  } else {
    return 'incorrect, sum is: ' + sum;
  }

}




/**
  * @param buffer, Buffer array to be parsed.
  * @param format, format of returned output.
  *
  */

var klv = function(buffer, format) {


  // treating the buffer as a string, where each 2 characters represent 1 byte.
  // read each Tag byte, Length byte, and Value bytes, parse Value and asign to 'result'.

  var data = buffer.toString('hex');
  var result = new Array();
  var keyLength = 16;
  var pointer = 0;

  while (pointer < data.length) {


    // used later. to count whole packet's length, including key.

    var start = pointer;


    // asign the key, and increase pointer value respectively.

    var key = data.slice(pointer ,pointer + keyLength * 2);
    pointer += keyLength * 2;


    // asign the length, and increase pointer value respectively.

    var length = parseInt(data.slice(pointer, pointer + 2), 16);
    pointer += 2;


    // BER decoding for 'length'.
    // if the high bit is set (value is then > 127), then the rest bits
    // represents the number of bytes that represents the length's value.

    if (length > 127) {
      pointer += (length & 127) * 2;
      length = parseInt(data.slice(pointer - (length & 127) * 2, pointer), 16);
    }


    // asign the value, and increase pointer value respectively.

    var value = data.slice(pointer, pointer + length * 2);
    value = tlv(value);
    pointer += length * 2;


    // asign all properties to result object.

    result.push({
      key: key,
      length: length,
      value: value
    });

    
    // check file length. original length is supllied in value[1].

    if(value[1].value) {
      result[result.length - 1].checksum = checksum(data.slice(start,pointer), value[1].value)
    }

  }




  // formatting the output.

  switch (format) {
    case 'tag':
    case undefined:
    break;
    case 'name':
    for(var i=0; i<result.length; i++) {
      var packet = result[i].value;
      for (tag in packet) {
        var name = packet[tag].name;
        name = name.slice(0,1).toLowerCase() + name.slice(1).replace(/\s/g, '');
        result[i].value[name] = packet[tag];
        delete result[i].value[tag];
      }
    }
    break;
    case 'human':
    for(var i=0; i<result.length; i++) {
      var packet = result[i].value;
      var text = '';
      for (tag in packet) {
        text += packet[tag].name + ': ' + packet[tag].value + ' ' + packet[tag].units + '\n';
      }
      result[i].value = text;
    }
    break;
    default:
    return 'Invalid format: "' + format + '". Valid formats are: "tag"(default), "name" or "human"';
  }


  return result;

}



module.exports = klv;