// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');

var id = [];
var idp = [];
var total = [];
var totals = [];

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);

	// Read in the file they requested
	fs.readFile(__dirname + parsedUrl.pathname,
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
		}
	);
}

// Call the createServer method, passing in an anonymous callback function that will be called when a request is made
var httpServer = http.createServer(requestHandler);

// Tell that server to listen on port 8080
httpServer.listen(8081);
console.log('Server listening on port 8081');

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
// We are given a websocket object in our function

function (socket) {

	console.log("We have a new client: " + socket.id);
	idp.push ([socket.id]);

	socket.on('position', function(data) {

		for (i=0;i<idp.length; i++){
			if (socket.id == idp[i][0]){
				idp.splice(i,1);
				idp.push ([socket.id, data]);
			}
		}

		console.log (idp);
		io.sockets.emit("position", idp);
	});


	socket.on('disconnect', function() {
		console.log("Client has disconnected: " + socket.id);
		for (i=0;i<idp.length; i++){
			if (socket.id == idp[i][0]) {
				idp.splice(i,1);
			}
		}
	});
}
);
