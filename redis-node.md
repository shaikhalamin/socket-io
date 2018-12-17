#https://redis.io/commands/hdel
```javascript
You can use same hmset/hset based on how many you want to add or update

var redis = require('redis');
var client = redis.createClient(); //creates a new client

client.on('connect', function() {
    console.log('connected');
});

client.hmset('frameworks', {
    'javascript': 'AngularJS',
    'css': 'Bootstrap',
    'node': 'Express'
});
Say you initially have this and want to add db : mongo, and want to update node: Express4 then you can just use

//If you know will update only one use hset instead
client.hmset('frameworks', {
    'node': 'Express4',
    'db' : 'MongoDB'
});


//delete hash map 
#https://redis.io/commands/hdel

client.hdel('offer', id)

```
