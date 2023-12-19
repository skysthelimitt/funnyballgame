let level = "";
let finish = false;
let oldState;
let playerSize = 20;
let speed = 5;
let mouseX,
  mouseY = 0;
let clickX = 0;
let clickY = 0;
let playerX = 0;
let playerY = 0;
let state = 0;
// state: 0 = main page, 1 = levels page, -1 = level
var frameTime = 0,
  lastLoop = new Date(),
  thisLoop;
let currentTime,
  firstTime = new Date();
var filterStrength = 20;
let keyUp,
  keyDown,
  keyLeft,
  keyRight,
  restart = false;
let curLevel;
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stateHandler();
    if (state == -1) {
      drawLevel(ctx);
      handleInput(canvas);
      drawPlayer(ctx);
      timer(ctx);
    }
    if (state == 0) {
      loadMainPage(ctx);
    }
    if (state == 1) {
      loadLevelsPage(ctx);
    }

    var thisFrameTime = (thisLoop = new Date()) - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
    if (restart) {
      restart = false;
    }
  }
  setInterval(draw, 1000 / 30);

  setInterval(function () {
    console.log((1000 / frameTime).toFixed(1) + " fps");
  }, 1000);
});
function drawPlayer(ctx) {
  ctx.beginPath();
  ctx.arc(playerX, playerY, playerSize, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
function timer(ctx) {
    if(!finish){
  currentTime = new Date().getTime();
  if (restart) {
    firstTime = new Date().getTime();
  }
  time = (currentTime - firstTime) / 1000;}
  ctx.fillStyle = "#00000088";
  ctx.font = "bold 30px Arial";
  ctx.fillRect(5, 5, ctx.measureText(time).width + 10, 30);
  ctx.fillStyle = "white";
  ctx.fillText(time, 10, 30);
}
async function drawLevel(ctx) {
  if (!curLevel) {
    await downloadLevel();
    restart = true;
  }
  if(!(curLevel.then && typeof curLevel.then === 'function')) {
  for (let i = 0; i < curLevel["levelData"]["rectangles"].length; i++) {
    ctx.fillStyle = "red";
    v1 = curLevel["levelData"]["rectangles"][i][0];
    v2 = curLevel["levelData"]["rectangles"][i][1];
    v3 = curLevel["levelData"]["rectangles"][i][2];
    v4 = curLevel["levelData"]["rectangles"][i][3];
    ctx.fillRect(v1, v2, v3, v4);
    if (RectCircleColliding({ x: playerX, y: playerY, r: playerSize }, { x: v1, y: v2, w: v3, h: v4 })) {
      restart = true;
    }
  }
  ctx.fillStyle = "blue";
  flag1 = curLevel["levelData"]["endFlag"][0];
  flag2 = curLevel["levelData"]["endFlag"][1];
  flag3 = curLevel["levelData"]["endFlag"][2];
  flag4 = curLevel["levelData"]["endFlag"][3];
  ctx.fillRect(flag1, flag2, flag3, flag4);
  if (RectCircleColliding({ x: playerX, y: playerY, r: playerSize }, { x: flag1, y: flag2, w: flag3, h: flag4 })) {
    finish = true;
  }}
}
document.addEventListener("keydown", (e) => {
  if (e.key == "w" || e.key == "ArrowUp") {
    keyUp = true;
  }
  if (e.key == "s" || e.key == "ArrowDown") {
    keyDown = true;
  }
  if (e.key == "a" || e.key == "ArrowLeft") {
    keyLeft = true;
  }
  if (e.key == "d" || e.key == "ArrowRight") {
    keyRight = true;
  }
  if (e.key == "r") {
    restart = true;
  }
});
document.addEventListener("keyup", (e) => {
  if (e.key == "w" || e.key == "ArrowUp") {
    keyUp = false;
  }
  if (e.key == "s" || e.key == "ArrowDown") {
    keyDown = false;
  }
  if (e.key == "a" || e.key == "ArrowLeft") {
    keyLeft = false;
  }
  if (e.key == "d" || e.key == "ArrowRight") {
    keyRight = false;
  }
});

function handleInput(canvas) {
  if (restart) {
    playerX = curLevel["levelData"]["startPos"][0] ?? 0;
    playerY = curLevel["levelData"]["startPos"][1] ?? 0;
    finish = false;
  }
  if(!finish) {
  if (keyUp) {
    playerY = playerY -= speed;
  }
  if (keyDown) {
    playerY = playerY += speed;
  }
  if (keyLeft) {
    playerX = playerX -= speed;
  }
  if (keyRight) {
    playerX = playerX += speed;
  }
  if (playerY > canvas.height - playerSize) {
    playerY = canvas.height - playerSize;
  }
  if (playerY < playerSize) {
    playerY = playerSize;
  }
  if (playerX > canvas.width - playerSize) {
    playerX = canvas.width - playerSize;
  }
  if (playerX < playerSize) {
    playerX = playerSize;
  }
}
}
async function downloadLevel() {
  let response = await fetch(`levels/${level}.json`);
  curLevel = await response.json();
}

function RectCircleColliding(circle, rect) {
  var distX = Math.abs(circle.x - rect.x - rect.w / 2);
  var distY = Math.abs(circle.y - rect.y - rect.h / 2);

  if (distX > rect.w / 2 + circle.r) {
    return false;
  }
  if (distY > rect.h / 2 + circle.r) {
    return false;
  }

  if (distX <= rect.w / 2) {
    return true;
  }
  if (distY <= rect.h / 2) {
    return true;
  }

  var dx = distX - rect.w / 2;
  var dy = distY - rect.h / 2;
  return dx * dx + dy * dy <= circle.r * circle.r;
}
function stateHandler() {
  if (!(state == oldState) && state == -1) {
    restart = true;
  }
  oldState = state;
}
function loadMainPage(ctx) {
  ctx.lineWidth = 5;
  ctx.fillStyle = "#101010";
  ctx.strokeStyle = "#7a7a7a";
  ctx.rect(150, 300, 300, 100);
  ctx.fill();
  ctx.stroke();
  ctx.font = "bold 50px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Levels", 220, 368);
  if (150 < clickX && clickX < 450 && 300 < clickY && clickY < 400) {
    state = 1;
  }
}

function loadLevelsPage(ctx) {
    ctx.lineWidth = 5;
    ctx.fillStyle = "#101010";
    ctx.strokeStyle = "#7a7a7a";
    ctx.rect(150, 100, 300, 100);
    ctx.fill();
    ctx.stroke();
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Easy 1", 220, 168);
    if (150 < clickX && clickX < 450 && 100 < clickY && clickY < 200) {
      state = -1;
      level = "e1";
    }
}

document.addEventListener("mousedown", (e) => {
  clickX = e.clientX;
  clickY = e.clientY;
});
