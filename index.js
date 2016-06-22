var tlv = require('./standards/4609'),
  checksum = require('./checksum');




/**
  * @param buffer, Buffer array to be parsed.
  * @param format, format of returned output.
  *
  */

var klv = function(buffer, format) {

  // convert the buffer to string, where each 2 characters represent 1 byte.
  // read each Tag byte, Length byte, and Value bytes, parse Value, and asign 'result'.

  var data = buffer.toString('hex');
  var result = new Array();
  var keyLength = 16;
  var pointer = 0;

  while (pointer < data.length) {


    var start = pointer; // used later for count whole packet's length, including key.

    var key = data.slice(pointer ,pointer + keyLength * 2);
    pointer += keyLength * 2;

    var length = parseInt(data.slice(pointer, pointer + 2), 16);
    pointer += 2;


    // BER decoding for 'length'.
    // if the high bit is set (value is then > 127), then the rest bits
    // represents the number of bytes that represents the length's value.

    if (length > 127) {
      pointer += (length & 127) * 2;
      length = parseInt(data.slice(pointer - (length & 127) * 2, pointer), 16);
    }

    var value = data.slice(pointer, pointer + length * 2);
    value = tlv(value);
    pointer += length * 2;

    result.push({
      key: key,
      length: length,
      value: value
    });

    
    // check file length. original length is supllied in value[1].

    if(value[1]) {
      result[result.length - 1].checksum = checksum(data.slice(start,pointer), value[1].value)
    }

  }




  // formatting the output.

  if (format == 'name') {
    for(var i=0; i<result.length; i++) {
      var packet = result[i].value;
      for (tag in packet) {
        var name = packet[tag].name;
        name = name.toLowerCase();
        name = name.replace(/\(|\)/g,'').replace(/(\s)(\w)/g, function(match, p1, p2){
          return p2.toUpperCase();
        })
        result[i].value[name] = packet[tag];
        delete result[i].value[tag];
      }
    }
  }


  return result;

}



module.exports = klv;