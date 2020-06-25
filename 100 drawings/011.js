class CircleIterator {
  constructor(radius, steps) {
    this.radius = radius;
    this.steps = steps;
    this.currentIndex = 0;
    this.theta = 360 / steps; // Relies on angleMode(DEGREES)
  }
  getIndex() {
    return this.currentIndex;
  }
  getProgress() {
    return this.currentIndex / this.steps;
  }
  next() {
    if (this.currentIndex < this.steps) {
      let x = cos(this.theta * this.currentIndex) * this.radius;
      let y = sin(this.theta * this.currentIndex) * this.radius;
      this.currentIndex++;
      return {
        x: x,
        y: y,
      };
    } else {
      return null;
    }
  }
}

class CurveBall {
  constructor(radius, steps, offset) {
    this.radius = radius;
    this.steps = steps;
    this.offset = offset;
    this.circ1 = new CircleIterator(radius, steps);
    this.circ2 = new CircleIterator(radius * 1.4, steps);

    this.makeMark = function (point1, point2, offset, c) {
      let rp1 = {
        x: point1.x + offset,
        y: point1.y + offset,
      };
      let rp2 = {
        x: point2.x + offset,
        y: point2.y + offset,
      };

      strokeWeight(1);
      stroke(c);
      noFill();
      bezier(offset, rp1.y, rp1.x, rp1.y, rp2.x, rp2.y, rp2.x, offset);

      fill(c);
      noStroke();
      circle(rp1.x, rp1.y, 3);
    };
  }
  step() {
    let p1 = this.circ1.next();
    let p2 = this.circ2.next();
    if (p1 !== null && p2 !== null) {
      let c = color((this.circ1.getProgress() * 256) % 256, 255, 128, 128);
      // let c = color(0, 255, 255, 128);
      this.makeMark(p2, p1, this.offset, c);
      return true;
    } else {
      return false;
    }
  }
}

const g_margin = 20;
const g_drawable_area = 400;

let curvy;
let curvy2;

// the canvas capturer instance
let fps = 8;
let capturer = new CCapture({ format: 'png', framerate: fps });
let isRecording = false;

let increments = [];

function setup() {
  const canvas_size = g_drawable_area + 2 * g_margin;

  for (let n = 3; n < 360; n++) {
    if (360 % n == 0 && 90 % n == 0) {
      increments.push(n);
    }
  }
  for (let n = 360; n > 2; n--) {
    if (360 % n == 0 && 90 % n == 0) {
      increments.push(n);
    }
  }

  colorMode(HSL, 255);
  angleMode(DEGREES);

  createCanvas(canvas_size, canvas_size);

  frameRate(fps);
}

let iteration = 0;

function draw() {
  if (!isRecording) {
    // start the recording after the animation loop has begun
    capturer.start();
    isRecording = true;
  }
  background(0);

  let maxIterations = 360 / increments[iteration];
  curvy = new CurveBall(140, maxIterations, g_drawable_area / 2 + g_margin);
  curvy2 = new CurveBall(130, maxIterations, g_drawable_area / 2 + g_margin);

  while (curvy.step() && curvy2.step()) {}

  capturer.capture(document.getElementById('defaultCanvas0'));

  iteration++;
  if (increments[iteration] === undefined) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }
}
