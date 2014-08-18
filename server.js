var express = require('express');
var logfmt = require("logfmt");
var app = express();
var redis = require('redis')
var osc = require('osc')

var server = require('http').Server(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser')

var lastPointTime = Date.now();
var now;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use(express.static(__dirname + '/public'));
// For debugging:
// app.use(logfmt.requestLogger());

app.get('/hello', function(req, res) {
  res.send('<h1>Hello World!</h1>');
});

// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 5000
});



// Open the socket.
udpPort.open();

io.on('connection', function (socket) {
    console.log("socket.io connection");
  	socket.emit('news', { hello: 'world' });  

  	// Listen for incoming OSC bundles.
		udpPort.on("message", function (oscData) {
		
				now = Date.now()
				// console.log(now + "  -  " + lastPointTime)
				if((now-lastPointTime <= 1000) || (lastPointTime-now <= 1000)) {
					lastPointTime = now
					socket.emit('news', oscData); 
				}
		});

});

var port = Number(process.env.PORT || 3000);
server.listen(port, function() {
  console.log("Listening on " + port);
});
