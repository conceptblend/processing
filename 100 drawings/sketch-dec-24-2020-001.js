const g_margin = 20;
const g_drawable_area = 400;
const g_canvas_size = g_drawable_area + 2 * g_margin;

const isAnimated = true;
const fps = 16;

const g_yOffset = -48;

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
    if (options) {
      options.maxIterations && (this.options.maxIterations = options.maxIterations);
    }
  }
  getPosition() {
    return {
      x: this.x,
      y: this.y
    };
  }
  update() {
    if (this.iteration <= this.options.maxIterations) {
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
      x: 8 * (iteration + 1) - cos(iteration*32) * 32,
      y: g_yOffset
    }
  },
  -8,
  g_yOffset,
  {
    maxIterations: 64
  }
);

const anchor2 = new RoamingPoint(
  function(_x, _y, iteration) {
    return {
      x: 4 * (iteration + 1) + cos(iteration*60) * 8,
      y: g_canvas_size - g_yOffset
    }
  },
  -8,
  g_canvas_size - g_yOffset,
  {
    maxIterations: 81
  }
);

const control1 = new RoamingPoint(
  function(_x, _y, iteration) {
    return {
      x: 2 * (iteration + 1) + cos(iteration*4) * 12,
      y: g_canvas_size / 4,
    }
  },
  0,
  g_canvas_size / 4,
  {
    maxIterations: 32
  }
);

const control2 = new RoamingPoint(
  function(_x, _y, iteration) {
    return {
      x: 12 * (iteration + 1) + cos(iteration*16) * 24,
      y: g_canvas_size - (g_canvas_size / 4),// + sin(iteration*6) * 24
    }
  },
  0,
  g_canvas_size / 4,
  {
    maxIterations: 32
  }
);

function setup() {

  colorMode(HSB, 100);
  angleMode(DEGREES);

  createCanvas(g_canvas_size, g_canvas_size);
  background(100);

  if (isAnimated) {
    frameRate(fps);
  } else {
    noLoop();
  }
}

function draw() {

  drawCurve(
    anchor1.getPosition(),
    control2.getPosition(),
    control2.getPosition(),
    anchor2.getPosition(),
    !true
  );
   drawCurve(
    anchor1.getPosition(),
    control1.getPosition(),
    control1.getPosition(),
    anchor2.getPosition(),
    !true
  );
  
  anchor1.update();
  anchor2.update();
  control1.update();
  control2.update();
  
  let isActive = anchor1.isActive() || anchor2.isActive() || control1.isActive() || control2.isActive();
  if (!isActive) {
    noLoop();
  }
}

// a => Anchor point
// c => Control point
function drawCurve(a1, c1, c2, a2, showHandle) {

  if (showHandle) {
    plotControlHandle(a1, c1);
    plotControlHandle(a2, c2);
  }

  let c = color(0, 0, 0, 60);
  strokeWeight(1);
  stroke(c);
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
  // noStroke();
  // fill(c);
  // ellipse(a1.x, a1.y, 4);
  // ellipse(a2.x, a2.y, 4);
  // ellipse(c1.x, c1.y, 2);
  // ellipse(c2.x, c2.y, 2);
}

function plotControlHandle(p, c) {
  stroke(color(255, 255, 255, 92))
  strokeWeight(1);
  line(p.x, p.y, c.x, c.y);
  ellipse(c.x, c.y, 4)
}