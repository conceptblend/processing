const g_margin = 20;
const g_drawable_area = 400;

let g_scale = 1;

let baseAngle = 20;
let maxRevolutions = 360 / baseAngle;
let scaleHigh = 1.6;
let scaleLow = 0.8;

function setup() {

  const canvas_size = g_drawable_area + 2 * g_margin;

  colorMode(RGB, 255);

  angleMode(DEGREES);

  let opacityHigh = 255;
  let opacityLow = 255;

  createCanvas(canvas_size, canvas_size);

  noLoop();
}

function draw() {
  let originX = g_drawable_area / 2 + g_margin;
  let originY = g_drawable_area / 2 + g_margin + 180;

  background(0);

  for (let scale = scaleHigh; scale >= scaleLow; scale -= 0.1) {
    for (let rev = 0; rev <= maxRevolutions; rev++) {
      pedal(originX, originY, -baseAngle * rev, scale, color(255,8));
    }
  }

  for (let scale = scaleHigh; scale >= scaleLow; scale -= 0.1) {
    for (let rev = 0; rev <= maxRevolutions; rev++) {
      pedal(originX, originY, -baseAngle * rev, scale);
    }
  }

}

/**
 * ox = origin x
 * oy = origin y
 * theta = angle of rotation
 **/
function pedal(ox, oy, theta, scale, c) {
  let s = !!scale ? scale : 1;
  let a = 50 * s,
    b = 2 * a * s;
  if (c) {
    fill(c);
    noStroke();
  } else {
    noFill();
    strokeWeight(1);
    stroke(0, 64);
  }
  push();
  translate(ox, oy);
  rotate(theta);
  plotDot(b, a);
  plotDot(b, b);
  plotDot(a, b);
  pop();
}

function plotDot(x, y) {
  circle(x, y, 31*2);
  circle(x, y, 23*2);
  circle(x, y, 17*2);
  circle(x, y, 11*2);
}