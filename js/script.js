const canvasWidth = 800;
const canvasHeight = 600;
const playerYPosition  = canvasHeight - 30;
let score = 0;

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
    block: null,
    fallSpeed: 2,
    updateInterval: null,
    gameOver: false,

    stopCanvas: function () {
        console.log("GAME OVER - Better Luck Next Time");
        clearInterval(this.updateInterval);
    },

    detectCollision: function () {
        const player = this.player;
        const block = this.block;

        if (
            player.x + player.radius >= block.x &&
            player.x - player.radius <= block.x + block.width &&
            player.y + player.radius >= block.y && 
            player.y - player.radius <= block.y + block.height
        ) {
            console.log("GAME OVER - Better Luck Next Time");
            clearInterval(this.updateInterval);
            this.end();
        }
    },

    drawScore: function () {
        const ctx = this.context;
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + score, 10, 20);
    },

    start: function () {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.player = new Player(30, 30, 10, playerYPosition);
        this.player.draw();

        this.block = createBlock();

        this.updateInterval = setInterval(this.updateCanvas.bind(this), 1000 / 60);
    },

    end: function () {
        console.log("GAME OVER - Better Luck Next Time");
        this.gameOver = true;
        this.clearCanvas();
        this.drawGameOverMessage();
        this.drawRestartMessage();
        this.addRestartSpaceBarListener();
        score = 0;
        this.player = null;
        this.block = null;
    },

    drawRestartMessage: function () {
       if (this.gameOver) { 
            const ctx = this.context;
            ctx.font = "20px Arial";
            ctx.fillStyle = "black";
            ctx.fillText("Press space bar to start", canvasWidth / 2 - 130, canvasHeight / 2 + 50);
       }
    },

    addRestartSpaceBarListener: function () {
        const restartHandler = (event) => {
            if (event.code === "Space") {
                document.removeEventListener("keydown", restartHandler);
                startGame();
            }
        };

        document.addEventListener("keydown", restartHandler);
    },

    drawGameOverMessage: function () {
        const ctx = this.context;
        ctx.font = "40px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("GAME OVER", canvasWidth / 2 - 100, canvasHeight / 2 - 20);
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + score, canvasWidth / 2 - 30, canvasHeight / 2 + 20);
    },

    updateCanvas: function () {
        if (this.gameOver) {
            return;
        }
            this.clearCanvas();
            this.player.move();
            this.player.draw();

            this.block.draw();
            this.block.attackPlayer();

            this.detectCollision();

            this.drawScore();

            if(keys.space) {
                this.player.jump();
            }
    },

    clearCanvas: function () { 
        this.context.beginPath();
        this.context.clearRect(0, 0, 800, 600);
    },  
};

class Player {
    constructor(radius, xPos, fallSpeed, playerYPos) {
        this.radius = radius;
        this.x = xPos;
        this.y = playerYPos;
        this.fallSpeed = 5;
        this.isJumping = false;
        this.jumpSpeed = 10;
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
        if (!this.isJumping) {
            this.isJumping = true;
        }
    }

    resetJump() {
        this.isJumping = false;
    }
}

class Block {
    constructor(width, height, speed) {
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.x = canvasWidth; 
        this.y = canvasHeight - this.height;
    }

    returnToAttackPosition() {
        if (this.x < 0) {
            this.width = randomNumber(50, 100);
            this.height = randomNumber(50, 250);
            this.speed = randomNumber(5, 10);
            score++;
            this.x = canvasWidth;
            this.y = canvasHeight - this.height;
        }
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
            gameCanvas.stopCanvas();
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

function startGame() {
    gameCanvas.start();
}

function endGame() {
    gameCanvas.end();
}

startGame();
