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
//get unique value from a object
function unique(arr, prop) {
    return arr.map(function(e) { return e[prop]; }).filter(function(e,i,a){
        return i === a.indexOf(e);
    });
}

console.log(unique(table,'a')); //[1,2]
console.log(unique(table,'b')); //[2,3,4]

```