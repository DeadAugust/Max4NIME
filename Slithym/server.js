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
let mapWidth = 20;
let mapHeight = 20;
for (let y = 0; y < mapHeight; y++) {
  let mapRow = [];
  for (let x = 0; x < mapWidth; x++) {
    // let index = ((y * mapWidth) + x);
    // map[index] = 0;
    mapRow.push([0]);
  }
  map.push(mapRow);
}
//food
let food = [];
let foodCount = 0;
//snake lengths to send to max
// import Snake from './public/snake.js';
// const snake = require('./public/snake.js');
let snakes = {};
//max info
let beat = 500;

//update heartbeat
function updateMap(){
  //just go through the snakes and food and update map
  // reset map
  map = [];
  for (let y = 0; y < mapHeight; y++) {
    let mapRow = [];
    for (let x = 0; x < mapWidth; x++) {
      mapRow.push([0]);
    }
    map.push(mapRow);
  }
  //show snakes
  for (let s in snakes){
    snakes[s].update();
    console.log(snakes[s].body[0]);
    if (map[snakes[s].body[0][0], snakes[s].body[0][1]] == [0, 255, 0]){
      // snakes[s].eat();
    } else if (snakes[s].body.length != 1) {
      let last = snakes[s].body.length - 1;
      snakes[s].body.splice(last, 1);
    }
    for (let b = 0; b < snakes[s].body.length; b++){
      let newMapX = snakes[s].body[b][0];
      let newMapY = snakes[s].body[b][1];
      // console.log(newMapX, newMapY);
      map[newMapX][newMapY] = snakes[s].col;
    }
  }
  //spawn/show food
  let foodRate;
  if (users.length <= 2){
    foodRate = 8;
  } else if (users.length <= 4){
    foodRate = 4;
  } else {
    foodRate = 2;
  }
  foodCount += 1;
  console.log(foodCount, foodRate);
  if (foodCount % foodRate == 0){
    let randX = Math.floor(Math.random()*mapWidth);
    let randY = Math.floor(Math.random()*mapHeight);
    // console.log(map[randX][randY]);
    if (map[randX][randY][0] == 0){
      map[randX][randY] = [0, 255, 0];
      food.push([randX, randY]);
      console.log(food);
    }
  }
  for (let f = 0; f < food.length; f++){
    let fX = food[f][0];
    let fY = food[f][1];
    map[fX][fY] = [0, 255, 0];
  }
}
setInterval(function(){
  if(users){
    updateMap();
  }
  players.emit('update', map);
}, beat); //slow because move to beat?


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
    socket.on('gimmeMap', function () {
      let mapInfo = {
        m: map,
        w: mapWidth,
        h: mapHeight
      }
      socket.emit('heresMap', mapInfo);
    });

    // ready to play msg
    // move msgs
    socket.on('up', function () {
      snakes[socket.id].xDir = 0;
      snakes[socket.id].yDir = -1;
      console.log(snakes);
    });
    socket.on('down', function () {
      snakes[socket.id].xDir = 0;
      snakes[socket.id].yDir = 1;
    });
    socket.on('left', function () {
      snakes[socket.id].xDir = -1;
      snakes[socket.id].yDir = 0;
    });
    socket.on('right', function () {
      snakes[socket.id].xDir = 1;
      snakes[socket.id].yDir = 0;
    });

    // Listen for this client to disconnect
    // Tell everyone client has disconnected
    socket.on('disconnect', function () {
      io.sockets.emit('disconnected', socket.id);
      // Remove socket from player queue
      for (let s = users.length - 1; s >= 0; s--) {
        if (users[s].id == socket.id) {
          users.splice(s, 1);
        }
      }
      for (let s in snakes) {
        if (snakes[s].id == socket.id) {
          console.log('sssss');
          delete snakes[s];
        }
      }
    });
  });

class Snake {
  constructor(id) {
    // this.body[0] = createVector(0, 0);
    this.id = id;
    this.xDir = 0;
    this.yDir = 0;
    // this.col = color(int(random(75, 255)), int(random(75, 255)), int(random(75, 255)));
    // this.col = col;
    this.col = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    this.startX = Math.floor(Math.random() * mapWidth);
    this.startY = Math.floor(Math.random() * mapHeight);
    this.body = [
      [this.startX, this.startY]
    ];
  }
  // setDir(x, y) {
  //   this.xDir = x;
  //   this.yDir = y;
  // }
  update() {
    // this.body[0].x += this.xDir;
    // this.body[0].y += this.yDir;
    //trying to prevent starting with two identical body segments
    if (this.xDir != 0 || this.yDir != 0){
      let newCell = [];
      let oldX = this.body[0][0];
      let oldY = this.body[0][1];
      if (oldX + this.xDir < mapWidth && oldX + this.xDir >= 0 
      && oldY + this.yDir < mapHeight && oldY + this.yDir >= 0){
        newCell.push(oldX + this.xDir);
        newCell.push(oldY + this.yDir);
        this.body.unshift(newCell);
      } else {
        this.die();
      }
    }
    // let last = this.body.length - 1;
    // this.body.splice(last, 1);
  }
  die(){
    console.log('snake dead');
  }
  // eat(foodX, foodY) {
  //   this.body.unshift([foodX, foodY]);
  // }
}