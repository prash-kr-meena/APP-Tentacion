'use strict';

const express = require('express');
const socket = require('socket.io');


// App setup
const app = express();
const port = process.env.port || 5000;


// Static files
app.use(express.static('public'));



const server = app.listen(port, ()=>{
      console.log('\x1b[34m%s\x1b[0m',`HTTP Server @ ${port}`);
});


// socket.io setup
const io = socket(server);

io.on('connection', (socket) =>{
      console.log('\x1b[35m%s\x1b[0m',`${socket.id} connection made!`);
      // console.log(socket);
});



module.export = app; // for testing