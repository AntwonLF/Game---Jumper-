const canvasWidth = 800;
const canvasHeight = 600;
const playerYPosition  = canvasHeight - 30;
const audioContext = new (window.AudioContext || window.AudioContext)();
const backgroundMusic = new Audio('musicAssets/sounds/lofi-christmas.mp3');
const backgroundImage =  new Image ();
const thudSound = new Audio("musicAssets/sounds/thud.mp3");
let score = 0;

const keys = {
    space: false,
};

class Snowflake {
    constructor() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 5 + 1;
        this.speed = Math.random() * 1 + 1;
    }

    draw() {
        const ctx = gameCanvas.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    update() {
        this.y += this.speed;
        if (this.y > canvasHeight) {
            this.y = 0;
            this.x = Math.random() * canvasWidth;
        }
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

        this.snowflakes = [];
        for (let i = 0; i < 100; i++) {
            this.snowflakes.push(new Snowflake());
        }
         this.updateInterval = setInterval(this.updateCanvas.bind(this), 1000 / 60);
       }
    },

    end: function () {
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
        this.isRunning = false;
        clearInterval(this.updateInterval);
    },

    detectCollision: function () {
       const { player, block } = this;
        let collisionDetected = false;
    
        for (let i = 0; i < block.length; i++) {
            const { x, y, radius } = player;
            const { x: blockX, y: blockY, width, height } = block[i];
    
            if (
                y + radius >= blockY &&
                y - radius <= blockY + height &&
                x + radius >= blockX &&
                x - radius <= blockX + width
            ) {
                collisionDetected = true;
                break;
            }
        }
    
        if (collisionDetected) {
            clearInterval(this.updateInterval);
            this.end();
        }
        playThudSound();
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
            ctx.fillText("Press space bar to start", canvasWidth / 2 - 155, canvasHeight / 2 + 50);
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
        ctx.fillText("Jumper", canvasWidth / 2 - 125, canvasHeight / 2 - 20);
        ctx.font = "20px Arial";
        ctx.fillStyle = "green";
        ctx.fillText("Score: " + score, canvasWidth / 2 - 100, canvasHeight / 2 + 20);
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

            for (let i = 0; i < this.snowflakes.length; i++) {
                this.snowflakes[i].update();
                this.snowflakes[i].draw();
            }

        this.detectCollision();
        this.drawScore();

        if(keys.space) {
            this.player.jump();
         }
    },

    clearCanvas: function () { 
        this.context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
        this.context.clearRect(0, 0, 800, 600);
    },  
};
function playBackgroundMusic () {
    backgroundMusic.src = backgroundMusic;
    backgroundMusic.loop = true;
    backgroundMusic.autoplay = false;

    function setVolume(volume) {
        backgroundMusic.volume = volume;
    }
    setVolume(0.2);
    backgroundMusic.play();

    return backgroundMusic;
}

function playThudSound() {
    thudSound.currentTime = 0;
    thudSound.play();
    thudSound.volume = 1;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createBlocks() {
    const topBlock = new Block(randomNumber(65, 100), randomNumber(65, 100), randomNumber(3, 7), 0, true);
    const bottomBlock = new Block(randomNumber(65, 100), randomNumber(65, 100), randomNumber(3, 7), canvasHeight - topBlock.height, false);

    return [topBlock, bottomBlock];
}


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
        this.playerImage = new Image();
        this.playerImage.src = 'assets/santa.png';
    }

    draw() {
        const ctx = gameCanvas.context;
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(this.playerImage, -(this.x + this.radius), this.y - this.radius, this.radius * 2, this.radius * 2);  
        ctx.restore(); 
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
        this.image = new Image();
        this.image.src = isTop ? 'assets/snowflake.png' : 'assets/christmasTree.png'  

    }

    returnToAttackPosition() {
        if (this.x < 0) {
            this.width = this.width;
            this.height = randomNumber(75, 200);
            this.speed = randomNumber(7, 12);
            score++;
            this.x = canvasWidth;
            this.y = this.isTop ? randomNumber(0, canvasHeight / 2 - this.height) : canvasHeight - this.height;
            this.image.src = this.isTop ?  'assets/snowflake.png' : 'assets/christmasTree.png';
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
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    
        if (this.x + this.width < 0) {
            this.returnToAttackPosition();
        }
    
        this.x -= this.speed;
    }
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
function startGame() {
    backgroundMusic.play();
    gameCanvas.start();
    gameCanvas.block = createBlocks();
}

function endGame() {
   backgroundMusic.pause();
   backgroundMusic.currentTime = 0;
    gameCanvas.end();
}

startGame();




    