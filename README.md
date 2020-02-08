//Node socket server up and running for moner daktar


//Node and npm install
```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

```

```
//Redis install
sudo apt-get install redis-server
sudo systemctl enable redis-server.service

//Now open the following file 
 sudo nano /etc/redis/redis.conf

//and find the following file configuration and change accordingly
maxmemory 256mb
maxmemory-policy allkeys-lru

//Now restart the redis server
sudo systemctl restart redis-server.service

//Open your terminal and paste the following command
redis-cli

```
//it should open redis cli in the terminal

```
//Now install pm2 globally

sudo npm install -g pm2

```

```
// Now clone the repository

git clone https://github.com/shaikhalamin/socket-io.git

//cd into socket-io directory and run the following command

npm install

//Copy the following certificates file into socket io directory
sudo cp /etc/letsencrypt/live/monerdaktar.com/privkey.pem /var/www/socket-io
sudo cp /etc/letsencrypt/live/monerdaktar.com/cert.pem /var/www/socket-io
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /var/www/socket-io

now change group and owner of the directory like the following

sudo chown -R samin:www-data socket-io/

//To make sure everything working fine
run node index.js


//FIx the issue by manually

then check node index.js

if evrything ok the run the node process using PM2

sudo pm2 start index.js

//automatic restart the process if error using the following command 
sudo pm2 startup systemd

//The above command will give you some instruction to follow like the following

sudo su -c "env PATH=$PATH:/usr/bin pm2 startup systemd -u samin --hp /home/samin"

//Then follow the instruction and run the command from the terminal

//It should up and run the node socket server

```

```
Node Error
   sudo npm install -g --force nodemon
   sudo pkill node
   sudo killall node
   ps aux | awk '/node/{print $2}' | xargs kill -9
  
```




































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
