/**
  * @param data, data String to be parsed.
  *
  */
module.exports = function (value, units) {

  var text;

  switch (units) {
    case 'Degrees':
      text = value.toFixed(2) + '°';
    break;
    case 'Celcius':
      text = value + '°';
    break;
    case 'Kilogram':
      text = value.toFixed(2) + ' kg';
    break;
    case 'Microseconds':
      text = new Date(value/1000).toISOString();
    break;
    case 'Millibar':
      text = value.toFixed(2) + ' mb';
    break;
    case 'Meters':
      text = value.toFixed(2) + ' m';
    break;
    case 'Meters/Second':
      text = value.toFixed(2) + ' M/s';
    break;
    case 'Percent':
      text = value.toFixed(2) + '%';
    break;
    case 'Pixels':
      text = value + ' px';
    break;
    default:
      text = value;
    break;
  }

  return text;
}
