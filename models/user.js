// jshint  node :true
"use strict";

// creating modles give us some kind of infrastructure to our data base

// as no-sql databases like mongoDB there is not much structure,
//  its very flexible which can be a great thing but downfall as well  as our data is not structured at all
// mongoose gives us ability to structure it on application level, rather then on a data level as we do in mySQL

const mongoose = require("mongoose");
const DB = mongoose.connection;

// let DatabaseConfig = require("../config/database");

// user schema
let userSchema = mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      email: {  // for sending emails to invite them
            type: String,
            require: true,
      },
      password: {
            type: String,
            required: true,
      },
      online :{ // N or Y,  deonting no and yes
            type: String,
            required: true,
      },
      socketId : {
            type: String,
            required: true,
      }
});

let collection_name = "users";

let userModel = mongoose.model(collection_name, userSchema);


createAscendingIndex_on_user_email(DB);


module.exports = userModel;




//   indexing  at schema level -->  using node js
function createAscendingIndex_on_user_email(DB, callback) {
      let collection = DB.collection(collection_name); // Get the users collection

      // ? Create the index
      collection.createIndex({
            email: 1, // specifies : indexing type is ascending indexing
      }, {
            unique: true
      }, function (err, result) {
            if (err) {
                  console.log("error while setting up indexing");
            }
            console.log("index created  ", result, "<<<<<<<<" , collection_name, " collection");
            // callback("result");
      });
}

//? NOTE : Creating indexes in MongoDB is an idempotent operation.
//* --> So running db.names.createIndex({name:1}) would create the index only if it didn't already exist.