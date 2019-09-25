// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

// color chats
var idcol = [];
var total = [];
var sendcol;

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);

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

	/*
	res.writeHead(200);
	res.end("Life is wonderful");
	*/
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
// We are given a websocket object in our function
function (socket) {

	idcol.push(socket.id);
	idcol.push(getRandomColor());
	total.push([idcol[idcol.length-2],idcol[idcol.length-1]]);

	console.log (total);
	console.log("We have a new client: " + socket.id);


	// When this user emits, client side: socket.emit('otherevent',some data);
	socket.on('chatmessage', function(data, sendcol, name) {
		// Data comes in as whatever was sent, including objects
		console.log("Received: 'chatmessage' " + data + " socket id: " + socket.id);
		for (i = 0; i<total.length; i++) {
			if (socket.id == total[i][0]) {
				sendcol = total[i][1];
				console.log (sendcol);
			}
		}
		// Send it to all of the clients
		io.sockets.emit('chatmessage', data, sendcol, name);
	});


	socket.on('disconnect', function() {
		console.log("Client has disconnected " + socket.id);
	});
}
);
