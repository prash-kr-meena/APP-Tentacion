'use strict';

const express = require('express');
const socket = require('socket.io');


// App setup
const app = express();
const port = process.env.port || 5000;


//! -------   server listen   -------
const server = app.listen(port, ()=>{
      console.log('\x1b[34m%s\x1b[0m',`HTTP Server @ ${port}`);
});


//? socket.io setup
const io = socket(server);

io.on('connection', (socket) =>{
      // console.log(socket);
      console.log('\x1b[35m%s\x1b[0m',`${socket.id} connection made!`);


      // Handle chat event
      socket.on('chat', function(data){
            // console.log(data);
            io.sockets.emit('chat', data);
      });

      // Handle typing-feedback event
      socket.on('typing', function(data){
            socket.broadcast.emit('typing', data);
            // emit this event to all the sockets, except the original one
      });
});



module.export = app; // for testing