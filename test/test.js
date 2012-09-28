var fs = require('fs');
var net = require('net');
var stream = require('stream').Stream;
var through = require('through');

var filename = './modules/cdr/test/test.csv';
var local = true;
var production = true;

var rs;
if (local){
  rs = fs.createReadStream(filename, {encoding: 'ascii'});
}
else {
  rs = net.connect({host: '192.168.1.46', port: 2001},
    function() { //'connect' listener
      console.log('client connected');
    });
};

rs.on("data", function(data){
});
rs.on("error", function(err){
  console.error("An error occurred: %s", err)
});
rs.on("close", function(){
  console.log("File closed.")
});

require('./modules/cdr')(rs).pipe(process.stdout)
