const margin = 40;

let bg, c_grad_start, c_grad_end, c_fill;

function setup() {
  const canvas_size = 400 + 2 * margin;
  colorMode(RGB, 255);

  c_grad_start = color("#15377A");
  c_grad_end = color("#4978B8");
  c_fill = color(218, 192, 120, 4);

  background(c_grad_start);

  createCanvas(canvas_size, canvas_size);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  let base_x = width / 2 - 24;
  let base_y = height / 2;

  //background(255);
  // fill the background with a gradient
  gradientFill(c_grad_start, c_grad_end, 48);

  cycle(54, base_x + 48, base_y + 36, true);
  cycle(36, base_x - 48, base_y - 16, true);
  cycle(54, base_x + 48, base_y + 36, false);
  cycle(36, base_x - 48, base_y - 16, false);
  //cycle(24);
  //cycle(12);
  //cycle(6);

}

function gradientFill(c_start, c_end, scale) {
  let size_x = width / scale;
  let size_y = height / scale;
  noStroke();
  for (let y = 0; y < scale; y++) {
    let c = lerpColor(c_start, c_end, y / scale);
    for (let x = 0; x < scale; x++) {
      fill(c);
      rect(x * size_x, y * size_y, size_x, size_y);
    }
  }
}

function cycle(steps, cx, cy, solid) {
  let alpha = 360 / steps;
  let offset = 0;
  let center_x = cx || width / 2;
  let center_y = cy || height / 2;
  for (let n = 0; n < steps; n++) {
    drawEllipse(center_x, center_y, n * alpha, n * 7, solid);
  }
}

function drawEllipse(x, y, theta, size, solid) {
  if (!!!solid) {
    strokeWeight(1);
    stroke(21, 55, 122, 48);
    //stroke(255, 24);
    noFill();
  } else {
    fill(c_fill);
    noStroke();
  }

  push();
  translate(x, y);
  rotate(theta);
  ellipse(0, 0, size, size * 1.35);
  pop();
}