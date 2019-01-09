'use strict';

const express = require('express');

// App setup
const app = express();
const port = process.env.port || 5000;


// Static files
app.use(express.static('public'));



const server = app.listen(port, ()=>{
      console.log('\x1b[34m%s\x1b[0m',`HTTP Server @ ${port}`);
});



module.export = app; // for testing