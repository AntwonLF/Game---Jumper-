const canvasWidth = 600;
const canvasHeight = 400;
let player = 0;
let playerYPosition = 100;

const gameCanvas = {
    canvas: document.createElement('canvas'),
    start: function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    } 
};
function startGame() {
    gameCanvas.start();
    
    player = new createPlayer(30, 30, 10);
}

function createPlayer(radius, xPos) {
    this.radius = radius
    this.x = xPos;
    this.y = playerYPosition;
// Drawing circle using "ctx" 2D rednering context of the canvas
    ctx = gameCanvas.context
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

startGame();


