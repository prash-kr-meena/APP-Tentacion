// jshint node : true
"use strict";

const express = require("express");
const user_Router = express.Router();
const UserModel = require("../models/user");
const Response = require("./response");

const BCRYPT_JS = require("bcryptjs"); //---> crypto will work



// ! ============  GET ROUTES ============

user_Router.get("/hello", (req, res) => {   // ---->   user/hello
      console.log("hello hit");
      res.json({
            hey: "hello"
      });
});





// * change the status of online to 'N' ie no
user_Router.get('/logout', (req, res) => {
      console.log("HIT : logout  - ", req.query.email);

      // * match email --> as unique email is primary key
      let query = {
            email: req.query.email
      };


      // ? so update user's online status  --> to be N, is offline
      let update_command = {
            $set: {
                  online:'N',
                  socketId : '-'
            }
      };


      UserModel.updateOne(query, update_command, (err) => {
            if (err) {
                  console.log(`Error : while updating user's online status \n ${err}`);
                  throw new Error(err);
            }else{
                  console.log(`User loged-in and update his online status`);
                  return Response.success(res, {
                        msg : "successfully loged out && changed the status to N",
                  });
            }
      });
});




// ! ============  POST ROUTES ============


user_Router.post('/signup', (req, res) => {
      console.log(`user -> Signup  : ${req.body.username} , ${req.body.password}`);


      //* genereat a secure password
      let salt = BCRYPT_JS.genSaltSync(10);
      let securePass = BCRYPT_JS.hashSync(req.body.password, salt);


      // todo : create a socket and assign it id to the users socket
      //* creat a new user and insert into collection
      let newUser = new UserModel({
            name: req.body.username,
            email: req.body.email,
            password: securePass,
            online : 'N',
            socketId : '-'
      });

      newUser.save((err) => {
            if (err) {
                  return Response.error(res, [`Error : while registering a new user \n ${err}`]);
            } else {
                  return Response.success(res, `Success, ${newUser.name} registered successfully.`);
            }
      });

});



user_Router.post('/login', (req, res) => {
      console.log(`user -> login  : ${req.body.email} , ${req.body.password}`);
      // console.log(req.body);

      // * match email --> as unique email is primary key
      let query = {
            email: req.body.email
      };

      UserModel.findOne(query,function(err, user) {
            if (err) {
                  return Response.error(res, [`Error : while finding the user in DB ${err}`]);
            }

            if (!user) {
                  return Response.error(res, [`Error : NO such user in Database`]);
            }

            //* compare password hashes
            let matched = BCRYPT_JS.compareSync(req.body.password, user.password);
            if (!matched) {
                  return Response.error(res, [`Error : Password does not match, retry !`]);
            }




            //* password matched -- successfully
            // ? so update user's online status  --> to be Y, is online  && upda the socketId
            let update_command = {
                  $set: {
                        online:'Y',
                        socketId : req.body.socketId
                  }
            };


            UserModel.updateOne(query, update_command, (err) => {
                  if (err) {
                        console.log(`Error : while updating user's online status \n ${err}`);
                        throw new Error(err);
                  }else{
                        console.log(`User loged-in and update his online status`);
                        return Response.success(res, {
                              msg : "successfully loged in && changed the status to Y",
                              userId : user._id,
                              email : user.email,
                              socketId : user.socketId
                        });
                  }
            });
      });
});



// ? ============  export router ============
module.exports = user_Router;