const margin = 40;
const steps = 40;
let bg;

function setup() {
  const canvas_size = 600 + 2 * margin;
  bg = color(229, 200, 158);
  colorMode(RGB, 255);
  createCanvas(canvas_size, canvas_size);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(bg);
  for (let i = 0, iterations=3; i < iterations; i++) {
    drawSpiralizer(-115 - 2^i);
  }
}

function drawSpiralizer(start_angle) {
  for (let r = steps, r_steps = steps; r > 0; r--) {
    let size = 5+13*(r+1)
    let from = start_angle + random(-31,31);
    let to = start_angle + 3*(1+r);
    noFill();
    strokeCap(ROUND);
    //strokeWeight(r / r_steps * 17+5);
    strokeWeight(3);
    //stroke(255,255,255,77);
    stroke(0,0,0,74);
    arc(width/2, height/2, size, size, from, to);
  }
}