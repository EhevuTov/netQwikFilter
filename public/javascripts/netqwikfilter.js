require([
    "dojo/dom"
  , "dojo/data/ObjectStore"
  , "dojo/parser"
  , "dojo/store/Memory"
  , "dojo/store/Observable"
  , "dijit/layout/BorderContainer"
  , "dijit/layout/TabContainer"
  , "dijit/layout/ContentPane"
  , "dijit/registry"
  , "dojox/grid/DataGrid"
  , "dojo/domReady!"]
  , function() {dojo.ready( ready ) } ) // the callback function to run when done asynchronously

function ready() {
  // init needed to begin program after successful loading
  // run loading icon for start of program
  var n = dojo.byId("preLoader");
  dojo.fadeOut({
node:n,
duration:720,
onEnd:function(){
dojo.style(n,"display","none");
}
}).play();

/*
var store = [{
    0: "Lab 46", 1: "DA1", 2: "130.020.002", 3: "4721", 4: "130.020.001"
  , 5: "A01", 6: "3456", 7: "", 8: "2012-09-27 21:40:25", 9: "I", 10: "1"
  , 11: "2129991721", 12: "6305799800", 13: "6309756721", 14: "181.275"
  , 15: "0.000", 16: "268536255", 17: "", 18: "", 19: "F", 20: "6305799880"
}];
*/
//create the store with the data

var cdrStore = new dojo.store.Memory();
var dataStore = new dojo.data.ObjectStore({objectStore: cdrStore});
// wrap the store with Observable to make it possible to monitor
//cdrStore = new dojo.store.Observable(cdrStore);

dijit.registry.byId('grid').setStore(dataStore);

// Socket.IO connection
var socket = io.connect( 'http://localhost' );
var columns;
socket.on('columns', function(data) { 
    columns = data;
    console.log(data.data);
});


function toObject(string) {
  var arr = string.split(',');
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    if (arr[i] !== undefined) rv[i] = arr[i];
  return rv;
}

function put_cdr (string) {
  console.log(string);
  cdrStore.add(toObject(string));
  dijit.registry.byId('grid').update();
  dijit.registry.byId('grid').sort();
};

function socket_start() {
  console.log( "clicked" )
  socket.on( 'cdr', put_cdr )
  socket.emit( 'start' )
}
function socket_stop() {
  console.log( "clicked" )
  socket.removeListener( 'cdr', put_cdr )
  socket.emit( 'stop' )
}
dojo.connect( dojo.byId( 'startStream' ), 'click', socket_start)
dojo.connect( dojo.byId( 'stopStream' ), 'click', socket_stop)
};
