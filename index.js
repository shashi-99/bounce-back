

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let ballRadius = 6;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;

let dx = 2;
let dy = -2;

let paddleX = canvas.width / 2
let paddleY = canvas.height - ballRadius;
let paddleWidth = 40;
let paddleHeight = 20;

let rightPressed = false;
let leftPressed = false;
let gameRunning = false;


let brickWidth = 50;
let brickHeight = 10;
let row = 3;
let column = 5;
let brickOffsetTop = 12;
let brickOffsetLeft = 10;
let brickPadding = 8;

let score = 0;

let bricks = [];

for(let r=0;r < row;r++){
    bricks[r] = [];
    for(let c=0;c<column;c++)
    {
        bricks[r][c] = {x: 0, y:0, status:1};
    }
}



// keypad handle
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

document.addEventListener("keypress", (e) =>{     //press any key to start game 
    
    if (e.key != undefined){
        gameRunning = true;
    }
})



function keyUpHandler(event){                        //allowing users to control the paddle
    if(event.key == "ArrowRight" || event.key == "Right" ){
        rightPressed = false;
    }else if(event.key == "ArrowLeft" || event.key == "Left"){
        leftPressed = false;
    }
}
function keyDownHandler(event){                           //allowing users to control the paddle
    if(event.key == "ArrowRight" || event.key == "Right"){
        rightPressed = true;
    }else if(event.key == "ArrowLeft" || event.key == "Left"){
        leftPressed = true;
    }
}
function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);      // clear screen
    drawBall();
    createPaddle();
    createBricks();
    drawScore();
    collisionDetection();

    if(gameRunning){
        
        bounce_off_left_and_right_wall();   //bounce the ball off on left and right wall 
        bounce_off_top_wall();              //bounce the ball off on top wall 
       
        ball_hit_bottom_wall();             
        control_paddle_movement();                   // control  movement of paddle 
        
        ballX += dx;
        ballY += dy;
    }

}
// draw ball
function drawBall(){

    ctx.beginPath();
    ctx.arc(ballX,ballY,ballRadius,0,Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    
}

// create paddle
function createPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX,paddleY,paddleWidth,paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
}

// create bricks

function createBricks(){
    
    for(let r=0;r < row;r++){
        for(let c=0;c<column;c++){
            
            if( bricks[r][c].status === 1){

                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
            } 
        }
    }
}
// Collision detection
function collisionDetection(){
    for(let r=0;r < row ;r++){
        for(let c=0;c<column ;c++){
            let b = bricks[r][c];
            if(b.status === 1)
            {
                if(is_ball_hit_brick(b)){

                    dy = -dy;      // direction of ball will change

                    b.status = 0;    
                    score++;
                }
                if(is_game_over()){
                    alert("Congrats ,You Win !");
                    document.location.reload();
                    gameRunning = false;
                    clearInterval(myInterval);
                }
            }
        }
    }
}

function drawScore()
{
    ctx.font = "10px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText(`Score: ${score}`,8,9);
}


function bounce_off_left_and_right_wall(){
    if( ballX + dx > (canvas.width - ballRadius) || ballX + dx < ballRadius){
        dx = -dx;
    }
}

function bounce_off_top_wall(){

    if(ballY + dy < ballRadius){
        dy = -dy;
    } 
}

function ball_hit_bottom_wall(){

    if( ballY + dy > (canvas.height -  ballRadius)){
        if(is_ball_hit_paddle()){
            if(ballY = ballY - paddleHeight)
            {
                dy = -dy;
            }
           
        }else{
            alert("GAME OVER");
            document.location.reload();
            gameRunning = false ;
            clearInterval(myInterval);
        }
    }
}

function control_paddle_movement(){
    if(rightPressed && paddleX < canvas.width - paddleWidth){     
        paddleX += 4;
        
    }else if(leftPressed && paddleX > 0){
        paddleX -= 4;
    }
}

function is_ball_hit_brick(b){
    // console.log(b);
    return  (ballX > b.x && ballX < b.x+ brickWidth && ballY > b.y && ballY < b.y + brickHeight);
   
}
function is_game_over(){        

    return(score === (row*column));
}
function is_ball_hit_paddle(){

    return (ballX + ballRadius > paddleX && ballX < (paddleX + paddleWidth));
}

let myInterval = setInterval(draw,15);