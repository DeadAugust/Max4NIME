// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

// connected players
let users = [];
// map info
let map = [];
let mapWidth = 50;
let mapHeight = 50;
for (let x = 0; x < mapWidth; x++){
  for (let y = 0; y < mapHeight; y++){
    let index = ((y * mapWidth) + x);
    map[index] = 0;
  }
}
//snake lengths to send to max
// import Snake from './public/snake.js';
const snake = require('./public/snake.js');
let snakes = {};
//max info
let beat = 500;

/*
//update heartbeat
function updateMap(){
  // for (let x = 0; x < mapWidth; x++){
  //   for (let y = 0; y < mapHeight; y++){
  //     let index = ((y * mapWidth) + x);
  //     map[index] = 0;
  //   }
  // }
  //just go through the snakes and food and update map
  for (let s in snakes){
    
  }
}
setInterval(function(){
  if(users){
    updateMap();
  }
}, beat); //slow because move to beat?
*/

//player sockets
let players = io.of('/'); 
players.on('connection', 
    function (socket) {

    console.log("We have a new player: " + socket.id);

    // Add socket to queue
    users.push(socket);
    // add snake to server
    let newSnake = new Snake(socket.id);
    // snakes.push(newSnake);
    snakes[socket.id] = newSnake;
    //update map at start
    socket.on('gimmeMap', function(){
        let mapInfo = {
            m: map,
            w: mapWidth,
            h: mapHeight
        }
        socket.emit('heresMap', mapInfo);
    });

    // ready to play msg
    // move msgs
    socket.on('up', function(){
      snakes[socket.id].xDir = 0;
      snakes[socket.id].yDir = -1;
      console.log(snakes);
    });
    socket.on('down', function(){
      snakes[socket.id].xDir = 0;
      snakes[socket.id].yDir = 1;
    });
    socket.on('left', function(){
      snakes[socket.id].xDir = -1;
      snakes[socket.id].yDir = 0;
    });
    socket.on('right', function(){
      snakes[socket.id].xDir = 1;
      snakes[socket.id].yDir = 0;
    });

    // Listen for this client to disconnect
    // Tell everyone client has disconnected
    socket.on('disconnect', function() {
      io.sockets.emit('disconnected', socket.id);
      // Remove socket from player queue
      for(let s = users.length - 1; s >= 0; s--) {
        if(users[s].id == socket.id) {
          users.splice(s, 1);
        }
      }
      for (let s in snakes){
        if(snakes[s].id == socket.id){
          console.log('sssss');
          delete snakes[s];
        }
      }
    });
  });

  class Snake {
    constructor(id){
        // this.body[0] = createVector(0, 0);
        this.id = id;
        this.xDir = 0;
        this.yDir = 0;
        // this.col = color(int(random(75, 255)), int(random(75, 255)), int(random(75, 255)));
        // this.col = col;
        this.col = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
        this.startX = Math.floor(Math.random() * mapWidth);
        this.startY = Math.floor(Math.random() * mapHeight);
        this.body = [
            [this.startX, this.startY]
        ];
    }
    setDir(x,y){
        this.xDir = x;
        this.yDir = y;
    }
    update(){
        this.body[0].x += this.xDir;
        this.body[0].y += this.yDir;
    }
    eat(foodX, foodY){
        this.body.unshift([foodX, foodY]);
    }
}