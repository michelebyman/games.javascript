const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images

const ground = new Image();
ground.src = "file:///Users/michelebyman/Documents/jQuery/spel/snake/ground.png";

const foodImg = new Image();
foodImg.src = "file:///Users/michelebyman/Documents/jQuery/spel/snake/food.png";

// create the snake

let snake = [];

snake[0] = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
};

// create the food

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
}

// create the score var and level

let score = 0;
let levelCounter = 1;
let level = "Level"

//control the snake

let d;

document.addEventListener("keydown", direction);

function direction(event) {
  let key = event.keyCode;
  if (key == 37 && d != "RIGHT") {
    d = "LEFT";
  } else if (key == 38 && d != "DOWN") {
    d = "UP";
  } else if (key == 39 && d != "LEFT") {
    d = "RIGHT";
  } else if (key == 40 && d != "UP") {
    d = "DOWN";
  }
}

// cheack collision function
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

// draw everything to the canvas

function draw() {

  ctx.drawImage(ground, 0, 0);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i == 0) ? "red" : "brown";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "white";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.drawImage(foodImg, food.x, food.y);

  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // which direction
  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // if the snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    //level går upp om man äter fem frukter och hastigheten ökar
    if (score % 2 == 0) {
      levelCounter++;
    }
    if (score % 2 == 0 && timing !== 50) {
      timing = (timing - 50);
      speedCounter++;
    }

    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box
    }
    // we don't remove the tail
  } else {
    // remove the tail
    snake.pop();
  }

  // add new Head

  let newHead = {
    x: snakeX,
    y: snakeY
  }

  // game over

  if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)) {
    clearTimeout(game);
  }

  snake.unshift(newHead);

  // score, level and speed

  ctx.fillStyle = "yellow";
  ctx.font = "45px Changa one";
  ctx.fillText(score, 2 * box, 1.6 * box);

  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(levelCounter, 11 * box, 1.6 * box);

  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(level, 7 * box, 1.6 * box);

  ctx.fillStyle = "black";
  ctx.font = "45px Changa one";
  ctx.fillText(speed, 13 * box, 1.6 * box);

  ctx.fillStyle = "black";
  ctx.font = "45px Changa one";
  ctx.fillText(speedCounter, 17 * box, 1.6 * box);

  setTimeout(draw, timing)

}

// spped counter
let speed = "Speed"
let speedCounter = 0;

// call draw function
let timing = 400;
let game = setTimeout(draw, timing);
