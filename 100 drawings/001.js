const steps = 9;
const block_size = 48;
const triangle_size = 86;
const margin = 40;
let bg;

function setup() {
  const canvas_size = block_size * steps + 2 * margin;
  bg = color(229,200,158);
  colorMode(RGB, 255);
  createCanvas(canvas_size, canvas_size);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(bg);
  for (let x = 0, x_steps = steps; x < x_steps; x++) {
    for (let y = 0, y_steps = steps; y < y_steps; y++) {
      let c = color(x / x_steps * 255, 92, y / y_steps * 128, 192);
      drawTriangle(x * block_size + margin, y * block_size + margin, c, false);
    }
  }
  for (let x = 0, x_steps = steps; x < x_steps; x++) {
    for (let y = 0, y_steps = steps; y < y_steps; y++) {
      let c = color(x / x_steps * 255, 92, y / y_steps * 128, 192);
      drawTriangle(x * block_size + margin, y * block_size + margin, c, true);
    }
  }
  
}

function drawTriangle(ox, oy, c, s) {
  let offset = (block_size - triangle_size) / 4;
  push();
  translate(ox+offset, oy+offset);
  //rotate(ox % 11);
  //scale(oy % 9 / 7);
  //rotate(random(16));
  //rotate(-16);
  if (!s) {
    fill(c);
    noStroke();
    triangle(0, 0, triangle_size * 0.88, 0, 0, triangle_size);
  } else {
    noFill();
    strokeWeight(3);
    stroke(bg);
    triangle(0, 0, triangle_size * 0.88, 0, 0, triangle_size);
  }
  pop();
}