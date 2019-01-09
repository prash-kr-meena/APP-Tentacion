'use strict';
// ==>> REMEMBER : this is running on to the front-end
// and we need to seprate our frontend from the backend

// make connection from front-end to the server

let socket = io.connect('http://localhost:5000');


//  Query DOM
let
message = document.getElementById('message'),
handle = document.getElementById('handle'),
btn = document.getElementById('send'),
output = document.getElementById('output'),
feedback = document.getElementById('feedback');



// Emit events
btn.addEventListener('click', function(){
      let msg = message.value;
      let hndl = handle.value;


      if( typeof hndl === 'string' && hndl.length > 0  && typeof msg === 'string' && msg.length > 0 ){
            socket.emit('chat', {
                  message: message.value,
                  handle: handle.value
            });
            message.value = "";  // clearing up the value, for next messge
      }else{
            console.log('Handle and msg are required');
      }
});


message.addEventListener('keypress',function () {

      let msg = message.value;
      let hndl = handle.value;


      if( typeof hndl === 'string' && hndl.length > 0  && typeof msg === 'string' && msg.length > 0 ){
            socket.emit('typing', {
                  handle: handle.value
            });
      }
});

// Listen for chat event
socket.on('chat', function(data){
      feedback.innerHTML = "";
      output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});


// Listen for the  typing-feedback event
socket.on('typing', function(data){
      feedback.innerHTML = '<p><em>' + data.handle + ': </em>' + "is typing!" + '</p>';
});

