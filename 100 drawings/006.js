const g_margin = 20;
const g_drawable_area = 400;
const g_doFill = true;

let g_scale = 1;

let baseAngle = 30;
let maxRevolutions = 270 / baseAngle;
let scaleHigh = 1.6;
let scaleLow = 0.4;

function setup() {

  const canvas_size = g_drawable_area + 2 * g_margin;

  colorMode(RGB, 255);

  angleMode(DEGREES);

  let opacityHigh = 255;
  let opacityLow = 255;

  // Purple and yellow
  gc_start = color(239, 237, 11);
  gc_end = color(84, 19, 87);

  createCanvas(canvas_size, canvas_size);

  noLoop();
}

function draw() {
  let originX = g_drawable_area / 2 + g_margin;
  let originY = g_drawable_area / 2 + g_margin + 80;

  if (g_doFill) {
    background(gc_end);
  } else {
    background(gc_start);
  }

  if (g_doFill) {
    for (let scale = scaleHigh; scale >= scaleLow; scale -= 0.1) {
      for (let rev = 0; rev <= maxRevolutions; rev++) {
        let c = lerpColor(gc_start, gc_end, scale / scaleHigh);
        pedal(originX, originY, -baseAngle * rev, scale, c);
      }
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
    if (g_doFill) {
      stroke(239, 237, 11, 64);
    } else {
      stroke(0, 128);
    }
  }
  push();
  translate(ox, oy);
  rotate(theta);
  beginShape();
  vertex(0, 0);
  vertex(b, a);
  vertex(b, b);
  vertex(a, b);
  vertex(0, 0);
  endShape();
  pop();
}
