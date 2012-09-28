var net = require('net');
var fs = require('fs');
var events = require('events');
var es = require('event-stream');
//var stream = require ('stream');

//var cdr = new stream();
//cdr = function(istream,patterns,ostream) {
cdr = function(istream,socket,ostream) {


  var patterns = [/Lab 46/g, /danielle/g];
  var columns = patterns.length;

  var filter = function (data) {
    var array = data.split(',');
    if(patterns[0].exec(array[0])) {
      //this.emit('data', data);
      return data;
    };
  };

  return es.pipeline(
      istream
    , es.replace('\'','')
    , es.split()
      /*
         es.map(function (data, callback) {//turn this async function into a stream
         callback(null
         , filter(data))  //render it nicely
         }),
       */
    , es.mapSync(filter)
      //pr(columns).parseRow,
      //pr(columns),
//    , es.join('\n')
//      , ostream
//    , socket
  );
  
};

module.exports = cdr;

