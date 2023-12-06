const canvasWidth = 800;
const canvasHeight = 600;
const playerYPosition  = canvasHeight - 30;
let score = 0;

const keys = {
    space: false,
};


    const audioContext = new (window.webkitAudioContext || window.AudioContext)();
    const backgroundMusicUrl = 'musicAssests/lofi-christmas.mp3';
    const backgroundMusic = new Audio();

    backgroundMusic.src = backgroundMusicUrl;
    backgroundMusic.loop = true;

    const backgroundMusicSource = audioContext.createMediaElementSource(backgroundMusic);backgroundMusicSource.connect(audioContext.destination);

    backgroundMusic.addEventListener('canplaythrough', () => {
        backgroundMusic.play();
    });

const thudSound = new Audio("musicAssests/sounds/thud.mp3");

function playThudSound() {
    thudSound.currentTime = 0;
    thudSound.play();
    thudSound.volume = 0.5;
}



function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createBlocks() {
    const topBlock = new Block(randomNumber(65, 100), randomNumber(65, 100), randomNumber(3, 7), 0, true);
    const bottomBlock = new Block(randomNumber(65, 100), randomNumber(65, 100), randomNumber(3, 7), canvasHeight - topBlock.height, false);

    return [topBlock, bottomBlock];
}

document.body.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        keys.space = true;

        if (gameCanvas.gameOver) {
            restartGame();
        }
    }
});
    
document.body.addEventListener("keyup", function (event) {
    if (event.code === "Space") {
        keys.space = false;
    }
});


function restartGame() {
 if (!gameCanvas.isRunning)   {
    gameCanvas.gameOver = false;
    gameCanvas.clearCanvas();
    gameCanvas.drawRestartMessage();
    gameCanvas.drawScore();
    gameCanvas.addRestartSpaceBarListener();


    gameCanvas.player = new Player(30, 30, 10, playerYPosition);
    gameCanvas.player.draw();
    gameCanvas.block = createBlocks();

    gameCanvas.updateInterval = setInterval(gameCanvas.updateCanvas.bind(gameCanvas), 1000 / 60);

    //Clears existing interval before starting a new one
    clearInterval(gameCanvas.updateInterval);

    score = 0;
   }
}

const gameCanvas = {
    canvas: document.getElementById('gameCanvas'),
    player: null,
    block: null,
    fallSpeed: 2,
    updateInterval: null,
    gameOver: false,
    isRunning: false,

    start: function () {
        if (!this.isRunning) {
            this.isRunning = true;
       
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.player = new Player(30, 30, 10, playerYPosition);
        this.player.draw();

        this.block = createBlocks();

        this.updateInterval = setInterval(this.updateCanvas.bind(this), 1000 / 60);
       }
    },

    end: function () {
        // console.log("GAME OVER - Better Luck Next Time");
        this.gameOver = true;
        this.clearCanvas();
        this.drawGameOverMessage();
        this.drawRestartMessage();
        this.addRestartSpaceBarListener();
        score = 0;
        this.player = null;
        this.block = null;
    },

    stopCanvas: function () {
        // console.log("GAME OVER - Better Luck Next Time");
        this.isRunning = false;
        clearInterval(this.updateInterval);
    },

    detectCollision: function () {
      
        const player = this.player;
        const blocks = this.block;
        let CollisionDetected = false;

        for (let i = 0; i < this.block.length; i++) {
            const block = blocks[i];
            const playerTop = player.y - player.radius;
            const playerBottom = player.y + player.radius;
            const playerLeft = player.x - player.radius;
            const playerRight = player.x + player.radius;

            const blockTop = block.y;
            const blockBottom = block.y + block.height;
            const blockLeft = block.x;
            const blockRight = block.x + block.width;

        if (
           playerBottom > blockTop &&
           playerTop < blockBottom &&
           playerRight > blockLeft &&
           playerLeft < blockRight
        ) {

            CollisionDetected = true;
            break;
             
        }
      }
        if (CollisionDetected) {            clearInterval(this.updateInterval);
            this.end();
            // playThudSound();
        }
    },

    drawScore: function () {
        const ctx = this.context;
        ctx.font = "20px Arial";
        ctx.fillStyle = "green";
        ctx.fillText("Score: " + score, 10, 20);
    },

    drawRestartMessage: function () {
       if (this.gameOver) { 
            const ctx = this.context;
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";
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
        ctx.fillStyle = "green";
        ctx.fillText("Score: " + score, canvasWidth / 2 - 30, canvasHeight / 2 + 20);
    },

    updateCanvas: function () {
        if (this.gameOver) {
            return;
        }
            this.clearCanvas();
            this.player.move();
            this.player.draw();
        
        // Loops through each block in gameCanvas.blocks
            for (let i = 0; i < this.block.length; i++) {
                this.block[i].draw();
                this.block[i].attackPlayer();
            }
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
        this.fallSpeed = 7;
        this.isJumping = false;
        this.jumpSpeed = 14;
        this.jumpHeight = 10;
        this.jumpDistance = 0;
    }

    draw() {
        const ctx = gameCanvas.context;
        ctx.fillStyle = "green";
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

        this.checkCanvasBoundaries();
    }

    checkCanvasBoundaries() {
        if (this.y < 0) {
            this.y = 0;
        }

        if(this.y + this.radius > gameCanvas.maxHeight) {
            this.y = gameCanvas.maxHeight - this.radius;
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
    constructor(width, height, speed, yPos, isTop) {
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.isTop = isTop;
        this.x = canvasWidth; 
        this.y = isTop ? yPos : yPos - height; // Adjust the height for top and botton blocks
    }

    returnToAttackPosition() {
        if (this.x < 0) {
            this.width = randomNumber(25, 50);
            this.height = randomNumber(50, 250);
            this.speed = randomNumber(7, 15);
            score++;
            this.x = canvasWidth;
            this.y = this.isTop ? randomNumber(0, canvasHeight / 2 - this.height) : canvasHeight - this.height;
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
            // console.log("Player Hit");
            this.returnToAttackPosition();
            gameCanvas.stopCanvas();
            endGame();
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
    backgroundMusic.play();
    gameCanvas.start();
    gameCanvas.block = createBlocks();
}

function endGame() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    gameCanvas.end();
    playThudSound();
}

startGame();



