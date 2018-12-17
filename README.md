# socket-io

//create room in socket io

```javascript 

// client side code
var socket = io.connect();
socket.emit('create', 'room1');

// server side code
io.sockets.on('connection', function(socket) {
  socket.on('create', function(room) {
    socket.join(room);
  });
});
```


```javascript

//socketio room explained



//server side code
io.of("/games").on("connection", socket => {
  //Welcome new joiners!
  socket.emit("welcome", "This is the Gaming Channel!");

    socket.on("joinRoom", room => {
        console.log("Joining Room...: " + room);
        if (registeredRooms.includes(room)) {
            //Socket has joined the request room
            return socket.emit("success", "Invalid Room Name: " + room);
        } else {
        //No room with the specified Name! (or it could be another reason).
        return socket.emit("err", "Invalid Room Name: " + room);
        }
    }
}

#https://ipenywis.com/tutorials/Node.js-Socket.io-Make-a-Basic-Chat-Application-(Native-JS)-03



```


```javascript
//get unique value from a object
function unique(arr, prop) {
    return arr.map(function(e) { return e[prop]; }).filter(function(e,i,a){
        return i === a.indexOf(e);
    });
}

console.log(unique(table,'a')); //[1,2]
console.log(unique(table,'b')); //[2,3,4]

```


```javascript

//redis adaptar for all connected user
#https://github.com/socketio/socket.io-redis

io.of('/').adapter.clients(['room1', 'room2'], (err, clients) => {
  console.log(clients); // an array containing socket ids in 'room1' and/or 'room2'
});


```