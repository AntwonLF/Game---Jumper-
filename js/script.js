const canvasWidth = 800;
const canvasHeight = 600;
const playerYPosition  = canvasHeight - 30;
const keys = {
    space: false,
};

document.body.addEventListener("keydown", function(event) {
     if (event.code === "Space") {
        keys.space = true;
    }
});

document.body.addEventListener("keyup", function (event) {
    if (event.code === "Space") {
        keys.space = false;
    }
});



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
        this.player = new Player(30, 30, 10, playerYPosition);
        this.player.draw();
        this.updateInterval = setInterval(this.updateCanvas.bind(this), 1000 / 60);
    },

    updateCanvas: function () {
        this.clearCanvas();
        this.player.move();
        this.player.draw();

        if(keys.space) {
            this.player.jump();
        }
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
        this.fallSpeed = 10;
        this.isJumping = false;
        this.jumpSpeed = 7.5;
        this.jumpHeight = 10;
        this.jumpDistance = 0;
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
        if (this.isJumping) {
            if (this.jumpDistance < this.jumpHeight) {
            this.y -= this.jumpSpeed;
            this.jumpDistance += this.jumpspeed;
        } else {
            this.isJumping = false;
            this.jumpDistance = 0;
         }
        } else {
            this.y += this.fallSpeed;
            this.stopPlayer();
      }
    }

    stopPlayer() {
        if (this.y + this.radius >= gameCanvas.canvas.height) {
            this.y = gameCanvas.canvas.height - this.radius;
            this.resetJump();
        }
    }

    jump() {
        if(!this.isJumping) {
            this.isJumping = true;
        }
    }
    resetJump() {
        this.isJumping = false;
    }
}


function startGame() {
    gameCanvas.start();
}

startGame();
