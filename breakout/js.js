/*******Här Börjar JavaScript Koden*************/

/*********************
* Här är funktionen som startar spelet
*/
//Ritar ut allt på canvasen och kallar på funktioner
function init() {
  //kallar på funktionener
  clearBall();
  drawBricks();
  drawBall();
  drawPaddle.writePaddle();
  drawText.writeScore();
  drawlives.writelives();
  collisionDetection();
  collisionDetectionTwo();
  controller();
  ballSpeed();
}

/************************Kod-forsätter*******************************/

/**************DOM hantering börjar här****************/

// Ändra en färg på sidan med hjälp utav style.background-color, DOM.
document.querySelector("body").style.backgroundColor = "teal";

//skriver ut spelarens namn och ålder på skärmen, DOM, addEventListener
document.querySelector("canvas").addEventListener("mouseover", insert);
document.addEventListener("keydown", insert);

//kollar om en knapp är nedtryckt eller ej eller om musen vidrörs
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

/**********************DOM SLUTAR HÄR******************************************/

/*********SAMLAR VARIABLER PÅ SAMMA STÄLLEN*******************/

// Hämtar canvasen, DOM
var canvas = document.getElementById("myCanvas");

// Gör så vi kan rita på kanvasen, DOM
var ctx = canvas.getContext("2d");

//Hämtar en divvar från html, DOM
var divFromHtml = document.querySelector(".stars");
var saveDiv = document.querySelector(".rating");

/*Definerar två värden på kanvasen som vi kan använda för att positionera ut bollen*/
var x = (canvas.width / 2);
var y = (canvas.height - 30);

/*Definerar två värden på kanvasen som vi kan använda för att positionera ut bollen på nytt så det ser ut som den rör på sig
vi ökar x och y med 1 pixlel varje 10-millisekund*/
var dx = 2;
var dy = -2;

//Bollens radie
var ballRadius = 20;

//Paddel som ska styras
var paddleHeight = 12;
var paddleWidth = 110;
var paddleX = (canvas.width-paddleWidth)/2;

//Sparar värden för paddeln
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

//Omdömme av spelet
var rate;

// För att skriva ut namn och att det bara sker en gång
var hasPrinted = false;

// Sparar en färg sen används den för en random färg
var randomColor;


// Året nu
var date = new Date();
var now = date.getFullYear();

// Spelarens namn
var name = prompt("Player type your name");

//År spelaren är född
var birthYear = prompt("Year you were born?");

// tilldelas i funktionen som skriver ut namnet på player.
var innerStyle;

// ger användaren möjlighet att välj antal liv
var checkLives = prompt("How many lives do you want to start with? (1-3)");
console.log(checkLives);

/*****************************Globala VARIABLER SLUTAR HÄR*******************/



/****FUNKTIONER med olika metoder och tekninker, If, loops, DOM, Array-metoder, callbacks.****/

/*******funktioner som kallas av Init*********/

//tar bort den gamla bollen efter sig
function clearBall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//ritar ut brickorna
function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "green";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// funktion som ritar ut bollen
function drawBall() {
  //används för att starta det som ska ritas på kanvasen
  ctx.beginPath();
  // ritar ut en cirkel med diameter ballRadius
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  //stylar med färg
  ctx.fillStyle = randomColor;
  //ritar ut det på kanvasen
  ctx.fill();
  //stänger
  ctx.closePath();
}

// kollision med brickorna, finns en till kollison detektor nedanför.
function collisionDetection() {
    // Loopar igenom en 2D array för att se om de kolliderar
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x + brickWidth && y - ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    randomColor = getRandomColor();
                    if(score == brickRowCount * brickColumnCount) {
                      alert("YOU WIN, CONGRATULATIONS! YOUR SCORE: " + score);
                      // stop funktion
                      myStopFunction(interval);
                      //Ratar spelet och sparar i en variabel
                      rate = prompt("Rate this game, 1-5 Stars");
                      //skapar en array och använder en array-metod för att pusha rating.
                      var gameRate = [];
                      gameRate.push(rate);
                      console.log(gameRate);
                      innerStyle.style.visibility = "hidden";
                      rateGame(rate);
                      //pausar och laddar om sidan efter 5sek.
                      setTimeout(location.reload.bind(location), 5000);
                    }
                }
            }
        }
    }
}

function collisionDetectionTwo() {
  // kollar om bollen nuddar kanterna och ändrar riktning
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    //ändrar färg på bollen varje gång den träffar kanterna
    randomColor = getRandomColor();
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  //Kollar om bollen nuddar och är på samma ställe som paddeln
  else if (y + dy > canvas.height - paddleHeight - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      //ökar hastigheten efter varje paddelträff
      dx+=0.3;
      dy-=0.3;
      //ändrar färg på bollen varje gång den träffar paddeln
      randomColor = getRandomColor();
    }
    else {
      lives--;
      console.log(lives);
      if (lives == 0) {
        alert("GAME OVER You scored: " + score);
        myStopFunction(interval);
        var rate = prompt("Rate this game, 1-5 Stars");
        var gameRate = [];
        gameRate.push(rate);
        console.log(gameRate);
        innerStyle.style.visibility = "hidden";
        rateGame(rate);
        setTimeout(location.reload.bind(location), 5000);
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
}

function controller() {
//Styr paddeln med en astighet av 7px.
if (rightPressed && paddleX < canvas.width - paddleWidth) {
  paddleX += 7;
} else if (leftPressed && paddleX > 0) {
  paddleX -= 7;
}
}

function ballSpeed() {
  //uppdaterar x och y positionen med 1px repsektive -1px hela tiden.
  x += dx;
  y += dy;
}

/******funktioner som kallas av init avlsutas här********/

/************Övriga funktioner**********************/

function rateGame(rate) {
  switch (rate) {
    case "1":
    thankYou();
      stars(1);
      break;
    case "2":
    thankYou();
    stars(2);
      break;
    case "3":
    thankYou();
    stars(3);
      break;
    case "4":
    thankYou();
    stars(4);
      break;
    case "5":
    thankYou();
    stars(5);
        break;
  }
}


function insert() {
  if(!hasPrinted){
    var player = document.createElement("p");
    player.setAttribute("class", "player");
    player.textContent = "Player: " + playerOne[0] + " Age: " + playerOne[1];
    document.body.before(player);
    innerStyle = document.querySelector("p");
    innerStyle.style.fontSize = "50px";
    innerStyle.style.opacity = "0.5";
    innerStyle.style.textAlign = "center";
    document.removeEventListener("mouseover", insert, false);
    document.removeEventListener("keydown", insert, false);

    hasPrinted = true;
  }
}

// funktion för att styra paddeln med musen
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - (paddleWidth / 2);
    }
}

//funktioner för att kolla om vi trycker på tangenterna
function keyDownHandler(e) {
    if(e.key == 39 || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == 37 || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

// funktion för att kolla om vi inte trycker på tangenter
function keyUpHandler(e) {
    if(e.key == 39 || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == 37 || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// genererar en random färg
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// stoppar setInterval funktioen som är sparad i en vaiabel - callback
function myStopFunction(variable) {
  clearInterval(variable);
}

//Funktion med loop för att skriva lägga ut omdömmet i form av bilder.DOM.
function stars(antalGgr) {
  for (var i = 0; i < antalGgr; i++) {
    var picture = document.createElement("img");
    picture.setAttribute("src", "stars.png");
    picture.setAttribute("width", "152");
    picture.setAttribute("height", "114");
    picture.setAttribute("alt", "Star that is rating the game");
    picture.style.alignContent = "space-between";
    picture.style.visibility = "visibility";
    divFromHtml.appendChild(picture);
  }
}

// Funktion med DOM hantering.
function thankYou() {
  var thankYou = document.createElement("h2");
    thankYou.setAttribute("class", "rating");
    thankYou.style.fontSize = "50px";
    thankYou.style.textAlign = "center";
    thankYou.textContent = "Thank You for Rating " + playerOne[0];
    saveDiv.appendChild(thankYou);
}

/********************************FUNKTIONER SLUTAR HÄR*********************/

/*******************OBJEKT MED METODER*************************************/

// Objekt med 2 metoder och array som ritar ut paddeln
var drawPaddle = {
  colors: [],
  findColor: function () {
    for (var i = 0; i < 3; i++) {
      this.colors[i] = getRandomColor();
    }
  },
  numberRandom: [Math.floor(Math.random() * 3)],
  writePaddle: function() {
      ctx.beginPath();
      // ritar ut en rektangel
      ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = this.colors[this.numberRandom];
      ctx.fill();
      ctx.closePath();
  }
};
console.log(drawPaddle.numberRandom);

//Objeckt med metod, skriver ut poängen på kanvasen
var drawText = {
  writeScore: function() {
      ctx.font = "36px Arial";
      ctx.fillStyle = "purple";
      ctx.fillText("Score: "+score, 150, 40);
  }
};

//Objekt med metod som skriver ut liven på kanvasen.
var drawlives = {
  writelives: function() {
      ctx.font = "36px Arial";
      ctx.fillStyle = "purple";
      ctx.fillText("Lives: "+lives, (canvas.width - 255), 40);
  }
};

/***********************OBJEKT MED METODER SLUTAR HÄR**********************************/

/**********************
* ARRAYS MED 2D ARRAY- METODER & 2D ARRAYER MED OBJEKT & LOOPAR
*/

// En 2d array med ett objekt
var playerOne = [
  [],
  [],
  [{
  coDeveloper: "Michele Byman was one of the main developer for this game",
  }],

];

// Spelarens namn och ålder pushas in i de tommar arraysen
console.log(name);
playerOne[0].push(name);
playerOne[1].push(now - birthYear);
console.log(playerOne,playerOne[0], playerOne[1]);

/* skriver ut det som är i array ett på index 2 som skriver ut det som är i nästa array på index 0 som är ett objekt*/
console.log(playerOne[2][0].coDeveloper);
// skriver ut vilken key som finns i 2d arrayen
console.log(Object.keys(playerOne[2][0])[0]);

//liv till spelaren sparas i arrayen med hjälp av en loop och array-metod
var lives = [];
console.log(lives);

//en loop som kollar om liven är mellan 1 och 3 och sedan pushar liven med en array metod & for-loop
while (checkLives != 1 || checkLives != 2 || checkLives != 3) {
  if (checkLives == 1 || checkLives == 2 || checkLives == 3 ) {
    for (var i = checkLives; i > 0; i--) {
       lives.push("life");
       // en array metod som pushar värdena till arrayen
    }
    break;
  } else {
  checkLives  = prompt("How many lives do you want to start with? (1-3)");
  }
}
console.log(lives);

// andrar sedan liven med hjälp av längden på arrayen med hjälp av array-metoden length
lives = lives.length;
console.log(lives);

//skapar två arrays med värden för att sedan rita ut brickorna
var bricks = [];
for(var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

/**********************ARRAYS SLUTAR HÄR***********************************/


//sätter en färg på paddeln så den inte ändras var tionde millisekund.
drawPaddle.findColor();

/*******************Variabel som innehåller funktion***********/

// kallar på funktionen init varje 10-millisekund
var interval = setInterval(init, 10);
