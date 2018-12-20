const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
const redis = require('redis');
const client = redis.createClient();

const helpers = require('./helpers');


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

//console.log(helpers.sayHelloInEnglish('hi'));

io.use((socket, next) => {
    let token = socket.handshake.query.token;
    if(!token == ""){
        return next();
    }
        
    return next(new Error('authentication error'));
});

io.of("/").on("connection", socket => {

    io.of('/').adapter.clients((err, clients) => {
        console.log(clients); // an array containing all connected socket ids
        socket.emit('allconnected', clients);
        
        let socketId = socket.id;
        const userId = socket.handshake.query.token;
        let data = {};
        data[socketId] = userId;
        client.hmset('online', data);

        client.hgetall('online',(err, object)=>{

            let conectedUsers = {};

            const splitedObj = Object.keys(object).forEach(function(key) {
                var value = object[key];
                //console.log(key, value);
                //console.log(clients);
                if(clients.indexOf(key) != -1){
                    conectedUsers[key] = object[key];
                }else{
                    client.hdel('online', key);
                }
                
            });

            socket.broadcast.emit('broadcast', conectedUsers);
            socket.emit('me', conectedUsers);
        });

        socket.on('emit-chat',(msg)=>{

            socket.broadcast.emit(`to-others-${1}`,msg);
            console.log('message recieved from client :'+msg);
            // broadcasting all user except sender
            socket.broadcast.emit('broadcast', msg);
            
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
            //need to broadcast deleted user info to all because no body knows who is not in online now
            client.hdel('online', socketId);
        });

        //console.log(clients.indexOf(socketId));
        socket.emit("new-joined", "This is the new implementation of socket io with namespace"+socketId);
    });

  });

server.listen(3000,()=>{
    console.log('Server started on :'+3000);
});