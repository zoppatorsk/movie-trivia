require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const path = require('path');

//if run in dev put in the cors junk
const ioConfig =
	process.env.MODE == 'dev'
		? {
				cors: {
					origin: ['http://localhost:5173', 'http://localhost:5174'],
					credentials: true,
				},
		  }
		: {};

console.log(ioConfig);
const io = new Server(server, ioConfig);
require('./eventHandler.js')(io);

app.use(express.static(path.join(__dirname, 'public'))); //serve static files from the public folder so can run frontend on the same server

const port = process.env.PORT;
server.listen(port, () => {
	console.log(`listening on *:${port}`);
});
module.exports = io;
