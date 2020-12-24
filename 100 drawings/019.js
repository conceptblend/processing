let isRecording = false;

const g_margin = 20;
const g_drawable_area = 400;
const g_canvas_size = g_drawable_area + 2 * g_margin;

const fps = 24;
const g_square_size = 140;
const g_scale = 1;

// the canvas capturer instance
var capturer = new CCapture({ format: 'png', framerate: fps });

var lightGreen, darkGreen, darkerRed, darkRed, lineWhite;

class RoamingPoint {
  // the `onUpdate` function should return an
  // object of shape { x: value, y: value }
  constructor(onUpdate, x, y, options) {
    this.x = x || 0;
    this.y = y || 0;
    this.onUpdate = onUpdate;
    this.iteration = 0;
    this.active = true;
    this.options = {
      maxIterations: 100,
    };
    if (options && options.maxIterations !== undefined) {
      this.options.maxIterations = options.maxIterations;
    }
  }
  getPosition() {
    return {
      x: this.x,
      y: this.y
    };
  }
  update() {
    if (this.iteration < this.options.maxIterations) {
      let p = this.onUpdate(this.x, this.y, ++this.iteration);
      this.x = p.x;
      this.y = p.y;
    } else {
      this.active = false;
    }
  }
  isActive() {
    return this.active;
  }
}

const anchor1 = new RoamingPoint(
  function(_x, _y, iteration) {
    return {
      x: _x,
      y: _y
    }
  },
  0,
  0, {
    maxIterations: 20 * g_scale
  }
);

const anchor2 = new RoamingPoint(
  function(_x, _y, iteration) {
    return {
      x: _x,
      y: _y
    }
  },
  g_square_size,
  0, {
    maxIterations: 12 * g_scale
  }
);

const control1 = new RoamingPoint(
  function(_x, _y, iteration) {
    return {
      x: _x + cos(iteration * 15) * 7,
      y: _y - 6,
    }
  },
  g_square_size / 2,
  g_square_size / 3 * 2, {
    maxIterations: 71 * g_scale
  }
);

const control2 = new RoamingPoint(
  function(_x, _y, iteration) {
    return {
      x: _x + 3 + cos(iteration * 30) * 3,
      y: _y - 3,
    }
  },
  g_square_size / 2,
  g_square_size / 3 * 2, {
    maxIterations: 61 * g_scale
  }
);

function setup() {

  colorMode(HSB, 100);
  angleMode(DEGREES);
  let density = displayDensity();
  pixelDensity(density);

  createCanvas(g_canvas_size, g_canvas_size);

  darkRed = color(0, 82, 70, 100);
  darkerRed = color(0, 82, 57, 100);
  lightGreen = color(99 / 360 * 100, 79, 62, 100);
  darkGreen = color(101 / 360 * 100, 82, 70, 100);
  lineWhite = color(0, 0, 100, 2);

  background(darkRed);

  frameRate(fps);
}

function draw() {
  if (!isRecording) {
    // start the recording after the animation loop has begun
    capturer.start();
    isRecording = true;
  }

  translate(width / 2, height / 2);

  for (var n = 0, sides = 12; n < sides; n++) {
    push();

    rotate(n * (360 / sides));
    translate(8, 0);
    drawCurve(
      anchor1.getPosition(),
      control1.getPosition(),
      control2.getPosition(),
      anchor2.getPosition(),
      !true
    );

    pop();
  }

  anchor1.update();
  anchor2.update();
  control1.update();
  control2.update();

  capturer.capture(document.getElementById('defaultCanvas0'));

  let isActive = anchor1.isActive() || anchor2.isActive() || control1.isActive() || control2.isActive();
  if (!isActive) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
  }
}

// a => Anchor point
// c => Control point
function drawCurve(a1, c1, c2, a2, showHandle) {

  if (showHandle) {
    plotControlHandle(a1, c1);
    plotControlHandle(a2, c2);
  }

  //let c = color(0, 0, 0, 60);
  // let c = color(57/360*100, 79, 68, 50);
  let c = lineWhite;
  noStroke();
  fill(c);
  bezier(
    a1.x,
    a1.y,
    c1.x,
    c1.y,
    c2.x,
    c2.y,
    a2.x,
    a2.y
  );
  
  strokeWeight(2);
  stroke(darkRed);
  noFill();
  bezier(
    a1.x,
    a1.y,
    c1.x,
    c1.y,
    c2.x,
    c2.y,
    a2.x,
    a2.y
  );
  
  noStroke();
  fill(darkerRed);
  // ellipse(a1.x, a1.y, 8);
  // ellipse(a2.x, a2.y, 8);
  ellipse(c1.x, c1.y, 3);
  ellipse(c2.x, c2.y, 3);
}

function plotControlHandle(p, c) {
  stroke(color(255, 255, 255, 92))
  strokeWeight(1);
  line(p.x, p.y, c.x, c.y);
  ellipse(c.x, c.y, 4)
}

function drawOLD() {
  if (!isRecording) {
    // start the recording after the animation loop has begun
    capturer.start();
    isRecording = true;
  }

  let radius = g_drawable_area / 2;

  let x = cos(d * increment) * radius * 0.7;
  let y = sin(d * increment) * radius * 0.7;
  let p1 = {
    x: x + radius,
    y: y + radius + 40,
  };
  let p2 = {
    x: g_drawable_area * 0.65,
    y: 20,
  };
  let p3 = {
    x: x,
    y: y + 120,
  };
  let p4 = {
    x: g_drawable_area * 0.65,
    y: g_drawable_area * 0.65,
  };

  let c = color(((maxIterations - d) / maxIterations) * 255, 192, 128, 156);
  strokeWeight(1);
  stroke(c);
  noFill();

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

  noStroke();
  fill(c);
  circle(p1.x + g_margin, p1.y + g_margin, 4);

  let dx = bezierPoint(p1.x, p2.x, p3.x, p4.x, 0.06);
  let dy = bezierPoint(p1.y, p2.y, p3.y, p4.y, 0.06);
  circle(dx + g_margin, dy + g_margin, 2);

  dx = bezierPoint(p1.x, p2.x, p3.x, p4.x, 0.07);
  dy = bezierPoint(p1.y, p2.y, p3.y, p4.y, 0.07);
  circle(dx + g_margin, dy + g_margin, 2);

  capturer.capture(document.getElementById('defaultCanvas0'));

  if (isAnimated) {
    d++;
    if (d > maxIterations) {
      noLoop();
      console.log('finished recording.');
      capturer.stop();
      capturer.save();
      return;
    }
  }
}
