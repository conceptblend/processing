const g_margin = 20;
const g_drawable_area = 600;

let omega = 128;
let wat = 1.5;
const isAnimated = true;
const isLooped = false;

function setup() {
  const canvas_size = g_drawable_area + 2 * g_margin;

  colorMode(HSL, 255);
  angleMode(DEGREES);

  createCanvas(canvas_size, canvas_size);

  if (isAnimated) {
    frameRate(32);
  } else {
    noLoop();
  }
  background(0);
}

let n = 0;
let max_n = g_drawable_area;
let increment = max_n / 180;

function draw() {
  isLooped && background(0, 8);
  let theta = n;
  let p1 = {
    x: n + cos(theta) * 71.5,
    y: n + sin(theta) * 15,
  };
  let p2 = {
    x: n / 7.15,
    y: g_drawable_area / 2,
  };
  let p3 = {
    x: 7.15,
    y: n,
  };
  let p4 = {
    x: g_drawable_area * 0.715,
    y: n - sin(theta) * 90,
  };
  strokeWeight(1);
  stroke((n / g_drawable_area) * 92 + 128, 192, 128, omega);
  //   stroke(0, 192, 255, 128);

  noFill();

  push();
  rotate(2);
  bezier(
    p1.x + g_margin,
    p1.y + g_margin,
    p2.x + g_margin,
    p2.y + g_margin,
    p3.x + g_margin,
    p3.y + g_margin,
    p4.x + g_margin,
    p4.y + g_margin
  );
  pop();

  // noStroke();
  // fill((n / g_drawable_area) * 128 + 128, 192, 128, omega);
  // ellipse(p1.x + g_margin, p1.y + g_margin, 3, 3);
  // ellipse(p4.x + g_margin, p4.y + g_margin, 3, 3);
  // ellipse(p1.x + g_margin, p1.y + g_margin, 8, 8);
  // ellipse(p4.x + g_margin, p4.y + g_margin, 8, 8);

  n += increment;

  if (n > max_n) {
    if (isLooped) {
      n = 0;
    } else {
      noLoop();
    }
  }
}
