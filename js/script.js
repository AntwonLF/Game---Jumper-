const canvasWidth = 800;
const canvasHeight = 600;
const playerYPosition  = canvasHeight - 30;

const keys = {
    space: false,
};

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createBlock() {
    const width = randomNumber(50, 100);
    const height = randomNumber(50, 100);
    const speed = randomNumber(1, 5);

    return new Block(width, height, speed);
}

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

        block.draw();
        block.attackPlayer();

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
            this.jumpDistance += this.jumpSpeed;
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
};

class Block{
    constructor(width, height, speed) {
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.x = canvasWidth; 
        this.y = canvasHeight - this.height;
    }

     returnToAttackPosition() {
        this.width = randomNumber(50, 100);
        this.height = randomNumber(50, 100);
        this.speed = randomNumber(1, 5)
        this.x = canvasWidth;
        this.y = canvasHeight - this.height;
     }

     attackPlayer() {
        const player = gameCanvas.player;
        if (
            player.x + player.radius >= this.x &&
            player.x - player.radius <= this.x + this.width &&
            player.y + player.radius >= this.y && 
            player.y - player.radius <= this.y + this.height
        ) { 
            console.log("Player Hit");
            this.returnToAttackPosition();
        }
    }
    draw() {
        const ctx = gameCanvas.context;
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    
        if (this.x + this.width < 0) {
            this.returnToAttackPosition();
        }
    
        this.x -= this.speed;
    }
}
let block = createBlock();




function startGame() {
    gameCanvas.start();
}

startGame();
