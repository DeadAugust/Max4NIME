//template based on Coding Train/Shiffman's Snake coding challenge #115
// export default class Snake {

// now in server.js...
/*
class Snake {
    constructor(){
        // this.body[0] = createVector(0, 0);
        // this.id = id;
        this.xDir = 0;
        this.yDir = 0;
        // this.col = color(int(random(75, 255)), int(random(75, 255)), int(random(75, 255)));
        // this.col = col;
        this.col = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
        this.startX = Math.floor(Math.random() * mapWidth);
        this.startY = Math.floor(Math.random() * mapHeight);
        this.body = [
            [startX, startY]
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
    // show(){
    //     fill(0);
    //     rect(this.body[0].x, this.body[0].y, 10, 10);
    // }
    eat(foodX, foodY){
        this.body.unshift([foodX, foodY]);
    }
}
*/