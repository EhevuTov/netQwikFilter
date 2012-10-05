// Module dependencies

var express = require( 'express' )
var app     = module.exports = express.createServer()
var io      = require( 'socket.io' ).listen(app)
var fs      = require( 'fs' )
var net     = require( 'net' )
var cdr     = require( './cdr' )

var filename = './test/test.csv';
var local = true;

var rs;
if (local){
  rs = fs.createReadStream(filename, {encoding: 'ascii', bufferSize:64});
}
else {
  rs = net.connect({host: '192.168.1.46', port: 2001},
    function() {
      console.log('client connected');
    });
};

rs.on("data", function(data){
  if(local) { rs.pause(); setTimeout(function(){rs.resume()}, 1500)};
});
rs.on("error", function(err){
  console.error("An error occurred: %s", err)
});
rs.on("close", function(){
  console.log("File closed.")
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.set('view options', { pretty: true });
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'NetQwikFilter'
  });
});

app.get('/netqwikfilter', function(req, res){
  res.render('netqwikfilter', {
    title: 'NetQwikFilter',
    layout: false
  });
});

app.get('/about', function(req, res){
  res.render('about', {
    title: 'About'
  });
});

app.get('/contact', function(req, res){
  res.render('contact', {
    title: 'Contact'
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

//maybe make closure here
function sendCDR (data, socket) {
  io.sockets.emit('cdr', data);
  console.log(data);
  console.log(typeof(socket));
  //socket.emit('cdr', data);
};

// Socket.IO on connect, start sending MSUs from the ZeroMQ sub
io.sockets.on( 'connection', function (socket) {
  //socket.emit('columns', { data: 4 });
  socket.on('start', function(from, msg) {
    console.log('received a start event from: '+from+ ' with data: '+msg);
    socket.emit('start', 'started stream');
    cdr(rs,socket).on('data', function(data,socket){sendCDR(data,socket)} );
  });
  socket.on('stop', function(from, msg) {
    console.log('received a start event from: '+from+ ' with data: '+msg);
    socket.emit('stop', 'stopped stream');
    //delete require('./cdr')(rs,socket).on('data', sendCDR );
  });  
  //require('./cdr')(rs,socket).on('data', sendCDR );
});
io.sockets.on('disconnect', function() {});

// gracefully exit program
process.on( 'SIGINT', function() {
  console.log( "\ngracefully shutting down from SIGINT (Ctrl-C)" )
  sub.close()
  process.exit()
})
