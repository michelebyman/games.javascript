// Hämtar canvasen
var canvas = document.getElementById("myCanvas");

// Gör så vi kan rita på kanvasen
var ctx = canvas.getContext("2d");



/*Definerar två värden på kanvasen som vi kan använda för att positionera ut bollen*/
var x = canvas.width/2;
var y = canvas.height-30;

/*Definerar två värden på kanvasen som vi kan använda för att positionera ut bollen på nytt så det ser ut som den rör på sig
vi ökar x och y med 1 pixlel varje 10-millisekund*/
var dx = 1;
var dy = -1;

//Bollens radie
var ballRadius = 12;

//Paddel som ska styras
var paddleHeight = 8;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

//sparar värden för paddeln
var rightPressed = false;
var leftPressed = false;

//Brickornas information
var brickRowCount = 6;
var brickColumnCount = 10;
var brickWidth = 89;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 50;
var brickOffsetLeft = 10;

//räknar poängen
var score = 0;

//liv till spelaren
var lives = 3;

var bricks = [];
for(var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//kollar om en knapp är nedtryckt eller ej
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// funktion för att styra paddeln med musen
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

//funktioner för att kolla om vi trycker eller ej
function keyDownHandler(e) {
    if(e.key == 39 || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == 37 || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == 39 || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == 37 || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// kollision med brickorna
function collisionDetection() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    getRandomColor();
                    if(score == brickRowCount*brickColumnCount) {
                      alert("YOU WIN, CONGRATULATIONS! YOUR SCORE: " + score);
                      document.location.reload();
                    }
                }
            }
        }
    }
}

//skriver ut poängen på kanvasen
function drawScore() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: "+score, 150, 30);
}

//skriver ut liven på kanvasen
function drawLives() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Lives: "+lives, canvas.width-255, 30);
}


// funktion som ritar ut bollen
function drawBall() {
  //används för att starta det som ska ritas på kanvasen
  ctx.beginPath();
  // ritar ut en cirkel med diameter 10px
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  //stylar med färg
  ctx.fillStyle = "purpl";
  //ritar ut det på kanvasen
  ctx.fill();
  //stänger
  ctx.closePath();
}

// funktion som ritar ut paddeln
function drawPaddle() {
    ctx.beginPath();
    // ritar ut en rektangel
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

// genererar en random färg
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(color);
  return color;
}

//ritar ut brickorna
function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "orange";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}



function draw() {
  //tar bort den gamla bollen efter sig
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //kallar på funktionener
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();


  // kollar om bollen nuddar kanterna och ändrar riktning
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    getRandomColor();
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      //ökar hastigheten efter varje paddelträff
      dx+=0.3;
      dy-=0.3;
      getRandomColor();
    }
    else {
      lives--;
    if (!lives) {
      alert("GAME OVER You scored: " + score);
      document.location.reload();
    } else {
      x = canvas.width / 2;
      y = canvas.height - 30;
      dx = 2;
      dy = -2;
      paddleX = (canvas.width - paddleWidth) / 2;
    }
  }
}
  //styr paddeln
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  //uppdaterar x och y positionen med 1px repsektive -1px hela tiden.
  x += dx;
  y += dy;
}

// kallar på funktionen varje 10-millisekund
var interval = setInterval(draw, 10);
