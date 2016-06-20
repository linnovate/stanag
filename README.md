# stanag


Parsing KLV/TLV data, according to Standardization Agreement of [MISB](http://www.gwg.nga.mil/misb/).

Currenlly supported standards:
 - 0601.9 [Official Docs](http://www.gwg.nga.mil/misb/docs/standards/ST0601.9.pdf)

```
npm install stanag
```


## example

```
var fs = require('fs'),
    stanag = require('stanag');

fs.readFile(BINARY_FILE, function(err,data){
  if(err) throw err;

  var data = stanag(data);
  data = JSON.stringify(data,null,2))
  console.log(data)
})
```