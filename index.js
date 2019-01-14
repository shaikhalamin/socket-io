const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
const redis = require('redis');
const client = redis.createClient();
const uniqid = require('uniqid');

const helpers = require('./helpers');


app.get('/', function(req, res){
    //res.send('<h1>Hello world</h1>');
    res.status(200).send('<h1>Hello world</h1>');
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
        console.log('connected users');
        console.log(clients);
        //console.log(clients); // an array containing all connected socket ids
        socket.emit('allconnected', clients);
        
        let socketId = socket.id;
        const userId = socket.handshake.query.token;
        let data = {};
        data[socketId] = userId;
        client.hmset('online', data);

        client.hgetall('online',(err, object)=>{
            console.log('all redis connected data');
            console.log(object);

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
            
            //console.log(conectedUsers);
        });

        socket.on('request-meeting',(data)=>{
            console.log('meeting request received');
            console.log(data.dataObject);
            const docterData = {
                message: data.dataObject.message,
                callerInfo:data.dataObject.name,
                senderId:data.dataObject.senderId,
                receiverId:data.dataObject.receiverId,
                meetingId: uniqid(data.dataObject.name)
            }
            socket.broadcast.emit(`to-doctor-${data.dataObject.receiverId}`,docterData);
        });

        socket.on('request-accepted',(data)=>{
            console.log("request acceped received");
            console.log(data);
            const accepteddData = {
                data: data.dataObject
            }
            socket.broadcast.emit(`acceptedFeedback-to-patient-${data.dataObject.senderId}`,accepteddData);
        });

        socket.on('request-rejected',(data)=>{
            console.log("request rejected received");
            console.log(data);

            const rejectedData = {
                data: data.dataObject
            }
            
            socket.broadcast.emit(`rejectedFeedback-to-patient-${data.dataObject.senderId}`,rejectedData);
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
            //need to broadcast deleted user info to all because no body knows who is not in online now
            client.hdel('online', socketId);
            console.log(clients);

            client.hgetall('online',(err, object)=>{

                let remainingUsers = {};
                
                if(object){
                    console.log('On disconnect redis connected user info');
                    console.log(object);
                    socket.broadcast.emit('broadcast', object);
                    // Object.keys(object).forEach(function(key) {
                    //     var value = object[key];
                    //     if(clients.indexOf(key) != -1){
                    //         remainingUsers[key] = object[key];
                    //     }else{
                    //         client.hdel('online', key);
                    //     }
                        
                    // });
                }
                
                //socket.broadcast.emit('broadcast', remainingUsers);
                //socket.emit('me', remainingUsers);
                //console.log(remainingUsers);
            });
        });

    });

  });

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log('Server started on :'+PORT);
});