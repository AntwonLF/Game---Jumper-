const canvasWidth = 600;
const canvasHeight = 400;
const player = 0;
const playerYPosition = 200;

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
    
function createPlayer() {
    
}
}

startGame();


