/**
  * @param data: binary data as hexadecimal string.
  * @param checksum: 2 bytes of checksum value as hexadecimal string.
  *
  */

module.exports = function(data, checksum) {

  data = data.slice(0, data.lastIndexOf('0102' + checksum) + 4);
  data += data & 2;

  var sum = 0;

  for (var i=0; i<data.length; i+=4) {
    sum += parseInt(data.slice(i,i+4),16);
  }

  sum = sum.toString(16).slice(-4)

  if(sum == checksum) {
    return 'succeed';
  } else {
    return 'failed. need to equal \'' + checksum + '\', but is \'' + sum +'\'';
  }

}
