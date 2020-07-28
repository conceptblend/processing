const fps = 16;
const captureVideo = false;
// the canvas capturer instance
var capturer = new CCapture({ format: 'png', framerate: fps });
let isRecording = false;
const maxIterations = fps * 3;
let iterationCount = 0;

const g_margin = 20;
const g_drawable_area = 420;

let l;

function setup() {
  let canvas_size = g_drawable_area + 2 * g_margin;
  colorMode(HSB, 255);
  angleMode(DEGREES);

  createCanvas(canvas_size, canvas_size);

  background(0);
  frameRate(fps);
  !captureVideo && noLoop();

  const lineLength = 20;
  const lineScale = 1.0;
  const angle = 90; //88.995;
  const jitterFactor = 3;
  const rules = [['F', 'FF+F-F+F+FF']];
  const fnDraw = function (x1, y1, x2, y2) {
    // stroke(0, 0, random(47, 68), 128);
    stroke(253/360*255, 255, random(128, 148), 128);
    noFill();
    line(x1, y1, jitter(x2, jitterFactor), jitter(y2, jitterFactor));
  };

  l = new Lindenmayer(rules, fnDraw, angle, lineLength, lineScale);
  l.setAxiom('F+F+F+F');

  let iterations = 3;
  for (let i = 0; i < iterations; i++) {
    l.iterate();
  }
}

function draw() {
  if (!isRecording && captureVideo) {
    // start the recording after the animation loop has begun
    capturer.start();
    isRecording = true;
  }
  background(255);
  push();
  translate(
    g_drawable_area - 2 * g_margin,
    g_drawable_area * 0.5 - 1.5 * g_margin
  );
  l.draw();
  pop();

  if (captureVideo) {
    capturer.capture(document.getElementById('defaultCanvas0'));

    if (++iterationCount >= maxIterations) {
      noLoop();
      console.log('finished recording.');
      if (captureVideo) {
        capturer.stop();
        capturer.save();
      }
      return;
    }
  }
}

function jitter(n, strength) {
  if (strength === undefined) {
    return n;
  }
  return n + random(-strength, strength);
}
