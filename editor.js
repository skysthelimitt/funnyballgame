let playerSize = 20;
let speed = 5;
let mouseX,
  mouseY = 0;
let startX = 0;
let startY = 0;
let state = 0;
let draw = false;
// state: 0 = main page, 1 = levels page, -1 = level
var frameTime = 0,
  lastLoop = new Date(),
  thisLoop;
let currentTime,
  firstTime = new Date();
var filterStrength = 20;

let curLevel;
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(150, 150, 300, 200);
    ctx.fillRect(0, 150, 150, 20);

    ctx.fillStyle = "blue";
    ctx.fillRect(150, 0, 50, 150);

    ctx.fillRect(50, 200, 40, 40);
  }
  setInterval(draw, 1000 / 30);
});