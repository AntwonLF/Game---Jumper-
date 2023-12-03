const canvasWidth = 800;
const canvasHeight = 600;
const playerYPosition = 100;


const gameCanvas = {
    canvas: document.createElement('canvas'),
    player: null,

    start: function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.player = new Player(30, 30, 10);
        this.player.draw();
    } 
};


function Player(radius, xPos) {
    this.radius = radius
    this.x = xPos;
    this.y = playerYPosition;

// Drawing circle using "ctx" 2D rendering context of the canvas
    this.draw = function() {
        const ctx = gameCanvas.context;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    };
}

function startGame() {
    gameCanvas.start();
    
}

startGame();


