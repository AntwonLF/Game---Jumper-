const canvasWidth = 800;
const canvasHeight = 600;
const playerYPosition = 100;

const gameCanvas = {
    canvas: document.getElementById('gameCanvas'),
    player: null,
    fallSpeed: 2,
    updateInterval: null,

    start: function () {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.player = new Player(30, 30, 10);
        console.log("Player initial position:", this.player.x, this.player.y);
        this.player.draw();
        this.updateInterval = setInterval(this.updateCanvas.bind(this), 1000 / 60);
    },

    updateCanvas: function () {
        this.clearCanvas();
        this.player.move();
        this.player.draw();
    },

    clearCanvas: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

class Player {
    constructor(radius, xPos, fallSpeed, playerYPos) {
        this.radius = radius;
        this.x = xPos;
        this.y = playerYPos;
        this.fallSpeed = fallSpeed;
    }

    draw() {
        const ctx = gameCanvas.context;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.y += this.fallSpeed;
        this.stopPlayer();
    }

    stopPlayer() {
        if (this.y + this.radius >= gameCanvas.canvas.height) {
            this.fallSpeed = 0;
            this.y = gameCanvas.canvas.height - this.radius;
        }
    }
}

function startGame() {
    gameCanvas.start();
}

startGame();
