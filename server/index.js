const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const path = require('path');

//dev shite with cors support.. remember to change this later
const io = new Server(server, {
	cors: {
		origin: ['http://localhost:5173', 'http://localhost:5174'],
		credentials: true,
	},
});
require('./eventHandler.js')(io);

app.use(express.static(path.join(__dirname, 'public'))); //serve static files from the public folder so can run frontend on the same server

server.listen(3000, () => {
	console.log('listening on *:3000');
});
module.exports = io;
