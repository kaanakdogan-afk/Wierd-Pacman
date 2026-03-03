//Game State
let gameState = "intro"; 

let pacmanImg;
let ghostImg;
let bgImg;
let introImg;
let endImg;

let player;
let ghost;
let coins = [];
let score = 0;

//Preload
function preload() {
  pacmanImg = loadImage("pacman.png");
  ghostImg = loadImage("ghost.png");
  bgImg = loadImage("bg.jpg");
  introImg = loadImage("intro.jpg");
  endImg = loadImage("end.jpg");
}

//Setup
function setup() {
  createCanvas(800, 800);
  textAlign(CENTER, CENTER);

  player = new Player();
  ghost = new Ghost();
  createCoins();
}

//Draw
function draw() {
  if (gameState === "intro") {
    image(introImg, 0, 0, width, height);
    drawStartButton();
  } else if (gameState === "play") {
    playGame();
  } else if (gameState === "end") {
    image(endImg, 0, 0, width, height);
    drawRestartButton(); // moved lower
  }
}

//Play
function playGame() {
  image(bgImg, 0, 0, width, height);

  for (let i = coins.length - 1; i >= 0; i--) {
    coins[i].display();
    if (player.hits(coins[i])) {
      coins.splice(i, 1);
      score++;
      coins.push(new Coin());
    }
  }

  player.move();
  player.display();

  ghost.move();
  ghost.display();

  if (player.hits(ghost)) {
    gameState = "end";
  }

  fill(255);
  textSize(20);
  text("Score: " + score, 70, 25);
}

//Buttons
function drawStartButton() {
  push();
  fill(0, 200, 0);
  stroke(255);
  strokeWeight(3);
  rect(width/2 - 60, height/2 - 25, 120, 50, 10);
  fill(255);
  noStroke();
  textSize(20);
  text("START", width/2, height/2);
  pop();
}

function drawRestartButton() {
  push();
  fill(200, 0, 0);
  stroke(255);
  strokeWeight(3);
  rect(width/2 - 60, height/2 + 20, 120, 50, 10);
  fill(255);
  noStroke();
  textSize(20);
  text("RESTART", width/2, height/2 + 45);
  pop();
}

//Mouse
function mousePressed() {
  if (gameState === "intro") {
    if (overButton(width/2 - 60, height/2 - 25, 120, 50)) {
      gameState = "play";
    }
  } else if (gameState === "end") {
    if (overButton(width/2 - 60, height/2 + 20, 120, 50)) { // updated Y
      resetGame();
      gameState = "play";
    }
  }
}

//Helper
function overButton(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

//Reset
function resetGame() {
  score = 0;
  player = new Player();
  ghost = new Ghost();
  createCoins();
}

//Endless Coins
function createCoins() {
  coins = [];
  for (let i = 0; i < 5; i++) {
    coins.push(new Coin());
  }
}

//Player
class Player {
  constructor() {
    this.x = 200;
    this.y = 200;
    this.size = 40;
    this.speed = 2.5;
    this.dirX = 1;
    this.dirY = 0;
  }

  move() {
    let moveX = 0;
    let moveY = 0;

    if (keyIsDown(LEFT_ARROW)) moveX = -this.speed;
    if (keyIsDown(RIGHT_ARROW)) moveX = this.speed;
    if (keyIsDown(UP_ARROW)) moveY = -this.speed;
    if (keyIsDown(DOWN_ARROW)) moveY = this.speed;

    this.x += moveX;
    this.y += moveY;

    if (moveX !== 0 || moveY !== 0) {
      this.dirX = moveX;
      this.dirY = moveY;
    }

    this.x = constrain(this.x, 20, width - 20);
    this.y = constrain(this.y, 20, height - 20);
  }

  display() {
    push();
    translate(this.x, this.y);
    let angle = atan2(this.dirY, this.dirX);
    rotate(angle);
    imageMode(CENTER);
    image(pacmanImg, 0, 0, this.size, this.size);
    pop();
  }

  hits(obj) {
    let d = dist(this.x, this.y, obj.x, obj.y);
    return d < 25;
  }
}

//Ghost
class Ghost {
  constructor() {
    this.x = 100;
    this.y = 100;
    this.size = 40;
    this.speed = 2;
  }

  move() {
    let dx = player.x - this.x;
    let dy = player.y - this.y;

    let distance = sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      dx /= distance;
      dy /= distance;
    }

    this.x += dx * this.speed;
    this.y += dy * this.speed;

    this.x = constrain(this.x, 20, width - 20);
    this.y = constrain(this.y, 20, height - 20);
  }

  display() {
    image(ghostImg, this.x - 20, this.y - 20, this.size, this.size);
  }
}

//Coin
class Coin {
  constructor() {
    this.x = random(30, width - 30);
    this.y = random(30, height - 30);
    this.size = 25;
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(212, 175, 55);
    stroke(160, 130, 40);
    strokeWeight(3);
    ellipse(0, 0, 30, 30);

    fill(235, 200, 120);
    noStroke();
    ellipse(0, 0, 22, 22);

    fill(80);
    textSize(10);
    textStyle(BOLD);
    text("1 TL", 0, 2);
    pop();
  }
}