const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redis = require('redis');
const client = redis.createClient();


app.get('/', function(req, res){
    //res.send('<h1>Hello world</h1>');
    res.status(200);
});

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});


io.use((socket, next) => {
    let token = socket.handshake.query.token;
    if(!token == ""){
        return next();
    }
        
    return next(new Error('authentication error'));
}); 

io.on('connection', (socket) => {

    let socketId = socket.id;
    const userId = socket.handshake.query.token;
    socket.emit('new-joined', socketId);
    
    let data = {};

    data[socketId] = userId;
    
    //console.log(data);
    JSON.stringify(data);
    //console.log(data);

    client.hmset('online', data);

    var conectedUsers = {}; 
    client.hgetall('online',(err, object)=>{
        conectedUsers = object;
        socket.broadcast.emit('broadcast', conectedUsers);
        socket.emit('me', conectedUsers);
        //console.log(conectedUsers);
    });
   
    //console.log('Socket id from start is '+ socket.id);
    //console.log('token is:'+ socket.handshake.query.token);
       
    //console.log('connection established by :'+socket);
    socket.on('emit-chat',(msg)=>{
        console.log('message recieved from client :'+msg);
        //broadcasting all user except sender
        //socket.broadcast.emit('broadcast', msg);

    });

    socket.on('disconnect', function(){
        //console.log(aa);
        //console.log(socket.id);
        client.hdel('online', socketId);

        // client.hgetall('online',(err, object)=>{
        //     conectedUsers = object;
        //     if(conectedUsers){
        //         socket.emit('connected', conectedUsers);
        //         console.log(conectedUsers);
        //     }
            
        // });

        console.log('user disconnected..'+socket.id);
    });
});
server.listen(3000,()=>{
    console.log('Server started on :'+3000);
});