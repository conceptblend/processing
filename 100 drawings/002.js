const margin = 40;
const steps = 40;
let p_red;
let p_cream;
let p_orange;
let p_green;
let bg;

let origin_x, origin_y;

function setup() {
  const canvas_size = 500 + 2 * margin;
  colorMode(RGB, 255);
  p_red = color(131, 7, 3, 128);
  p_cream = color(223, 204, 174);
  p_orange = color(217, 146, 21);
  p_green = color(159, 184, 104);
  createCanvas(canvas_size, canvas_size);
  angleMode(DEGREES);
  noLoop();
  origin_x = width / 3.14159;
  origin_y = height / 1.62;
}

function draw() {
  background(p_cream);
  drawRaggedGrid(color(255,255,255,128));
  for (let i = 0, iterations = 3; i < iterations; i++) {
    drawSpiralizer(-85 - 2 ^ i);
  }
}

function drawRaggedGrid(c) {
  let divisions = 32;
  let block_w = width / divisions;
  let block_h = height / divisions;
  fill(c);
  noStroke();

  for (let x = 0; x < divisions; x++) {
    for (let y = 0; y < divisions; y++) {
      push();
      translate(x * block_w, y * block_h);
      rotate(random(-2, 2));
      rect(0, 0, block_w, block_h);
      pop();
    }
  }
}

function drawSpiralizer(start_angle) {
  for (let r = steps, r_steps = steps; r > 0; r--) {
    let size = 5 + 13 * (r + 1)
    let from = start_angle + random(-31, 31);
    let to = start_angle + 3 * (1 + r);
    noFill();
    drawLine(to, size / 2);
    strokeCap(ROUND);
    //strokeWeight(r / r_steps * 17+5);
    strokeWeight(3);
    stroke(p_red);
    arc(origin_x, origin_y, size, size, from, to);

  }
}

function drawLine(theta, length) {
  if (length % 11 >= 4) {
    let cx = cos(theta);
    let sy = sin(theta);
    let start_x = origin_x + cx * length;
    let start_y = origin_y + sy * length;
    let end_x = origin_x + cx * (length * 1.9);
    let end_y = origin_y + sy * (length * 1.9);

    strokeCap(ROUND);
    strokeWeight(1);
    stroke(p_red);
    line(start_x, start_y, end_x, end_y);
  }
}