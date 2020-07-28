const fps = 16;
let isRecording = false;
const captureVideo = true;
// the canvas capturer instance
var capturer = new CCapture({ format: 'png', framerate: fps });

//------

const g_margin = 20;
const g_drawable_area = 400;

//
// L-System initiation
//
const lineLength = 4;
const lineScale = 1.000;
let angle = 0;
const exitAngle = angle; // 90
const rules = [['F', 'F+F-F-F+F']];

let direction = 1;

function setup() {
  let canvas_size = g_drawable_area + 2 * g_margin;
  colorMode(HSB, 255);
  angleMode(DEGREES);

  createCanvas(canvas_size, canvas_size);

  background(0);
  frameRate(fps);
}

function draw() {
  if (!isRecording && captureVideo) {
    // start the recording after the animation loop has begun
    capturer.start();
    isRecording = true;
  }
  background(0, 32);

  let l = new Lindenmayer();
  let axiom = 'F';
  let s = axiom;
  let iterations = 4;

  for (let i = 0; i < iterations; i++) {
    s = l.iterate(s);
  }
  push();
  translate(0, g_drawable_area * 0.66 + 2 * g_margin);
  rotate(-5);
  l.draw(s);
  pop();

  captureVideo && capturer.capture(document.getElementById('defaultCanvas0'));

  angle += direction;
  l.setAngle(angle);

  if (angle <= 0 || angle >= 90) {
    direction = -direction;
  }

  if (angle == exitAngle) {
    noLoop();
    console.log('finished recording.');
    if (captureVideo) {
        capturer.stop();
        capturer.save();
    }
    return;
  }
}

//
//  s <string>: The string defining the system
//
class Lindenmayer {
  constructor() {
    this.lineLength = lineLength;
    this.lineScale = lineScale;
    this.angle = angle;
    this.rules = rules;
  }

  iterate(s) {
    let len = s.length;
    let _s = '';
    for (let n = 0; n < len; n++) {
      let c = s[n];
      let r = this.getSymbolReplacement(c);

      if (r !== null) {
        _s += r;
      } else {
        _s += c;
      }
    }
    return _s;
  }

  draw(s) {
    let theta = 0;
    let x = 0;
    let y = 0;
    let _x, _y;
    let lineLength = this.lineLength;

    for (let n = 0, len = s.length; n < len; n++) {
      let c = s[n];
      switch (c) {
        case 'F':
          _x = x + cos(theta) * lineLength;
          _y = y + sin(theta) * lineLength;
          stroke(random(100, 146), 255, 255, 128);
          noFill();
        //   circle(_x, _y, 2);
          line(x, y, _x, _y);
          x = _x;
          y = _y;
          break;
        case '+':
          theta -= this.angle;
          break;
        case '-':
          theta += this.angle;
          break;
        default:
          break;
      }
      lineLength *= this.lineScale;
    }
  }
  setAngle(a) {
    this.angle = a;
  }

  getSymbolReplacement(symbol) {
    let found = false;
    let index = 0;
    let replacement = null;
    while (index < this.rules.length && !found) {
      if (this.rules[index][0] === symbol) {
        replacement = this.rules[index][1];
        found = true;
      }
      index++;
    }
    return replacement;
  }
}
