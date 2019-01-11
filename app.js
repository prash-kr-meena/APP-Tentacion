'use strict';

const express = require('express');
const socket = require('socket.io');
const MONGOOSE = require("mongoose"); // middleware to connect node app & mongoDB | Elegant MongoDB object modeling for Node.js




// App setup
const app = express();
const port = process.env.PORT || 5000;






const BODY_PARSER = require("body-parser");

//! body parser config
app.use(BODY_PARSER.json()); // support parsing of application/json type post data

app.use(BODY_PARSER.urlencoded({ //support parsing of application/x-www-form-urlencoded post data
      extended: true
}));



//  app configuration
const cors = require('cors');

var corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));







// ! connect to mongoDB && Some checks
// Mongoose provides a straight-forward, schema-based solution to model your application data.
//  It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

let DatabaseConfig = require("./config/database");
MONGOOSE.connect(DatabaseConfig.database_host, {
      useNewUrlParser: true
});
const DB = MONGOOSE.connection;


//* check connection                                  database events
DB.once('open', () => {
      console.log('Connected to DB :  SUCCESS');
});

// * check db errors
DB.on('error', (db_err) => {
      console.log("DB ERROR : " + db_err);
});










//! -------   server listen   -------
const server = app.listen(port, ()=>{
      console.log('\x1b[34m%s\x1b[0m',`HTTP Server @ ${port}`);
});



//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~  socket.io setup    ~~~~~~~~~~~~~~~~~~~~~~~~~~~
const io = socket(server);

io.on('connection', (socket) =>{
      // console.log(socket);
      console.log('\x1b[35m%s\x1b[0m',`${socket.id} connection made!`);

      socket.on('disconnect', function () {
            console.log('\x1b[36m%s\x1b[0m',`${socket.id} disconnected!`);
            // io.emit('user disconnected');
      });


      //? =========================== Text Chat ===============================


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




      //? =========================== Youtube Sync ===============================

      socket.on('onPlayerStateChange', function (obj = {}) {
            // console.log('onPlayerStateChange   Event');
            socket.broadcast.emit('onPlayerStateChange', obj);
      });
});





// ! ===================================      ROUTES      ===================================

const userRoute = require("./route/user");
app.use("/user/", userRoute);




// ! ---------------  Testing  ---------------
module.export = app; // for testing
