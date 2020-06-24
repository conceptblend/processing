const g_margin = 20;
const g_drawable_area = 400;

let d = 0;
const increment = 4;
const maxIterations = 360 / increment;
const isAnimated = true;
const fps = 16;

let isRecording = false;

// the canvas capturer instance
var capturer = new CCapture({ format: 'png', framerate: fps });

function setup() {
  const canvas_size = g_drawable_area + 2 * g_margin;

  colorMode(HSL, 255);
  angleMode(DEGREES);

  createCanvas(canvas_size, canvas_size);
  background(0);

  if (isAnimated) {
    frameRate(fps);
  } else {
    noLoop();
  }
}

function draw() {
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
