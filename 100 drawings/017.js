const fps = 16;
const g_margin = 20;
const g_drawable_area = 800;

const g_mag = 4;

const g_numWalkers = 480;

let walkers = [];

function setup() {
  let canvas_size = g_drawable_area + 2 * g_margin;
  colorMode(HSB, 255);
  angleMode(DEGREES);

  createCanvas(canvas_size, canvas_size);

  background(255);
  frameRate(32);

  for (let n = 0; n < g_numWalkers; n++) {
    walkers.push(new Walker(width / 8, height / 8, g_mag));
  }
}

function draw() {
  for (let n = 0; n < g_numWalkers; n++) {
    walkers[n].draw();
  }
}

class Walker {
  constructor(start_x, start_y, magnitude) {
    this.c = {
      x: width / 2,
      y: height / 2
    };
    this.w = {
      x: start_x,
      y: start_y
    };
    this.magnitude = magnitude;
    this.scale = 0.28;
    this.angle = random(0, 360);
    this.onScreen = true;
  }
  draw() {
    
    if (!this.onScreen) return;
    
    let _w = this.w;
    let _c = this.c;

    let disturbedAngle = this.angle + random(-5, 25);
    let wn = {
      x: _w.x + this.magnitude * cos(disturbedAngle),
      y: _w.y + this.magnitude * sin(disturbedAngle)
    };
    let offsetFromCenter = {
      x: _w.x - _c.x,
      y: _w.y - _c.y
    };
    let b1 = {
      x: _w.x - offsetFromCenter.x * this.scale,
      y: _w.y + offsetFromCenter.y * this.scale
    };
    let b2 = {
      x: wn.x + offsetFromCenter.x * this.scale,
      y: wn.y - offsetFromCenter.y * this.scale
    };
    let distanceFromCenter = Math.sqrt(Math.pow(offsetFromCenter.x, 2) + Math.pow(offsetFromCenter.y, 2));
    
    noFill();
    strokeWeight(4);
    stroke(0, 0, 0, 128);
    bezier(_w.x, _w.y, b1.x, b1.y, b2.x, b2.y, wn.x, wn.y);

    strokeWeight(2);
    stroke(random(128,192), 255, 192, distanceFromCenter/ (width/2) * 255);
    bezier(_w.x, _w.y, b1.x, b1.y, b2.x, b2.y, wn.x, wn.y);

    this.w = wn;
    this.onScreen = isWithinCanvas(this.w.x, this.w.y, 80);
  }
}

function isWithinCanvas(x, y, buffer) {
  buffer = buffer || 0;
  return (x >= -buffer) && (x <= width+buffer) && (y >= -buffer) && (y <= height+buffer);
}

function keyPressed() {
  if (key == 'p' || key == ' ') {
    noLoop();
  } else if (key == 's') {
    loop();
  }
}