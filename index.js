const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', function(req, res){
    //res.send('<h1>Hello world</h1>');
    res.status(200);
});


io.use((socket, next) => {
    let token = socket.handshake.query.token;
    if(token === '123456'){
        return next();
    }
        
    return next(new Error('authentication error'));
}); 

io.on('connection', (socket) => {
    
    socket.emit('connected', 'You are connected message will be send with user infornation by the token'+socket.id);
    console.log('Token id from start is '+ socket.id);
    console.log('token is:'+ socket.handshake.query.token);
       
    //console.log('connection established by :'+socket);
    socket.on('emit-chat',(msg)=>{
        console.log('message recieved from client :'+msg);
        //broadcasting all user except sender
        socket.broadcast.emit('broadcast', msg);

    });

    socket.on('disconnect', function(){
        //console.log(aa);
        console.log(socket.id);
        console.log('user disconnected');
    });
});
server.listen(3000,()=>{
    console.log('Server started on :'+3000);
});