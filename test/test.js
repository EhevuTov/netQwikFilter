var fs = require('fs');
var net = require('net');
var cdr = require('../cdr');

var filename = './test.csv';
var local = true;
var production = true;

var rs;
if (local){
  rs = fs.createReadStream(filename, {encoding: 'ascii',bufferSize: 64});
}
else {
  rs = net.connect({host: '192.168.1.46', port: 2001},
    function() { //'connect' listener
      console.log('client connected');
    });
};

rs.on("data", function(data){
  if (local) {
    rs.pause();
    setTimeout(function(){rs.resume()}, 100);
  }
});
rs.on("error", function(err){
  console.error("An error occurred: %s", err)
});
rs.on("close", function(){
  console.log("File closed.")
});

cdr(rs).pipe(process.stdout)
