const fps = 16;
const g_margin = 20;
const g_drawable_area = 800;

const g_mag = 4;

const g_numWalkers = 86;

let walkers = [];

function setup() {
  let canvas_size = g_drawable_area + 2 * g_margin;
  colorMode(HSB, 255);
  angleMode(DEGREES);

  createCanvas(canvas_size, canvas_size);

  background(255);
  frameRate(32);

  for (let n = 0; n < g_numWalkers; n++) {
    walkers.push(new Walker(width / 3, height / 3, g_mag));
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
    this.scale = 0.25;
    this.angle = random(0, 360);
  }
  draw() {
    let _w = this.w;
    let _c = this.c;
    // let wn = {
    //   x: _w.x + random(-g_mag, g_mag),
    //   y: _w.y + random(-g_mag, g_mag)
    // };
    let disturbedAngle = this.angle + random(-5, 5);
    let wn = {
      x: _w.x + this.magnitude * cos(disturbedAngle),
      y: _w.y + this.magnitude * sin(disturbedAngle)
    };
    let b1 = {
      x: _w.x - (_w.x - _c.x) * this.scale,
      y: _w.y + (_w.y - _c.y) * this.scale
    };
    let b2 = {
      x: wn.x + (wn.x - _c.x) * this.scale,
      y: wn.y - (wn.y - _c.y) * this.scale
    };
    noFill();
    strokeWeight(1);
    stroke(128, 32, 32, 32);
    line(_w.x, _w.y, wn.x, wn.y);

    stroke(255, 0, 32, 64);

    //point(_w.x, _w.y);
    // Control handles
    line(_w.x, _w.y, b1.x, b1.y);
    // line(wn.x, wn.y, b2.x, b2.y);

    // Control points
    // circle(b1.x, b1.y, 3);
    // circle(b2.x, b2.y, 3);
    // strokeWeight(2);
    // point(b1.x, b1.y);
    // point(b2.x, b2.y);
    // stroke(255, 255, 192, 64);
    // strokeWeight(1);
    // bezier(_w.x, _w.y, b1.x, b1.y, b2.x, b2.y, wn.x, wn.y);


    this.w = wn;
  }
}


function keyPressed() {
  if (key == 'p' || key == ' ') {
    noLoop();
  } else if (key == 's') {
    loop();
  }
}