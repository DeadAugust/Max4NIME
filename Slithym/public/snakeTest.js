// Open and connect input socket
let socket = io('/');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Player connected");
  socket.emit('gimmeMap');
});

//map setup
let map = [];
let mapWidth, mapHeight;
socket.on('heresMap', function(mapInfo) {
    map = mapInfo.m;
    mapWidth = mapInfo.w;
    mapHeight = mapInfo.h;
    console.log('map received:');
});

function setup(){
    //maybe adjust to make relative later?
    createCanvas(windowWidth, windowHeight);
    noStroke();
    rectMode(CORNER);

    // snake = new Snake();

}

function draw(){
    background(120);
    //for all
    // snake.update();
    // snake.show();
}

function keyPressed(){
    if (keyCode === UP_ARROW || keyCode === 87){ //w
        socket.emit('up');
    }
    if (keyCode === DOWN_ARROW || keyCode === 83){//s
        socket.emit('down');
        // snake.setDir(0,1);
    }
    if (keyCode === LEFT_ARROW || keyCode === 65 ){//a
        // snake.setDir(-1,0);
        socket.emit('left');
    }
    if (keyCode === RIGHT_ARROW || keyCode === 68 ){//d
        // snake.setDir(1,0);
        socket.emit('right');
    }
}